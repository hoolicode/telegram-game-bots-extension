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

    this.storageService
      .updateState(storageKey, new ExtensionConfigState())
      .pipe(takeUntil(this.destroyRef$))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroyRef$.next(null);
    this.destroyRef$.complete();
  }
}
