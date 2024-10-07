let openWindowRef: number | null = null;

// Process messages from other parts of the extension (for example, a popup or background script)
chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  if (message.action === 'openWindow') {
    // If a window is already open, close it first
    if (openWindowRef) {
      chrome.windows.remove(openWindowRef, () => {
        createNewWindow(message, sendResponse);
      });
    } else {
      // No window is open, create a new one directly
      createNewWindow(message, sendResponse);
    }
  } else if (message.action === 'closeWindow' && openWindowRef) {
    // Close the window if it's open
    chrome.windows.remove(openWindowRef, () => {
      openWindowRef = null;
      sendResponse({ status: 'Window closed' });
    });
  }

  return true;
});

function createNewWindow(message: any, sendResponse: (res?: any) => void) {
  chrome.windows.create(
    {
      url: message.url,
      type: 'popup',
      top: Math.round(message.top),
      left: Math.round(message.left),
      width: Math.round(message.width),
      height: Math.round(message.height),
    },
    newWindow => {
      if (newWindow && newWindow.tabs && newWindow.tabs.length > 0) {
        const tabId = newWindow.tabs[0].id; // Получаем tabId первой вкладки

        openWindowRef = newWindow.id || null;

        chrome.debugger.attach({ tabId: tabId }, '1.3', () => {
          chrome.debugger.sendCommand({ tabId: tabId }, 'Network.setUserAgentOverride', {
            userAgent:
              'Mozilla/5.0 (iPhone; CPU iPhone OS 17_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
          });

          chrome.debugger.sendCommand({ tabId: tabId }, 'Emulation.setTouchEmulationEnabled', {
            enabled: true,
            configuration: 'mobile',
          });

          chrome.debugger.sendCommand({ tabId: tabId }, 'Emulation.setDeviceMetricsOverride', {
            width: 480,
            height: 640,
            deviceScaleFactor: 2.625,
            mobile: true,
            screenOrientation: {
              type: 'portraitPrimary',
              angle: 0,
            },
          });

          chrome.debugger.sendCommand({ tabId: tabId }, 'Emulation.setGeolocationOverride', {
            latitude: 51.5074,
            longitude: 0.1278,
            accuracy: 100,
          });

          sendResponse({ status: 'Window opened and debugger attached' });
        });
      } else {
        sendResponse({ status: 'Failed to create window or no tabs found' });
      }
    },
  );
}

chrome.windows.onRemoved.addListener(windowId => {
  if (windowId === openWindowRef) {
    openWindowRef = null;
  }
});
