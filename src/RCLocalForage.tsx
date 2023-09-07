import React from 'react';
import localforage from 'localforage';

export type LocalForageOptions = Parameters<(typeof localforage)['createInstance']>[0];

export type RCLocalForageProvider = {
  children: React.ReactNode;
  config?: LocalForageOptions;
};

export const clientCache = new Map<LocalForageOptions, LocalForage>();

export const RCLocalForageContext = React.createContext<LocalForageOptions>({});

export const RCLocalForageProvider = ({ children, config = {} }: RCLocalForageProvider) => {
  return <RCLocalForageContext.Provider value={config}>{children}</RCLocalForageContext.Provider>;
};
