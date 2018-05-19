Fullscreen API Interface
========================

A modular Fullscreen API interface that can be used without
interfering with other potential polyfills added at a global level.

[More information about the Fullscreen API](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API).

## Installation

```sh
npm install --save @jsilvermist/fullscreen-api
```

## Usage

You can use the default import to import all methods using simplified names:

```javascript
import fullscreen from '@jsilvermist/fullscreen-api';

fullscreen.enabled;
fullscreen.element;
fullscreen.request(targetElement);
fullscreen.exit();
```

Or you can import individual functions based on w3 api names:

```javascript
import { fullscreenEnabled, fullscreenElement, requestFullscreen, exitFullscreen } from '@jsilvermist/fullscreen-api';

fullscreenEnabled;
fullscreenElement;
requestFullscreen(targetElement);
exitFullscreen();
```

To maintain encapsulation and prevent side effects, there are 2 listeners provided for you to add callbacks to:

```javascript
function handleChange() {...}
function handleError() {...}

<fullscreen.addListener|addFullscreenListener>('change', handleChange);
<fullscreen.addListener|addFullscreenListener>('error', handleError);

<fullscreen.removeListener|removeFullscreenListener>('change', handleChange);
<fullscreen.removeListener|removeFullscreenListener>('error', handleError);
```
