import { mutationObserver } from './observers/mutation-observer';
import { combineLatest } from 'rxjs';
import { ConfigService, ExtensionConfigState } from '../app/services/configs/configs.service';
import { StorageService } from '../app/services/storage/storage.service';

const contentLoadedHandler = () => {
  const configService = new ConfigService(new StorageService());

  combineLatest([
    mutationObserver(document.body, {
      childList: true,
      subtree: true,
    }),
    configService.config$,
  ]).subscribe(([mutations, config]: [MutationRecord[], ExtensionConfigState]) => {
    const handleIframe = (node: Node) => {
      if (node.nodeName === 'IFRAME') {
        const iframe = node as HTMLIFrameElement;
        if (iframe.src.indexOf('tgWebAppPlatform=') !== -1) {
          const platform = config?.enabled ? 'ios' : 'web';
          const url = iframe.src.replace(/tgWebAppPlatform=[a-z]+?&/, `tgWebAppPlatform=${platform}&`);

          if (config?.enabled && config?.hamsterInWindow) {
            //  && iframe.src.indexOf('hamsterkombatgame.io') !== -1
            const { top, left, width, height } = iframe.getBoundingClientRect();

            // Send a message to background script to open a new window
            chrome.runtime.sendMessage(
              {
                action: 'openWindow',
                url, // Change to desired URL
                top: top,
                left: left,
                width: width,
                height: +height + 80,
              },
              response => {
                console.log(response.status);
              },
            );
          } else {
            iframe.src = url;
          }
          console.log('tgWebAppPlatform updated!');
        }
      }
    };

    const processAddedNodes = (node: Node) => {
      handleIframe(node);
      node.childNodes.forEach(child => processAddedNodes(child));
    };

    mutations.forEach(mutation => {
      if (mutation.addedNodes.length) {
        mutation.addedNodes.forEach(node => {
          processAddedNodes(node);
        });
      }
    });
  });
};

if (document.readyState !== 'loading') {
  contentLoadedHandler();
} else {
  document.addEventListener('DOMContentLoaded', contentLoadedHandler);
}
