import { useState, useEffect, useContext } from 'react';
import localForage from 'localforage';
import { LocalForageContext } from './LocalForageProvider';

import { ExtraOptions } from './type';

export const clientCache = new Map<LocalForageOptions, LocalForage>();

export const isBrowser = typeof window !== 'undefined';

export function useLocalForage<TState = any>(key: string, options?: ExtraOptions<TState>) {
  const { defaultValue } = options ?? {};
  // determine whether it is a browser environment, if not, return the default value
  if (!isBrowser) {
    return { value: defaultValue, set: () => {}, remove: () => {}, loading: true };
  }

  const { config, initialValues } = useContext(LocalForageContext);
  // If defaultValue is set, it will override the initial value of the Provider
  const globalKeyValue = initialValues?.[key];
  const [value, setValue] = useState<TState>(defaultValue ?? globalKeyValue);
  // if the config is not set, use the default localForage
  let client: LocalForage = localForage;
  if (Object.keys(config).length > 0) {
    if (!clientCache.has(config)) {
      clientCache.set(config, localForage.createInstance(config));
    }
    client = clientCache.get(config) as LocalForage;
  }

  const [loading, setLoading] = useState<boolean>(false);

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

  useEffect(() => {
    setLoading(true);
    client
      .getItem<TState>(key)
      .then((val: any) => {
        if (val !== null) {
          setValue(val);
        } else {
          set(value);
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        if (!!options?.errorGetHandler) {
          options.errorGetHandler(err);
        } else {
          console.error(err);
        }
      });
  }, []);

  const remove = () => {
    client.removeItem(key).then(() => {
      setValue(undefined!);
    });
  };

  return { value, set, remove, loading };
}
