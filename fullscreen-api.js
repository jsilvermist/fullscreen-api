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

let api = null;
for (const vendor in apis) {
  if (apis[vendor].enabled in document) {
    api = apis[vendor];
    break;
  }
}

const changeCallbacks = [];
const errorCallbacks = [];

export const fullscreen = {

  // Mirror initial static properties
  enabled: document[api.enabled] || false,
  element: document[api.element] || null,

  // Call request for fullscreen on element
  request(target) {
    target[api.request].call(target);
  },

  // Bind exit method
  exit: document[api.exit].bind(document),

  addChangeListener(cb) {
    if (typeof cb === 'function') {
      changeCallbacks.push(cb);
    } else {
      console.warn('[fullscreen-api] Change callback is not a function:', cb);
    }
  },

  addErrorListener(cb) {
    if (typeof cb === 'function') {
      errorCallbacks.push(cb);
    } else {
      console.warn('[fullscreen-api] Error callback is not a function:', cb);
    }
  },

  removeChangeListener(cb) {
    const index = changeCallbacks.indexOf(cb);
    if (index >= 0) changeCallbacks.splice(index, 1);
  },

  removeErrorListener(cb) {
    const index = errorCallbacks.indexOf(cb);
    if (index >= 0) errorCallbacks.splice(index, 1);
  },

  // Register Polyfill on document or custom-element
  registerPolyfill(target) {
    if (this.enabled) {

      target.addEventListener(api.events.change, (e) => {
        // Update static properties on change
        this.enabled = document[api.enabled];
        this.element = document[api.element];

        changeCallbacks.forEach(cb => {
          typeof cb === 'function' && cb(e);
        });
      });

      target.addEventListener(api.events.error, (e) => {
        errorCallbacks.forEach(cb => {
          typeof cb === 'function' && cb(e);
        });
      });

      return true;

    } else {

      return false;
    }
  },

};

fullscreen.registerPolyfill(document);

export default fullscreen;
