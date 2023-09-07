import { useState, useEffect, useContext } from 'react';
import localForage from 'localforage';
import { RCLocalForageContext } from './RCLocalForage';

import { ExtraOptions } from './type';

export const clientCache = new Map<LocalForageOptions, LocalForage>();

export function useLocalForage<TState = any>(
  key: string,
  defaultValue: TState,
  options?: ExtraOptions
) {
  const [value, setValue] = useState<TState | undefined>(defaultValue);
  const [loading, setLoading] = useState<boolean>(false);

  const context = useContext(RCLocalForageContext);

  let client: LocalForage = localForage;

  if (Object.keys(context).length > 0) {
    if (!clientCache.has(context)) {
      clientCache.set(context, localForage.createInstance(context));
    }
    client = clientCache.get(context) as LocalForage;
  }

  useEffect(() => {
    setLoading(true);
    client
      .getItem<TState>(key)
      .then((val: any) => {
        if (val !== null) {
          setValue(val);
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
      });
  }, []);

  const set = (val: TState) => {
    client
      .setItem(key, val)
      .then(() => {
        return client.getItem(key);
      })
      .then((val: TState) => {
        setValue(val);
      })
      .catch((err) => {
        if (!!options?.errorSetHandler) {
          options.errorSetHandler(err);
        } else {
          console.error(err);
        }
      });
  };

  const remove = () => {
    client.removeItem(key).then(() => {
      setValue(undefined);
    });
  };

  return { value, set, remove, loading };
}
