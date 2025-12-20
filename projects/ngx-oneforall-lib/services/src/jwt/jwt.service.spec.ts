import { JwtOptions } from './jwt-provider';
import { JwtService } from './jwt.service';

// Helper to create a JWT token
function createJwt(
  payload: object,
  header: object = { alg: 'HS256', typ: 'JWT' }
) {
  const base64UrlEncode = (obj: object) =>
    Buffer.from(JSON.stringify(obj)).toString('base64url');
  return [base64UrlEncode(header), base64UrlEncode(payload), 'signature'].join(
    '.'
  );
}

describe('JwtService', () => {
  let service: JwtService;
  let now: number;
  let token: string;

  beforeEach(() => {
    now = Math.floor(Date.now() / 1000);
    token = createJwt(
      { foo: 'bar', exp: now + 100, iat: now - 100, nbf: now - 50 },
      { typ: 'JWT', alg: 'none' }
    );
    service = new JwtService({
      tokenGetter: () => token,
    });
  });

  it('should decode header and body using default tokenGetter', () => {
    expect(service.decodeHeader()).toEqual({ typ: 'JWT', alg: 'none' });
    expect(service.decodeBody()).toEqual({
      foo: 'bar',
      exp: now + 100,
      iat: now - 100,
      nbf: now - 50,
    });
  });

  it('should get claim from body using default tokenGetter', () => {
    expect(service.getClaim('foo')).toBe('bar');
    expect(service.getClaim('exp')).toBe(now + 100);
    expect(service.getClaim('missing')).toBeUndefined();
  });

  it('should get expiration and issued at dates using default tokenGetter', () => {
    const expDate = service.getExpirationDate();
    const iatDate = service.getIssuedAtDate();
    expect(expDate).toBeInstanceOf(Date);
    expect(iatDate).toBeInstanceOf(Date);
    expect(expDate?.getTime()).toBe((now + 100) * 1000);
    expect(iatDate?.getTime()).toBe((now - 100) * 1000);
  });

  it('should check if token is expired using default tokenGetter', () => {
    // Set tokenGetter to expired token
    service = new JwtService({
      tokenGetter: () => createJwt({ exp: now - 10 }),
    });
    expect(service.isExpired()).toBe(true);

    // Set tokenGetter to valid token
    service = new JwtService({
      tokenGetter: () => createJwt({ exp: now + 100 }),
    });
    expect(service.isExpired()).toBe(false);
  });

  it('should check if token is not yet valid using default tokenGetter', () => {
    // Set tokenGetter to future nbf
    service = new JwtService({
      tokenGetter: () => createJwt({ nbf: now + 100 }),
    });
    expect(service.isNotYetValid()).toBe(true);

    // Set tokenGetter to past nbf
    service = new JwtService({
      tokenGetter: () => createJwt({ nbf: now - 100 }),
    });
    expect(service.isNotYetValid()).toBe(false);
  });

  it('should get time until expiration using default tokenGetter', () => {
    expect(service.getTimeUntilExpiration()).toBeGreaterThan(0);
  });

  it('should return null for time until expiration if no exp using default tokenGetter', () => {
    service = new JwtService({
      tokenGetter: () => createJwt({}),
    });
    expect(service.getTimeUntilExpiration()).toBeNull();
  });

  it('should validate token structure and claims using default tokenGetter', () => {
    service = new JwtService({
      tokenGetter: () => createJwt({ exp: now + 100, nbf: now - 100 }),
    });
    expect(service.isValid()).toBe(true);

    service = new JwtService({
      tokenGetter: () => createJwt({ exp: now - 10, nbf: now - 100 }),
    });
    expect(service.isValid()).toBe(false);

    service = new JwtService({
      tokenGetter: () => createJwt({ exp: now + 100, nbf: now + 100 }),
    });
    expect(service.isValid()).toBe(false);

    service = new JwtService({
      tokenGetter: () => 'invalid.token',
    });
    expect(service.isValid()).toBe(false);
  });

  it('should handle empty token from tokenGetter gracefully', () => {
    service = new JwtService();
    expect(() => service.decodeHeader()).toThrow('Token is missing.');
    expect(() => service.decodeBody()).toThrow('Token is missing.');
    expect(service.isValid()).toBe(false);
    expect(() => service.getClaim('foo')).toThrow('Token is missing.');
    expect(() => service.getExpirationDate()).toThrow('Token is missing.');
    expect(() => service.getIssuedAtDate()).toThrow('Token is missing.');
    expect(() => service.isExpired()).toThrow('Token is missing.');
    expect(() => service.isNotYetValid()).toThrow('Token is missing.');
    expect(() => service.getTimeUntilExpiration()).toThrow('Token is missing.');
  });

  it('should throw "Token is not a valid JWT." if token does not have 3 parts', () => {
    service = new JwtService({ tokenGetter: () => 'invalid.token' });
    expect(() => service.decodeHeader()).toThrow('Token is not a valid JWT.');
    expect(() => service.decodeBody()).toThrow('Token is not a valid JWT.');

    service = new JwtService({ tokenGetter: () => 'part1.part2.part3.part4' });
    expect(() => service.decodeHeader()).toThrow('Token is not a valid JWT.');
    expect(() => service.decodeBody()).toThrow('Token is not a valid JWT.');
  });

  it('should return null for issued at date if iat is not available', () => {
    service = new JwtService({
      tokenGetter: () => createJwt({ exp: now + 100 }),
    });
    expect(service.getIssuedAtDate()).toBeNull();
  });

  it('should return false for isExpred if exp is not available', () => {
    service = new JwtService({
      tokenGetter: () => createJwt({ iat: now - 100 }),
    });
    expect(service.isExpired()).toBeFalsy();
  });

  it('should return false for isNotYetValid if nbf is not available', () => {
    service = new JwtService({
      tokenGetter: () => createJwt({ exp: now + 100 }),
    });
    expect(service.isNotYetValid()).toBe(false);
  });

  it('should return config', () => {
    const config: JwtOptions = {
      tokenGetter: () => '',
    };

    service = new JwtService(config);

    expect(service.getConfig()).toEqual(config);
  });

  it('should return token', () => {
    const config: JwtOptions = {
      tokenGetter: () => 'abc',
    };

    service = new JwtService(config);

    expect(service.getToken()).toEqual('abc');
  });
});
