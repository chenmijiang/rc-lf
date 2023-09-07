import React from 'react';

import { RCLocalForageProviderProps } from './type';

export const RCLocalForageContext = React.createContext<LocalForageOptions>({});

export const RCLocalForageProvider = ({ children, config = {} }: RCLocalForageProviderProps) => {
  return <RCLocalForageContext.Provider value={config}>{children}</RCLocalForageContext.Provider>;
};
