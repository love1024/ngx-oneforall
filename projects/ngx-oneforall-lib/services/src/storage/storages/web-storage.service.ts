import { StorageEngine } from '../storage-engine';

export class WebStorageService extends StorageEngine {
  constructor(private readonly storage: Storage) {
    super();
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
