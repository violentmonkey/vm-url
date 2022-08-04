# @violentmonkey/url

[![NPM](https://img.shields.io/npm/v/@violentmonkey/url.svg)](https://npm.im/@violentmonkey/url)
![License](https://img.shields.io/npm/l/@violentmonkey/url.svg)

Add SPA support to your userscript.

## Usage

### Importing

1. Use in a userscript:

   ```js
   // ...
   // @require https://cdn.jsdelivr.net/npm/@violentmonkey/url
   // ...

   const { onNavigate } = VM;
   ```

1. Use as a module:

   ```bash
   $ yarn add @violentmonkey/url
   ```

   ```js
   import { onNavigate } from '@violentmonkey/url';
   ```

### Handling

```js
function handleNavigate() {
  resetAllFeatures();
  if (window.location.pathname === '/foo') {
    enableFeatureFoo();
  } else if (window.location.pathname === '/bar') {
    enableFeatureBar();
  }
}

// Watch route change
VM.onNavigate(handleNavigate);

// Call it once for the initial state
handleNavigate();
```
