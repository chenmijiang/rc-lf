import { useState, useEffect } from 'react';
import localForage from 'localforage';

interface Options {
  expiredTime?: number;
}

export function useLocalForage<TState = any>(key: string, defaultValue: TState, options?: Options) {
  console.log('🚀 ~ options:', options);

  const [value, setValue] = useState<TState>(defaultValue);
  const [loding, setLoding] = useState<boolean>(false);

  if (defaultValue === null) {
    throw new Error('defaultValue must be not null');
  }

  useEffect(() => {
    setLoding(true);
    localForage
      .getItem(key)
      .then((val: any) => {
        setValue(val);
        setLoding(false);
      })
      .catch((err) => {
        setLoding(false);
        throw new Error(err);
      });
  }, []);

  const set = (val: TState) => {
    setValue(val);
    localForage.setItem(key, val);
  };

  const remove = () => {
    setValue(defaultValue);
    localForage.removeItem(key);
  };

  return { value, set, remove, loding };
}
