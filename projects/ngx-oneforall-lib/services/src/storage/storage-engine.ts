import {
  BaseStorageTransformer,
  StorageTransformers,
} from './transformers/storage-transformer';

export abstract class StorageEngine {
  public get<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    T extends BaseStorageTransformer<any> = BaseStorageTransformer<string>,
  >(
    key: string,
    transformer: T = StorageTransformers.STRING as T
  ): ReturnType<T['deserialize']> | undefined {
    const data = this.getItem(key);
    return data !== undefined ? transformer.deserialize(data) : undefined;
  }

  public set<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    T extends BaseStorageTransformer<any> = BaseStorageTransformer<string>,
  >(
    key: string,
    value: ReturnType<T['deserialize']>,
    transformer: T = StorageTransformers.STRING as T
  ): void {
    this.setItem(key, transformer.serialize(value));
  }

  abstract has(key: string): boolean;

  abstract remove(key: string): void;

  abstract clear(): void;

  protected abstract getItem(key: string): string | undefined;

  protected abstract setItem(key: string, value: string): void;
}
