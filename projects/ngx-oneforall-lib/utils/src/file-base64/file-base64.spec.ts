import { fileToBase64 } from './file-base64';

describe('fileToBase64', () => {
  const mockBase64 = 'data:text/plain;base64,dGVzdCBjb250ZW50';

  // Mock FileReader
  const mockFileReader = {
    readAsDataURL: jest.fn(),
    readAsArrayBuffer: jest.fn(),
    readAsBinaryString: jest.fn(),
    readAsText: jest.fn(),
    onload: jest.fn(),
    onerror: jest.fn(),
    result: mockBase64,
    onabort: null,
    onloadend: null,
    onloadstart: null,
    onprogress: null,
    readyState: 0 as 0 | 1 | 2,
    abort: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
    error: null,
    EMPTY: 0 as const,
    LOADING: 1 as const,
    DONE: 2 as const,
  };

  it('should resolve with a base64 string when the file is successfully read', async () => {
    const mockFile = new File(['test content'], 'test.txt', {
      type: 'text/plain',
    });

    jest.spyOn(window, 'FileReader').mockImplementation(() => mockFileReader);

    const promise = fileToBase64(mockFile);

    // Simulate successful file read
    mockFileReader.onload();

    await expect(promise).resolves.toBe(mockBase64);
  });

  it('should reject with an error when the file reading fails', async () => {
    const mockFile = new File(['test content'], 'test.txt', {
      type: 'text/plain',
    });
    const mockError = new Error('File reading failed');

    jest.spyOn(window, 'FileReader').mockImplementation(() => mockFileReader);

    const promise = fileToBase64(mockFile);

    // Simulate file read error
    mockFileReader.onerror(mockError);

    await expect(promise).rejects.toThrow(mockError);
  });

  it('should call FileReader.readAsDataURL with the provided file', () => {
    const mockFile = new File(['test content'], 'test.txt', {
      type: 'text/plain',
    });

    // Mock FileReader
    const mockFileReader = {
      readAsDataURL: jest.fn(),
      onload: null,
      onerror: null,
    };
    jest
      .spyOn(window, 'FileReader')
      .mockImplementation(() => mockFileReader as unknown as FileReader);

    fileToBase64(mockFile);

    expect(mockFileReader.readAsDataURL).toHaveBeenCalledWith(mockFile);
  });
});
