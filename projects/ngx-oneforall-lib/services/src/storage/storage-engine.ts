// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface StorageEngine<T = any> {
  has(key: string): boolean;

  get(key: string): T | undefined;

  set(key: string, value: T): void;

  remove(key: string): void;

  clear(): void;
}
