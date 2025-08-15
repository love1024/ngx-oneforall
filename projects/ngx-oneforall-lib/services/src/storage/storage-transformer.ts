import { isNumberString } from '@ngx-oneforall/utils';

export abstract class BaseStorageTransformer<T, S = string> {
  abstract serialize(value: T): S;
  abstract deserialize(data: S): T;
}

export class JsonTransformer<T> extends BaseStorageTransformer<
  T | undefined,
  string
> {
  override serialize(value: T): string {
    return JSON.stringify(value);
  }

  override deserialize(data: string): T | undefined {
    try {
      return JSON.parse(data);
    } catch {
      return undefined;
    }
  }
}

export class Base64Transformer extends BaseStorageTransformer<Uint8Array> {
  serialize(value: Uint8Array): string {
    return btoa(String.fromCharCode(...value));
  }

  deserialize(data: string): Uint8Array {
    const binary = atob(data);
    return new Uint8Array(binary.split('').map(char => char.charCodeAt(0)));
  }
}

export class DateTransformer extends BaseStorageTransformer<Date> {
  serialize(value: Date): string {
    return value.toISOString(); // or value.getTime().toString()
  }

  deserialize(data: string): Date {
    return new Date(data);
  }
}

export class StringTransformer extends BaseStorageTransformer<string> {
  serialize(value: string): string {
    return value;
  }

  deserialize(data: string): string {
    return data;
  }
}

export class BooleanTransformer extends BaseStorageTransformer<
  boolean | undefined
> {
  serialize(value: boolean): string {
    return value.toString();
  }

  deserialize(data: string): boolean | undefined {
    return data === 'true' ? true : data === 'false' ? false : undefined;
  }
}

export class NumberTransformer extends BaseStorageTransformer<
  number | undefined
> {
  serialize(value: number): string {
    return value.toString();
  }

  deserialize(data: string): number | undefined {
    const validNumber = isNumberString(data);
    return validNumber ? Number(data) : undefined;
  }
}

export const StorageTransformers = {
  JSON: new JsonTransformer<unknown>(),
  STRING: new StringTransformer(),
  BOOLEAN: new BooleanTransformer(),
  NUMBER: new NumberTransformer(),
  DATE: new DateTransformer(),
  BASE64: new Base64Transformer(),
} as const;
