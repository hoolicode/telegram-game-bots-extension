/// <reference types="chrome"/>
import { Injectable } from '@angular/core';
import { filter, from, fromEventPattern, map, merge, Observable, Subject, switchMap, withLatestFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StorageService<T = object> {
  public readonly setState$ = new Subject<T>();

  get<T>(key: string[] | string): Observable<Record<string, T>> {
    return from(
      new Promise<Record<string, T>>((resolve, reject) => {
        chrome.storage.local.get(key, (items: Record<string, T>) => {
          if (chrome.runtime.lastError) {
            console.warn(chrome.runtime.lastError.message);
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve(items);
          }
        });
      }),
    );
  }

  set<T>(keyValue: Record<string, T>): Observable<boolean> {
    return from(
      new Promise<boolean>((resolve, reject) => {
        chrome.storage.local.set(keyValue, () => {
          if (chrome.runtime.lastError) {
            console.warn(chrome.runtime.lastError.message);
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve(true);
          }
        });
      }),
    );
  }

  onChange<T>(keyName: string): Observable<T> {
    return fromEventPattern<[Record<string, chrome.storage.StorageChange>, chrome.storage.AreaName]>(
      handler => chrome.storage.onChanged.addListener(handler),
      handler => chrome.storage.onChanged.removeListener(handler),
    ).pipe(
      map(([changes]) => changes[keyName]?.newValue as T),
      filter((newValue): newValue is T => newValue !== undefined),
    );
  }

  getState<T>(keyName: string, defaultState: T): Observable<T> {
    return merge(this.get<T>(keyName).pipe(map(items => items[keyName] || defaultState)), this.onChange<T>(keyName));
  }

  updateState<T>(keyName: string, defaultState: T): Observable<boolean> {
    return this.setState$.asObservable().pipe(
      withLatestFrom(this.getState(keyName, defaultState)),
      switchMap(([updatedConfig, config]) => this.set({ [keyName]: { ...config, ...updatedConfig } })),
    );
  }
}
