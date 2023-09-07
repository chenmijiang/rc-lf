interface Options {
    expire?: number;
}
export declare function useLocalForage<TState = any>(key: string, defaultValue: TState, _options?: Options): {
    value: TState | undefined;
    set: (val: TState) => void;
    remove: () => void;
    loding: boolean;
};
export {};
