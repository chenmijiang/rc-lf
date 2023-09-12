import { useState, useEffect, useContext } from 'react';
import localForage from 'localforage';
import { LocalForageContext } from './LocalForageProvider';
import { clientCache } from './extra';

import { ExtraOptions } from './type';
import { isBrowser } from './utils';

export function useLocalForage<TState = any>(key: string, options?: ExtraOptions<TState>) {
  const { defaultValue, target } = options ?? {};
  // determine whether it is a browser environment, if not, return the default value
  if (!isBrowser) {
    return { value: defaultValue, set: () => {}, remove: () => {}, loading: true };
  }

  const { config, initialValues } = useContext(LocalForageContext);
  // If defaultValue is set, it will override the initial value of the Provider
  const globalKeyValue = initialValues?.[key];
  const [value, setValue] = useState<TState>(defaultValue ?? globalKeyValue);
  // if the config is not set, use the default localForage instance
  let client: LocalForage = localForage;
  let configString = JSON.stringify(config);
  if (configString !== '{}') {
    if (!clientCache.has(configString)) {
      clientCache.set(configString, localForage.createInstance(config));
    }
    let targetString = JSON.stringify(target);
    if (!!targetString && clientCache.has(targetString)) {
      client = clientCache.get(targetString) as LocalForage;
    } else {
      client = clientCache.get(configString) as LocalForage;
    }
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
