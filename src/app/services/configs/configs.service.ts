import { Injectable, OnDestroy } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { Observable, Subject, takeUntil } from 'rxjs';

export class ExtensionConfigState {
  enabled = true;
  hamsterInWindow = false;
}

export const storageKey = 'configV2';

@Injectable({
  providedIn: 'root',
})
export class ConfigService implements OnDestroy {
  private readonly destroyRef$ = new Subject();
  readonly config$: Observable<ExtensionConfigState>;
  readonly setState$: Subject<Partial<ExtensionConfigState>>;

  constructor(private readonly storageService: StorageService) {
    this.config$ = this.storageService.getState(storageKey, new ExtensionConfigState());
    this.setState$ = this.storageService.setState$;

    // this.config$
    //   .pipe(
    //     tap(config => {
    //       console.error('storage xxx', JSON.stringify(config));
    //       // this.enabled$.next(config.enabled);
    //       // this.hamsterInWindow$.next(config.hamsterInWindow);
    //     }),
    //     takeUntil(this.destroyRef$),
    //   )
    //   .subscribe();

    this.storageService
      .updateState(storageKey, new ExtensionConfigState())
      .pipe(takeUntil(this.destroyRef$))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroyRef$.next(null);
    this.destroyRef$.complete();
  }

  //
  // enableChange(enabled: boolean) {
  //   this.storageService.set({ [storageKey]: { enabled } });
  // }
  //
  // hamsterInWindowChange(hamsterInWindow: boolean) {
  //   this.storageService.set({ [storageKey]: { hamsterInWindow } });
  // }
}
