import { SafeHtmlPipe } from './safe-html.pipe';
import { DomSanitizer } from '@angular/platform-browser';
import { TestBed } from '@angular/core/testing';

describe('SafeHtmlPipe', () => {
  let pipe: SafeHtmlPipe;
  let sanitizer: DomSanitizer;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        {
          provide: DomSanitizer,
          useValue: {
            bypassSecurityTrustHtml: jest.fn((html: string) => html),
          },
        },
        SafeHtmlPipe,
      ],
    });
    sanitizer = TestBed.inject(DomSanitizer);
    pipe = TestBed.inject(SafeHtmlPipe);
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return a SafeHtml object for valid HTML strings', () => {
    const htmlString = '<div>Test</div>';
    const sanitizedHtml = pipe.transform(htmlString);

    expect(sanitizedHtml).toEqual(
      sanitizer.bypassSecurityTrustHtml(htmlString)
    );
  });

  it('should return an empty string for null or undefined values', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });

  it('should throw an error if the value is not a string', () => {
    expect(() => pipe.transform(123)).toThrowError(
      new TypeError('Value must be a string')
    );
    expect(() => pipe.transform({})).toThrowError(
      new TypeError('Value must be a string')
    );
    expect(() => pipe.transform([])).toThrowError(
      new TypeError('Value must be a string')
    );
  });
});
