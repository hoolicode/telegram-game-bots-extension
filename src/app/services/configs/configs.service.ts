import { Injectable, OnDestroy } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { BehaviorSubject, map, merge, Subject, takeUntil, tap } from 'rxjs';

export class ExtensionConfig {
  enabled = true;
}

export const storageKey = 'config';

@Injectable({
  providedIn: 'root',
})
export class ConfigService implements OnDestroy {
  readonly enabled$ = new BehaviorSubject<boolean>(true);
  private readonly destroyRef$ = new Subject();

  constructor(private readonly storageService: StorageService) {
    merge(
      this.storageService.get<ExtensionConfig>(storageKey).pipe(map(items => items[storageKey])),
      this.storageService.onChange<ExtensionConfig>(storageKey),
    )
      .pipe(
        tap(config => this.enabled$.next(config.enabled)),
        takeUntil(this.destroyRef$),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroyRef$.next(null);
    this.destroyRef$.complete();
  }

  enable() {
    this.storageService.set({ [storageKey]: { enabled: true } });
  }

  disable() {
    this.storageService.set({ [storageKey]: { enabled: false } });
  }
}
