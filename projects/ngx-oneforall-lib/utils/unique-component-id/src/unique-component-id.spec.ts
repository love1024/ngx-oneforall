import { uniqueComponentId } from './unique-component-id';

describe('uniqueComponentId', () => {
  it('should generate a unique ID with the default prefix', () => {
    const id1 = uniqueComponentId();
    const id2 = uniqueComponentId();

    expect(id1).not.toBe(id2);
    expect(id1).toMatch(/^id-[a-z0-9]+-\d+$/);
    expect(id2).toMatch(/^id-[a-z0-9]+-\d+$/);
  });

  it('should generate a unique ID with a custom prefix', () => {
    const prefix = 'custom';
    const id1 = uniqueComponentId(prefix);
    const id2 = uniqueComponentId(prefix);

    expect(id1).not.toBe(id2);
    expect(id1).toMatch(/^custom-[a-z0-9]+-\d+$/);
    expect(id2).toMatch(/^custom-[a-z0-9]+-\d+$/);
  });

  it('should increment the ID counter correctly', () => {
    const id1 = uniqueComponentId();
    const id2 = uniqueComponentId();

    const parts1 = id1.split('-');
    const parts2 = id2.split('-');

    const idNumber1 = parseInt(parts1[parts1.length - 1], 10);
    const idNumber2 = parseInt(parts2[parts2.length - 1], 10);

    expect(idNumber2).toBe(idNumber1 + 1);
  });
});
