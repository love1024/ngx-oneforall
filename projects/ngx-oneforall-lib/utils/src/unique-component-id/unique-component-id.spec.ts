import { uniqueComponentId } from './unique-component-id';

describe('uniqueComponentId', () => {
  it('should generate a unique ID with the default prefix', () => {
    const id1 = uniqueComponentId();
    const id2 = uniqueComponentId();

    expect(id1).not.toBe(id2);
    expect(id1).toMatch(/^id\d+$/);
    expect(id2).toMatch(/^id\d+$/);
  });

  it('should generate a unique ID with a custom prefix', () => {
    const prefix = 'custom-';
    const id1 = uniqueComponentId(prefix);
    const id2 = uniqueComponentId(prefix);

    expect(id1).not.toBe(id2);
    expect(id1).toMatch(/^custom-\d+$/);
    expect(id2).toMatch(/^custom-\d+$/);
  });

  it('should increment the ID counter correctly', () => {
    const id1 = uniqueComponentId();
    const id2 = uniqueComponentId();

    const idNumber1 = parseInt(id1.replace('id', ''), 10);
    const idNumber2 = parseInt(id2.replace('id', ''), 10);

    expect(idNumber2).toBe(idNumber1 + 1);
  });
});
