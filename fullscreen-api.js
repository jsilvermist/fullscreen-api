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

// Mirror initial static properties
export let fullscreenEnabled = document[api.enabled] || false;
export let fullscreenElement = document[api.element] || null;

// Bind exit method
export const exitFullscreen = document[api.exit].bind(document);

// Call request for fullscreen on element
export const requestFullscreen = function(target) {
  target[api.request].call(target);
}

function resolveListenerType(type) {
  switch (type) {
    case 'change':
      return changeCallbacks;
    case 'error':
      return errorCallbacks;
    default:
      console.error(`[fullscreen-api] '${type}' is not a valid type, please use 'change' or 'error'.`);
      return null;
  }
}

function resolveListenerCallback(cb) {
  if (typeof cb === 'function') {
    return cb;
  } else {
    console.error('[fullscreen-api] Listener callback is not a function:', cb);
    return null;
  }
}

export const addFullscreenListener = function(type, cb) {
  type = resolveListenerType(type);
  cb = resolveListenerCallback(cb);
  if (!type || !cb) {
    return false;
  }
  const index = type.indexOf(cb);
  if (index !== -1) {
    return false;
  }
  type.push(cb);
  return true;
}

export const removeFullscreenListener = function(type, cb) {
  type = resolveListenerType(type);
  cb = resolveListenerCallback(cb);
  if (!type || !cb) {
    return false;
  }
  const index = type.indexOf(cb);
  if (index === -1) {
    return false;
  }
  type.splice(index, 1);
  return true;
}

if (fullscreenEnabled) {
  document.addEventListener(api.events.change, (e) => {
    // Update static properties on change
    fullscreenEnabled = document[api.enabled];
    fullscreenElement = document[api.element];

    changeCallbacks.forEach(cb => cb(e));
  });

  document.addEventListener(api.events.error, (e) => {
    errorCallbacks.forEach(cb => cb(e));
  });
}

export default {
  get enabled() { return fullscreenEnabled },
  get element() { return fullscreenElement },
  request: requestFullscreen,
  exit: exitFullscreen,
  addListener: addFullscreenListener,
  removeListener: removeFullscreenListener,
};
