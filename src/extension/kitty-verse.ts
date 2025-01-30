// @ts-ignore
function injectScript(content: string) {
  const script = document.createElement('script');
  script.textContent = content;
  document.documentElement.appendChild(script);
  script.remove();
}

function emulateEnvironment() {
  injectScript(`
    // skip touch check
     const originalMatchMedia = window.matchMedia;
      window.matchMedia = function(query) {
        if (query === '(pointer: coarse)') {
          return {
            matches: true,
            media: query,
            onchange: null,
            addListener: () => {},
            removeListener: () => {}
          };
        }
        return originalMatchMedia(query);
      };

  // block cache
  const originalSetItem = window.localStorage.getItem;
  window.localStorage.getItem = (key) => {
    if (key === 'haptic') {
        return null
    };
    originalSetItem.call(localStorage, key);
  };
`);

  injectScript(`
  // 1. Activated Touch API support
  (() => {
    // Fixing the definition of a touch device
    Object.defineProperty(navigator, 'maxTouchPoints', { value: 10 });
    window.ontouchstart = () => {};

    // Creating a polyfill for TouchEvent
    class FakeTouch extends Touch {
      constructor(target, identifier, x, y) {
        super({
          identifier,
          target,
          clientX: x,
          clientY: y,
          radiusX: 5,
          radiusY: 5,
          rotationAngle: 0,
          force: 1,
        });
      }
    }

    // 2. We intercept mouse events and convert them to touch
    document.addEventListener('mousedown', createTouchEvent('touchstart'));
    document.addEventListener('mouseup', createTouchEvent('touchend'));
    document.addEventListener('mousemove', createTouchEvent('touchmove'));

    function createTouchEvent(type) {
      return e => {
        // Creating a full-fledged TouchList
        const touch = new FakeTouch(e.target, Date.now(), e.clientX, e.clientY);
        const touchEvent = new TouchEvent(type, {
          bubbles: true,
          cancelable: true,
          touches: [touch],
          targetTouches: [touch],
          changedTouches: [touch],
        });

        // Dispatching an event for Phaser
        e.target.dispatchEvent(touchEvent);

        // Blocking standard behavior
        e.preventDefault();
        e.stopImmediatePropagation();
      };
    }
  })();
`);
}

emulateEnvironment();
