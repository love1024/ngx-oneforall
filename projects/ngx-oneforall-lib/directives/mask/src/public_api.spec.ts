import { MaskDirective, MaskQuantifier, patterns } from './public_api';

describe('Public API', () => {
  it('should export artifacts', () => {
    expect(MaskDirective).toBeDefined();
    expect(MaskQuantifier).toBeDefined();
    expect(patterns).toBeDefined();
  });
});
