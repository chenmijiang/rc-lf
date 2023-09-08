import localforage from 'localforage';

export type LocalForageOptions = Parameters<(typeof localforage)['createInstance']>[0];

export type RCLocalForageProviderProps = {
  children: React.ReactNode;
  config?: LocalForageOptions;
};

export type ExtraOptions = {
  expire?: number;
  errorSetHandler?: (err: any) => void;
};
