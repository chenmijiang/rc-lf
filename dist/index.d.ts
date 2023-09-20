import localforage from 'localforage';
import React$1 from 'react';

type LocalForageOptions$1 = Parameters<(typeof localforage)['createInstance']>[0];
type InitialValues = {
    [key: string]: any;
};
interface LocalForageProviderProps {
    children: React.ReactNode;
    config?: LocalForageOptions$1;
    initialValues?: InitialValues;
}
type ExtraOptions<T> = {
    defaultValue?: T;
    target?: LocalForageOptions$1;
    errorSetHandler?: (err: any) => void;
    errorGetHandler?: (err: any) => void;
};

declare function useLocalForage<TState = any>(key: string, options?: ExtraOptions<TState>): {
    value: TState | undefined;
    set: () => void;
    remove: () => void;
    loading: boolean;
} | {
    value: TState;
    set: (val: TState) => void;
    remove: () => void;
    loading: boolean;
};

declare const LocalForageProvider: ({ children, config, initialValues, }: LocalForageProviderProps) => React$1.JSX.Element;

/**
 * Drop the localForage instance
 */
declare function dropDataStore(config?: LocalForageOptions, capture?: boolean): void;
/**
 * Removes all keys from the database
 */
declare function removeDataStoreItems(config?: LocalForageOptions, capture?: boolean): void;
/**
 * data storage driver
 */
declare const driver: {
    WEBSQL: string;
    INDEXEDDB: string;
    LOCALSTORAGE: string;
};

export { LocalForageProvider, driver, dropDataStore, removeDataStoreItems, useLocalForage };
