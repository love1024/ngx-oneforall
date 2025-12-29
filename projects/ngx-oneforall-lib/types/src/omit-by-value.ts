import { KeysOfType } from './keys-of-type';

export type OmitByValue<T, V> = Omit<T, KeysOfType<T, V>>;
