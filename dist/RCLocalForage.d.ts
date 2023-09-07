import React from 'react';
import localforage from 'localforage';
export type LocalForageOptions = Parameters<(typeof localforage)['createInstance']>[0];
export type RCLocalForageProvider = {
    children: React.ReactNode;
    config?: LocalForageOptions;
};
export declare const clientCache: Map<globalThis.LocalForageOptions, LocalForage>;
export declare const RCLocalForageContext: React.Context<globalThis.LocalForageOptions>;
export declare const RCLocalForageProvider: ({ children, config }: RCLocalForageProvider) => React.JSX.Element;
