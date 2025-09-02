import { StorageEngine } from '../storage-engine';

export class WebStorageService extends StorageEngine {
  constructor(
    private readonly storage: Storage,
    private readonly prefix = ''
  ) {
    super();
  }

  has(key: string): boolean {
    return this.storage.getItem(this.prefix + key) !== null;
  }

  remove(key: string): void {
    this.storage.removeItem(this.prefix + key);
  }

  clear(): void {
    this.storage.clear();
  }

  protected getItem(key: string): string | undefined {
    const value = this.storage.getItem(this.prefix + key);

    return value !== null ? value : undefined;
  }

  protected setItem(key: string, value: string): void {
    return this.storage.setItem(this.prefix + key, value);
  }
}
