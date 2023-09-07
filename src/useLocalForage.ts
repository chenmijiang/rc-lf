import { useState, useEffect, useContext } from 'react';
import localForage from 'localforage';
import { RCLocalForageContext, clientCache } from './RCLocalForage';

interface Options {
  expire?: number;
}

export function useLocalForage<TState = any>(
  key: string,
  defaultValue: TState,
  _options?: Options
) {
  const [value, setValue] = useState<TState | undefined>(defaultValue);
  const [loding, setLoding] = useState<boolean>(false);

  if (defaultValue === null) {
    throw new Error('defaultValue must be not null');
  }

  const context = useContext(RCLocalForageContext);

  if (!clientCache.has(context)) {
    clientCache.set(context, localForage.createInstance(context));
  }

  const client = clientCache.get(context) || localForage;

  useEffect(() => {
    setLoding(true);
    client
      .getItem<TState>(key)
      .then((val: any) => {
        if (val !== null) {
          setValue(val);
        }
        setLoding(false);
      })
      .catch((err) => {
        setLoding(false);
        throw new Error(err);
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
        throw new Error(err);
      });
  };

  const remove = () => {
    client
      .removeItem(key)
      .then(() => {
        setValue(undefined);
      })
      .catch((err) => {
        throw new Error(err);
      });
  };

  return { value, set, remove, loding };
}
