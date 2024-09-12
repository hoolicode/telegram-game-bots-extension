let openWindowRef: number | null = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
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

  // Ensure async sendResponse is used
  return true;
});

// Helper function to create a new window
function createNewWindow(message: any, sendResponse: (res?: any) => void) {
  chrome.windows.create(
    {
      url: message.url,
      type: 'popup', // Specify 'popup' or 'normal' based on your needs
      top: Math.round(message.top),
      left: Math.round(message.left),
      width: Math.round(message.width),
      height: Math.round(message.height),
    },
    newWindow => {
      openWindowRef = newWindow?.id || null; // Save the reference to the new window
      sendResponse({ status: 'Window opened' });
    },
  );
}
