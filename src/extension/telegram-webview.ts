// @ts-ignore
function injectScript(content: string) {
  const script = document.createElement('script');
  script.textContent = content;
  document.documentElement.appendChild(script);
  script.remove();
}

function emulateTelegramEnvironment() {
  injectScript(`
        // Mock TelegramWebviewProxy
        window.TelegramWebviewProxy = {
            postEvent: function(name, data) {
                console.log("TelegramWebviewProxy.postEvent called:", name, data);
            }
        };
    `);
}

emulateTelegramEnvironment();
