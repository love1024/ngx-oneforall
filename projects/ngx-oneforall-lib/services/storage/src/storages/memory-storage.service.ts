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

  length(): number {
    return this.storage.size;
  }

  key(index: number): string | null {
    return Array.from(this.storage.keys())[index] ?? null;
  }

  keys(): string[] {
    return Array.from(this.storage.keys());
  }

  protected getItem(key: string): string | undefined {
    return this.storage.get(key);
  }

  protected setItem(key: string, value: string): void {
    this.storage.set(key, value);
  }
}
