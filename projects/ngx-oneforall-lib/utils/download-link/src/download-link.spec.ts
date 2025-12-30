/* eslint-disable @typescript-eslint/no-explicit-any */
import { downloadLink } from './download-link';

describe('downloadLink', () => {
  let createElementSpy: jest.SpyInstance;
  let appendChildSpy: jest.SpyInstance;
  let removeChildSpy: jest.SpyInstance;
  let clickSpy: jest.Mock;
  let mockAnchor: any;

  beforeEach(() => {
    clickSpy = jest.fn();
    mockAnchor = {
      href: '',
      download: '',
      style: {},
      click: clickSpy,
    } as any;

    createElementSpy = jest
      .spyOn(document, 'createElement')
      .mockReturnValue(mockAnchor);
    appendChildSpy = jest
      .spyOn(document.body, 'appendChild')
      .mockImplementation(() => mockAnchor);
    removeChildSpy = jest
      .spyOn(document.body, 'removeChild')
      .mockImplementation(() => mockAnchor);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create an anchor element with correct attributes', () => {
    const url = 'https://example.com/file.pdf';
    const fileName = 'my-file.pdf';

    downloadLink(url, fileName);

    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(mockAnchor.href).toBe(url);
    expect(mockAnchor.download).toBe(fileName);
    expect(mockAnchor.style.display).toBe('none');
  });

  it('should use default filename if not provided', () => {
    const url = 'https://example.com/file.pdf';

    downloadLink(url);

    expect(mockAnchor.download).toBe('download');
  });

  it('should append, click, and remove the anchor', () => {
    const url = 'https://example.com/file.pdf';

    downloadLink(url);

    expect(appendChildSpy).toHaveBeenCalledWith(mockAnchor);
    expect(clickSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalledWith(mockAnchor);
  });
});
