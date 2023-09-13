import React from 'react';
import { LocalForageProviderProps, LocalForageContextProps } from './type';

export const LocalForageContext = React.createContext<LocalForageContextProps>({
  config: {},
  initialValues: {},
});

export const LocalForageProvider = ({
  children,
  config = {},
  initialValues = {},
}: LocalForageProviderProps) => {
  return (
    <LocalForageContext.Provider
      value={{
        config,
        initialValues,
      }}>
      {children}
    </LocalForageContext.Provider>
  );
};
