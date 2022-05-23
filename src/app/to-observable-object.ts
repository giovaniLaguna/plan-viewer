import { Subject, Observable } from "rxjs";

export const toObservableObject = <T extends object>(targetObject: T) => {
  const observation$ = new Subject();
  return new Proxy(targetObject, {
      set: (target: any, name, value) => {
          const oldValue = target[name];
          const newValue = value;
          target[name] = value;
          observation$.next(target);
          return true;
      },

      get: (target, name) => name == 'observation$' ? observation$ : target[name]
  }) as T & { observation$: Observable<T> };
}
