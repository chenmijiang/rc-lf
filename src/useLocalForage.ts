import { useState, useEffect, useContext } from 'react';
import localForage from 'localforage';
import { LocalForageContext } from './LocalForageProvider';
import clientCache from './ClientCache';

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

  const [loading, setLoading] = useState<boolean>(true);

  const set = (val: TState) => {
    const client = getClient(config, target);
    client
      .setItem(key, val)
      .then(() => {
        return client.getItem(key);
      })
      .then((val: TState) => {
        setValue(val);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        if (!!options?.errorSetHandler) {
          options.errorSetHandler(err);
        } else {
          console.error(err);
        }
      });
  };

  // initialize the value
  useEffect(() => {
    const client = getClient(config, target);
    setLoading(true);
    client
      .getItem<TState>(key)
      .then((val: any) => {
        if (val !== null) {
          setValue(val);
          setLoading(false);
        } else {
          set(value);
        }
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

  useEffect(() => {
    let configKey = target ? JSON.stringify(target) : JSON.stringify(config);

    const handleStorageChange = () => {
      if (!clientCache.hasCache(configKey)) {
        setValue(undefined!);
        return;
      }
      clientCache
        .getCache(configKey)
        ?.length()
        .then((length) => {
          if (length === 0) {
            setValue(undefined!);
          }
        });
    };

    clientCache.addEventListener('change', handleStorageChange);

    return () => {
      clientCache.removeEventListener('change', handleStorageChange);
    };
  }, []);

  const remove = () => {
    const client = getClient(config, target);
    client.removeItem(key).then(() => {
      setValue(undefined!);
    });
  };

  return { value, set, remove, loading };
}

function getClient(config: LocalForageOptions, target?: LocalForageOptions) {
  let cache: LocalForage = localForage;
  let configString = JSON.stringify(config);
  if (!clientCache.hasCache(configString)) {
    clientCache.addCache(configString, localForage.createInstance(config));
  }
  let targetString = JSON.stringify(target);
  if (!!targetString && clientCache.hasCache(targetString)) {
    cache = clientCache.getCache(targetString) as LocalForage;
  } else {
    cache = clientCache.getCache(configString) as LocalForage;
  }
  return cache;
}
