export type IHijackContext<T extends unknown[], U> = { args: T; result?: U };

const navigateCallbacks = new Set<() => void>();
let historyHijacked = false;

export interface IHijackOptions<T extends unknown[], U> {
  before?: (ctx: IHijackContext<T, U>) => void;
  after?: (ctx: IHijackContext<T, U>) => void;
}

export function hijack<T extends unknown[], U>(
  fn: (...args: T) => U,
  options?: IHijackOptions<T, U>
) {
  const hijacked = function (...args: T) {
    const ctx: IHijackContext<T, U> = { args, result: undefined };
    options?.before?.(ctx);
    ctx.result = fn.apply(this, ctx.args);
    options?.after?.(ctx);
    return ctx.result;
  };
  hijacked.__fn = fn;
  return hijacked;
}

function hookHistory() {
  if (historyHijacked) return;
  historyHijacked = true;
  window.history.pushState = hijack(window.history.pushState, {
    after: handleNavigate,
  });
  window.history.replaceState = hijack(window.history.replaceState, {
    after: handleNavigate,
  });
}

function handleNavigate() {
  navigateCallbacks.forEach((callback) => callback());
}

export function onNavigate(callback: () => void) {
  hookHistory();
  navigateCallbacks.add(callback);
  return () => {
    navigateCallbacks.delete(callback);
  };
}

export const versions = Object.assign(
  (typeof VM !== 'undefined' && VM?.versions) || {},
  {
    url: 'process.env.VERSION',
  }
);
