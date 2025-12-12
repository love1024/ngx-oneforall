export type IsArrowFunction<T> =
    T extends (this: any, ...args: any[]) => any
    ? false
    : T extends (...args: any[]) => any
    ? true
    : false;
