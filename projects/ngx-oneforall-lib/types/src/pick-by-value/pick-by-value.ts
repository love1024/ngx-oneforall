import { KeysOfType } from "../keys-of-type/keys-of-type";

export type PickByValue<T, V> = Pick<T, KeysOfType<T, V>>;

