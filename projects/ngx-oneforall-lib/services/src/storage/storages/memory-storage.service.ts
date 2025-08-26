import { StorageEngine } from '../storage-engine';

export class MemoryStorageService extends StorageEngine {
  private readonly storage = new Map<string, string>();

  has(key: string): boolean {
    return this.storage.has(key);
  }

  remove(key: string): void {
    this.storage.delete(key);
  }

  clear(): void {
    this.storage.clear();
  }

  protected getItem(key: string): string | undefined {
    return this.storage.get(key);
  }

  protected setItem(key: string, value: string): void {
    this.storage.set(key, value);
  }
}
