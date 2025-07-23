import { StorageEngine } from './storage-engine';

export class WebStorageService<T = unknown> implements StorageEngine<T> {
  constructor(private readonly storage: Storage) {}

  get(key: string): T | undefined {
    const value = this.getItem(key);

    return value !== undefined ? JSON.parse(value) : undefined;
  }

  set(key: string, value: T): void {
    this.setItem(key, JSON.stringify(value));
  }

  has(key: string): boolean {
    return this.storage.getItem(key) !== null;
  }

  remove(key: string): void {
    this.storage.removeItem(key);
  }

  clear(): void {
    this.storage.clear();
  }

  protected getItem(key: string): string | undefined {
    const value = this.storage.getItem(key);

    return value !== null ? value : undefined;
  }

  protected setItem(key: string, value: string): void {
    return this.storage.setItem(key, value);
  }
}
