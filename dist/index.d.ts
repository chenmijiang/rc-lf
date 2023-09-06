interface Options {
    expiredTime?: number;
}
export declare function useLocalForage<TState = any>(key: string, defaultValue: TState, options?: Options): {
    value: TState;
    set: (val: TState) => void;
    remove: () => void;
    loding: boolean;
};
export {};
