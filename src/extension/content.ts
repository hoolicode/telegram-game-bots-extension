import { mutationObserver } from './observers/mutation-observer';
import { BehaviorSubject, combineLatest, withLatestFrom } from 'rxjs';
import { ConfigService } from '../app/services/configs/configs.service';
import { StorageService } from '../app/services/storage/storage.service';

const contentLoadedHandler = () => {
  const configService = new ConfigService(new StorageService());
  const hamsterWindowRef$ = new BehaviorSubject<Window | null>(null);
  let href: null | Window = null;

  combineLatest([
    mutationObserver(document.body, {
      childList: true,
      subtree: true,
    }),
    configService.config$,
  ])
    .pipe(withLatestFrom(hamsterWindowRef$))
    .subscribe(([[mutations, config], hamsterWindowRef]) => {
      // console.error('[mutations, config]', [mutations, config, hamsterWindowRef]);
      mutations.forEach(mutation => {
        if (mutation.addedNodes.length) {
          mutation.addedNodes.forEach(node => {
            if (node.nodeName === 'IFRAME') {
              const iframe = node as HTMLIFrameElement;
              if (iframe.src.indexOf('tgWebAppPlatform=') !== -1) {
                const iframe = node as HTMLIFrameElement;
                const platform = config?.enabled ? 'android' : 'web';
                const url = iframe.src.replace(/tgWebAppPlatform=[a-z]+?&/, `tgWebAppPlatform=${platform}&`);

                if (config?.enabled && config?.hamsterInWindow && iframe.src.indexOf('hamsterkombatgame.io') !== -1) {
                  const { top, left, width, height } = iframe.getBoundingClientRect();
                  // ref = window.open(
                  //   src,
                  //   '_blank',
                  //   `menubar=no,location=no,toolbar=no,scrollbars=yes,resizable=yes,top=${top},left=${left},width=${width},height=${height}`,
                  // );

                  // Send a message to background script to open a new window
                  chrome.runtime.sendMessage(
                    {
                      action: 'openWindow',
                      url, // Change to desired URL
                      top: top,
                      left: left,
                      width: width,
                      height: height,
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
