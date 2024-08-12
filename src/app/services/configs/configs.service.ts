import { DestroyRef, inject, Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { BehaviorSubject, map, merge, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export class ExtensionConfig {
  enabled = true;
}

export const storageKey = 'config';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  readonly #storage = inject(StorageService);
  readonly #destroyRef = inject(DestroyRef);
  readonly enabled$ = new BehaviorSubject<boolean>(true);

  constructor() {
    merge(
      this.#storage.get<ExtensionConfig>(storageKey).pipe(map(items => items[storageKey])),
      this.#storage.onChange<ExtensionConfig>(storageKey),
    )
      .pipe(
        tap(config => this.enabled$.next(config.enabled)),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe();
  }

  enable() {
    this.#storage.set({ [storageKey]: { enabled: true } });
  }

  disable() {
    this.#storage.set({ [storageKey]: { enabled: false } });
  }
}
