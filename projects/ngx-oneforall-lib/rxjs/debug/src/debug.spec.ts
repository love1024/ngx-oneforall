import { of, throwError } from 'rxjs';
import { debug } from './debug';

describe('debug', () => {
  it('should log next values with tag and styles', done => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const source$ = of('test-value');
    const tag = 'TestTag';

    source$.pipe(debug(tag)).subscribe({
      next: () => {
        expect(logSpy).toHaveBeenCalledWith(
          `%c[${tag}: Next]`,
          'background: #00bbd4ff; color: #fff; padding: 3px; font-size: 9px;',
          'test-value'
        );
        logSpy.mockRestore();
        done();
      },
    });
  });

  it('should log error with tag and styles', done => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const testError = new Error('boom');
    const source$ = throwError(() => testError);
    const tag = 'ErrorTag';

    source$.pipe(debug(tag)).subscribe({
      error: err => {
        expect(err).toBe(testError);
        expect(errorSpy).toHaveBeenCalledWith(
          `%c[${tag}: Error]`,
          'background: #E91E63; color: #fff; padding: 3px; font-size: 9px;',
          testError
        );
        errorSpy.mockRestore();
        done();
      },
    });
  });

  it('should log complete with tag and styles', done => {
    const infoSpy = jest.spyOn(console, 'info').mockImplementation(() => {});
    const source$ = of();
    const tag = 'CompleteTag';

    source$.pipe(debug(tag)).subscribe({
      complete: () => {
        expect(infoSpy).toHaveBeenCalledWith(
          `%c[${tag}]: Complete`,
          'background:  #009688; color: #fff; padding: 3px; font-size: 9px;'
        );
        infoSpy.mockRestore();
        done();
      },
    });
  });

  describe('conditional logging', () => {
    it('should log when condition is true', done => {
      const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
      const source$ = of('log-me');
      const tag = 'CondTag';
      const when = () => true;

      source$.pipe(debug(tag, when)).subscribe({
        next: () => {
          expect(logSpy).toHaveBeenCalled();
          logSpy.mockRestore();
          done();
        },
      });
    });

    it('should not log when condition is false', done => {
      const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
      const source$ = of('skip-me');
      const tag = 'CondTag';
      const when = () => false;

      source$.pipe(debug(tag, when)).subscribe({
        next: () => {
          expect(logSpy).not.toHaveBeenCalled();
          logSpy.mockRestore();
          done();
        },
      });
    });

    it('should receive value in when condition', done => {
      const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
      const source$ = of(10);
      const tag = 'ValueTag';
      const when = (val?: number) => val === 10;

      source$.pipe(debug(tag, when)).subscribe({
        next: () => {
          expect(logSpy).toHaveBeenCalled();
          logSpy.mockRestore();
          done();
        },
      });
    });

    it('should skip next but log error/complete if when returns false for next but true for others (implicit)', done => {
      // Since when() is called without args for error/complete,
      // a simple toggle can control them separately if desired,
      // but usually it's one function.
      const errorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const source$ = throwError(() => 'error');
      const tag = 'ErrorTag';
      const when = (val?: string) => val === undefined; // true for error/complete (no args passed to when)

      source$.pipe(debug(tag, when)).subscribe({
        error: () => {
          expect(errorSpy).toHaveBeenCalledWith(
            `%c[${tag}: Error]`,
            expect.any(String),
            'error'
          );
          errorSpy.mockRestore();
          done();
        },
      });
    });

    it('should not log error if when() returns false', done => {
      const errorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const source$ = throwError(() => 'some error');
      const tag = 'ErrorTag';
      const when = () => false;

      source$.pipe(debug(tag, when)).subscribe({
        error: () => {
          expect(errorSpy).not.toHaveBeenCalled();
          errorSpy.mockRestore();
          done();
        },
      });
    });

    it('should not log complete if when() returns false', done => {
      const infoSpy = jest.spyOn(console, 'info').mockImplementation(() => {});
      const source$ = of();
      const tag = 'CompleteTag';
      const when = () => false;

      source$.pipe(debug(tag, when)).subscribe({
        complete: () => {
          expect(infoSpy).not.toHaveBeenCalled();
          infoSpy.mockRestore();
          done();
        },
      });
    });
  });
});
