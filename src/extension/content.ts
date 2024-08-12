import { mutationObserver } from './observers/mutation-observer';
import { combineLatest, filter } from 'rxjs';
import { ConfigService } from '../app/services/configs/configs.service';
import { StorageService } from '../app/services/storage/storage.service';

export const changeTgWebAppPlatform = (node: ChildNode) => {
  if (node.childNodes.length) {
    for (let i = 0; i < node.childNodes.length; i++) {
      changeTgWebAppPlatform(node.childNodes[i]);
    }
  } else if (
    (node as HTMLElement).tagName === 'IFRAME' &&
    (node as HTMLIFrameElement).src.includes('tgWebAppPlatform=web')
  ) {
    console.info('tgWebAppPlatform updated');
    const iframe = node as HTMLIFrameElement;
    iframe.src = iframe.src.replace('tgWebAppPlatform=web', 'tgWebAppPlatform=android');
  }
};

const contentLoadedHandler = () => {
  const configService = new ConfigService(new StorageService());
  combineLatest([
    mutationObserver(document.body, {
      childList: true,
      subtree: true,
    }),
    configService.enabled$,
  ])
    .pipe(filter(([, enabled]) => enabled))
    .subscribe(([mutations]) => {
      mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (mutationNode) {
          mutationNode.childNodes.forEach(mutationChildNode => {
            changeTgWebAppPlatform(mutationChildNode);
          });
        });
      });
    });
};

if (document.readyState !== 'loading') {
  contentLoadedHandler();
} else {
  document.addEventListener('DOMContentLoaded', contentLoadedHandler);
}
