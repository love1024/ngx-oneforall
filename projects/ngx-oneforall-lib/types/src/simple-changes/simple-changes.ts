interface ComponentChange<T, P extends keyof T> {
  previousValue: T[P];
  currentValue: T[P];
  firstChange: boolean;
}

export type SimpleChangesTyped<T> = {
  [P in keyof T]?: ComponentChange<T, P>;
};
