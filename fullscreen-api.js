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

export const fullscreen = {

  // Mirror initial static properties
  enabled: document[api.enabled] || false,
  element: document[api.element] || null,

  // Check if there is currently an active fullscreen element
  get active() {
    return this.enabled && this.element;
  },

  // Call request for fullscreen on element
  request(target) {
    target[api.request].call(target);
  },

  // Bind exit method
  exit: document[api.exit].bind(document),

  // Register Polyfill on document or custom-element
  registerPolyfill(target) {
    target = target || document;

    if (api && api !== w3) {

      // [TODO]: Where should this dispatch the w3 event?
      // target || document || by-callback

      target.addEventListener(api.events.change, (e) => {
        e.stopPropagation();
        e.stopImmediatePropagation();

        // Update static properties on change
        this.enabled = document[api.enabled];
        this.element = document[api.element];

        document.dispatchEvent(new CustomEvent(w3.events.change, {
          detail: { originalEvent: e }
        }));
      });

      target.addEventListener(api.events.error, (e) => {
        e.stopPropagation();
        e.stopImmediatePropagation();

        document.dispatchEvent(new CustomEvent(w3.events.error, {
          detail: { originalEvent: e }
        }));
      });

      return true;

    } else if (api && api === w3) {

      target.addEventListener(api.events.change, (e) => {
        // Update static properties on change
        this.enabled = document[api.enabled];
        this.element = document[api.element];
      });

      return true;

    } else {

      return false;
    }
  },

};

export default fullscreen;
