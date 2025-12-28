export type Callable<Args extends any[] = any[], Return = any> =
    { (...args: Args): Return };
