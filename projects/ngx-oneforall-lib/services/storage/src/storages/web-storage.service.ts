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
    if (!this.prefix) {
      this.storage.clear();
      return;
    }
    // Only clear keys with prefix
    for (let i = this.storage.length - 1; i >= 0; i--) {
      const key = this.storage.key(i);
      if (key?.startsWith(this.prefix)) {
        this.storage.removeItem(key);
      }
    }
  }

  length(): number {
    return this.storage.length;
  }

  key(index: number) {
    return this.storage.key(index);
  }

  keys(): string[] {
    const result: string[] = [];
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key !== null) {
        if (this.prefix && key.startsWith(this.prefix)) {
          result.push(key.slice(this.prefix.length));
        } else if (!this.prefix) {
          result.push(key);
        }
      }
    }
    return result;
  }

  protected getItem(key: string): string | undefined {
    const value = this.storage.getItem(this.prefix + key);

    return value !== null ? value : undefined;
  }

  protected setItem(key: string, value: string): void {
    return this.storage.setItem(this.prefix + key, value);
  }
}
