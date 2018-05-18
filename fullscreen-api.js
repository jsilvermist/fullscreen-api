const apis = {
  w3: {
    enabled: "fullscreenEnabled",
    element: "fullscreenElement",
    request: "requestFullscreen",
    exit:    "exitFullscreen",
    events: {
      change: "fullscreenchange",
      error:  "fullscreenerror",
    },
  },
  webkit: {
    enabled: "webkitFullscreenEnabled",
    element: "webkitCurrentFullScreenElement",
    request: "webkitRequestFullscreen",
    exit:    "webkitExitFullscreen",
    events: {
      change: "webkitfullscreenchange",
      error:  "webkitfullscreenerror",
    },
  },
  moz: {
    enabled: "mozFullScreenEnabled",
    element: "mozFullScreenElement",
    request: "mozRequestFullScreen",
    exit:    "mozCancelFullScreen",
    events: {
      change: "mozfullscreenchange",
      error:  "mozfullscreenerror",
    },
  },
  ms: {
    enabled: "msFullscreenEnabled",
    element: "msFullscreenElement",
    request: "msRequestFullscreen",
    exit:    "msExitFullscreen",
    events: {
      change: "MSFullscreenChange",
      error:  "MSFullscreenError",
    },
  },
};

const w3 = apis.w3;
let api = null;
for (const vendor in apis) {
  if (apis[vendor].enabled in document) {
    api = apis[vendor];
    break;
  }
}

const fullscreen = {};

// Mirror initial static properties
fullscreen[w3.enabled] = document[api.enabled];
fullscreen[w3.element] = document[api.element];

// Bind exit method
fullscreen[w3.exit] = document[api.exit].bind(document);

// Call request for fullscreen on element
fullscreen[w3.request] = function(target) {
  target[api.request].call(target);
};

// Check if target is active fullscreen element
fullscreen.fullscreenActive = function(target) {
  return this[w3.enabled] && this[w3.element] === target;
};

// Register Fullscreen API to document or custom-element
fullscreen.registerFullscreen = function(target) {

  target = target || document;

  if (api && api !== w3) {

    // [TODO]: Where should this dispatch the w3 event?
    // target || document || by-callback

    target.addEventListener(api.events.change, (e) => {
      e.stopPropagation();
      e.stopImmediatePropagation();

      // Update static properties on change
      this[w3.enabled] = document[api.enabled];
      this[w3.element] = document[api.element];

      target.dispatchEvent(new CustomEvent(w3.events.change, {
        detail: { originalEvent: e }
      }));
    });

    target.addEventListener(api.events.error, (e) => {
      e.stopPropagation();
      e.stopImmediatePropagation();

      target.dispatchEvent(new CustomEvent(w3.events.error, {
        detail: { originalEvent: e }
      }));
    });

    return true;

  } else if (api && api === w3) {

    // Mirror initial static properties
    this[w3.enabled] = document[api.enabled];
    this[w3.element] = document[api.element];

    target.addEventListener(api.events.change, (e) => {
      // Update static properties on change
      this[w3.enabled] = document[api.enabled];
      this[w3.element] = document[api.element];
    });

    return true;

  } else {

    return false;

  }

};

export default fullscreen;
