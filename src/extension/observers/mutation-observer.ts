import { Observable } from 'rxjs';

export const mutationObserver = (
  target: HTMLElement,
  config: Record<string, boolean>,
): Observable<MutationRecord[]> => {
  return new Observable(observer => {
    const mutation = new MutationObserver((mutations, instance) => {
      observer.next(mutations);
    });
    mutation.observe(target, config);
    return () => {
      mutation.disconnect();
    };
  });
};
