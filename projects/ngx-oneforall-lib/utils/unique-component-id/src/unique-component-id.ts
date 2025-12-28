export let lastId = 0;

export function uniqueComponentId(prefix = 'id'): string {
  lastId++;
  return `${prefix}${lastId}`;
}
