export const isNumberValue = (value: unknown): value is number => {
  return typeof value === 'number' && isFinite(value);
};

export const isNumberString = (value: unknown): value is string => {
  return (
    typeof value === 'string' &&
    !isNaN(Number(value)) &&
    !isNaN(parseFloat(value))
  );
};

// eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
export const isNumberObject = (value: unknown): value is Number => {
  return typeof value === 'object' && value instanceof Number;
};


export const isNumeric = (value: unknown): value is number | string => {
  return isNumberValue(value) || isNumberString(value);
};