import { TestBed } from '@angular/core/testing';
import { Provider } from '@angular/core';
import {
  LoggerService,
  DISABLE_LOGGER,
  CUSTOM_LOGGER,
  CustomLogger,
} from './logger.service';

describe('LoggerService', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    TestBed.resetTestingModule();
  });

  function configure(disableLogger: boolean, customLogger?: CustomLogger) {
    const providers: Provider[] = [
      LoggerService,
      { provide: DISABLE_LOGGER, useValue: disableLogger },
    ];
    if (customLogger) {
      providers.push({ provide: CUSTOM_LOGGER, useValue: customLogger });
    }
    TestBed.configureTestingModule({ providers });
    return TestBed.inject(LoggerService);
  }

  function configureWithoutDisable() {
    const providers: Provider[] = [LoggerService];
    TestBed.configureTestingModule({ providers });
    return TestBed.inject(LoggerService);
  }

  it('should use noop logger if DISABLE_LOGGER is true', () => {
    const logger = configure(true);
    logger.log('test');
    expect(typeof logger.log).toBe('function');
    expect(logger.log.toString()).toContain('(...args) =>');
  });

  it('should assume disabled false if no token is provided', () => {
    const logger = configureWithoutDisable();
    expect(logger.log.toString()).toEqual(console.log.bind(console).toString());
  });

  it('should use custom logger if provided', () => {
    const customLogger: CustomLogger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    };
    const logger = configure(false, customLogger);
    logger.log('custom log');
    logger.error('custom error');
    logger.warn('custom warn');
    logger.debug('custom debug');
    expect(customLogger.log).toHaveBeenCalledWith('custom log');
    expect(customLogger.error).toHaveBeenCalledWith('custom error');
    expect(customLogger.warn).toHaveBeenCalledWith('custom warn');
    expect(customLogger.debug).toHaveBeenCalledWith('custom debug');
  });

  it('should use console methods by default', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const debugSpy = jest.spyOn(console, 'debug').mockImplementation(() => {});
    const logger = configure(false);
    logger.log('console log');
    logger.error('console error');
    logger.warn('console warn');
    logger.debug('console debug');
    expect(logSpy).toHaveBeenCalledWith('console log');
    expect(errorSpy).toHaveBeenCalledWith('console error');
    expect(warnSpy).toHaveBeenCalledWith('console warn');
    expect(debugSpy).toHaveBeenCalledWith('console debug');
  });

  it('should bind console methods correctly', () => {
    const logger = configure(false);
    expect(logger.log.toString()).toEqual(console.log.bind(console).toString());
    expect(logger.error.toString()).toStrictEqual(
      console.error.bind(console).toString()
    );
    expect(logger.warn.toString()).toStrictEqual(
      console.warn.bind(console).toString()
    );
    expect(logger.debug.toString()).toStrictEqual(
      console.debug.bind(console).toString()
    );
  });

  it('noopLogger should do nothing', () => {
    const logger = configure(true);
    expect(() => logger.log('should do nothing')).not.toThrow();
  });
});
