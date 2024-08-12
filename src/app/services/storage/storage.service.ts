/// <reference types="chrome"/>
import { Injectable } from '@angular/core';
import { filter, from as fromPromise, fromEventPattern, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  get<T>(key: string[] | string): Observable<Record<string, T>> {
    return fromPromise<PromiseLike<Record<string, T>>>(
      new Promise((resolve, reject) => {
        chrome.storage.local.get(key, (items: Record<string, T>) => {
          if (chrome.runtime.lastError) {
            console.warn(chrome.runtime.lastError.message);
            reject();
          } else {
            resolve(items);
          }
        });
      }),
    );
  }

  set<T>(keyValue: Record<string, T>): Observable<boolean> {
    return fromPromise(
      new Promise<boolean>((resolve, reject) => {
        chrome.storage.local.set(keyValue, () => {
          if (chrome.runtime.lastError) {
            console.warn(chrome.runtime.lastError.message);
            reject(false);
          } else {
            resolve(true);
          }
        });
      }),
    );
  }

  onChange<T>(keyName: string): Observable<T> {
    const storageChanges$: Observable<[Record<string, chrome.storage.StorageChange>, chrome.storage.AreaName]> =
      fromEventPattern(
        handler => chrome.storage.onChanged.addListener(handler),
        handler => chrome.storage.onChanged.removeListener(handler),
      );

    return storageChanges$.pipe(
      // tap(([changes]) => {
      //   console.log(`changes  `, JSON.stringify(changes));
      //   for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
      //     console.log(`Storage key "${key}"  `, `Old value was "${oldValue}", new value is "${newValue}".`);
      //   }
      // }),
      map(([changes]) => changes?.[keyName]?.newValue as T),
      filter(newValue => newValue !== undefined),
    );
  }
}
