export type IHijackContext<T extends unknown[], U> = { args: T; result?: U };

const navigateCallbacks = new Set<() => void>();
let historyHijacked = false;

export interface IHijackOptions<T extends unknown[], U> {
  before?: (ctx: IHijackContext<T, U>) => void;
  after?: (ctx: IHijackContext<T, U>) => void;
}

export function hijack<T extends unknown[], U>(
  fn: (...args: T) => U,
  options?: IHijackOptions<T, U>,
) {
  const hijacked = function (this: any, ...args: T) {
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

function hookNavigation() {
  if (historyHijacked) return;

  // The Navigation API is experimental and support for it is still limited.
  // See the browsers that support it below:
  // https://developer.mozilla.org/en-US/docs/Web/API/Navigation
  if (typeof window !== "undefined" && window.navigation && window.navigation.addEventListener) {
    historyHijacked = true;
    window.navigation.addEventListener("navigate", handleNavigate);
    return true;
  }
  return false;
}

function handleNavigate() {
  navigateCallbacks.forEach((callback) => callback());
}

export function onNavigate(callback: () => void) {
  // Prefer the modern Navigation API when it is available
  if (!historyHijacked && !hookNavigation()) {
    hookHistory();
  }
  navigateCallbacks.add(callback);
  return () => {
    navigateCallbacks.delete(callback);
  };
}

export const versions = Object.assign((typeof VM !== "undefined" && VM?.versions) || {}, {
  url: __VERSION__,
});
