import {
  BaseStorageTransformer,
  StorageTransformers,
} from './transformers/storage-transformer';

export abstract class StorageEngine {
  public get<T = string>(
    key: string,
    transformer: BaseStorageTransformer<T> = StorageTransformers.STRING as BaseStorageTransformer<T>
  ): T | undefined {
    const data = this.getItem(key);
    return data !== undefined ? transformer.deserialize(data) : undefined;
  }

  public set<T = string>(
    key: string,
    value: T,
    transformer: BaseStorageTransformer<T> = StorageTransformers.STRING as BaseStorageTransformer<T>
  ): void {
    this.setItem(key, transformer.serialize(value));
  }

  abstract has(key: string): boolean;

  abstract remove(key: string): void;

  abstract clear(): void;

  abstract length(): number;

  abstract key(index: number): string | null;

  /**
   * Returns all keys in storage
   */
  abstract keys(): string[];

  /**
   * Returns all key-value pairs in storage
   */
  public getAll<T = string>(
    transformer: BaseStorageTransformer<T> = StorageTransformers.STRING as BaseStorageTransformer<T>
  ): Map<string, T> {
    const result = new Map<string, T>();
    for (const key of this.keys()) {
      const value = this.get<T>(key, transformer);
      if (value !== undefined) {
        result.set(key, value);
      }
    }
    return result;
  }

  protected abstract getItem(key: string): string | undefined;

  protected abstract setItem(key: string, value: string): void;
}
