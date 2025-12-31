/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { ClipboardService } from './clipboard.service';
import { DOCUMENT } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

describe('ClipboardService', () => {
  let service: ClipboardService;
  let documentMock: any;
  let navigatorMock: any;

  beforeEach(() => {
    documentMock = {
      createElement: jest.fn().mockReturnValue({
        style: {},
        focus: jest.fn(),
        select: jest.fn(),
      }),
      body: {
        appendChild: jest.fn(),
        removeChild: jest.fn(),
      },
      execCommand: jest.fn(),
    };

    navigatorMock = {
      clipboard: {
        writeText: jest.fn(),
        readText: jest.fn(),
      },
    };

    Object.defineProperty(window, 'navigator', {
      value: navigatorMock,
      writable: true,
    });

    TestBed.configureTestingModule({
      providers: [
        ClipboardService,
        { provide: DOCUMENT, useValue: documentMock },
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });
    service = TestBed.inject(ClipboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('copy', () => {
    it('should copy text using Clipboard API when available', async () => {
      navigatorMock.clipboard.writeText.mockResolvedValue(undefined);
      const result = await service.copy('test text');
      expect(navigatorMock.clipboard.writeText).toHaveBeenCalledWith(
        'test text'
      );
      expect(result).toBe(true);
    });

    it('should fallback to execCommand when Clipboard API fails', async () => {
      navigatorMock.clipboard.writeText.mockRejectedValue(new Error('Failed'));
      documentMock.execCommand.mockReturnValue(true);

      const result = await service.copy('test text');

      expect(documentMock.createElement).toHaveBeenCalledWith('textarea');
      expect(documentMock.body.appendChild).toHaveBeenCalled();
      expect(documentMock.execCommand).toHaveBeenCalledWith('copy');
      expect(documentMock.body.removeChild).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return false if both Clipboard API and fallback fail', async () => {
      navigatorMock.clipboard.writeText.mockRejectedValue(new Error('Failed'));
      documentMock.execCommand.mockImplementation(() => {
        throw new Error('Fallback failed');
      });

      const result = await service.copy('test text');
      expect(result).toBe(false);
    });

    it('should return false if not in browser', async () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          ClipboardService,
          { provide: DOCUMENT, useValue: documentMock },
          { provide: PLATFORM_ID, useValue: 'server' },
        ],
      });
      service = TestBed.inject(ClipboardService);

      const result = await service.copy('test text');
      expect(result).toBe(false);
    });

    it('should use fallback when Clipboard API is not available', async () => {
      TestBed.resetTestingModule();

      // Set navigator without clipboard property
      Object.defineProperty(window, 'navigator', {
        value: {},
        writable: true,
        configurable: true,
      });

      TestBed.configureTestingModule({
        providers: [
          ClipboardService,
          { provide: DOCUMENT, useValue: documentMock },
          { provide: PLATFORM_ID, useValue: 'browser' },
        ],
      });
      const serviceWithoutClipboard = TestBed.inject(ClipboardService);
      documentMock.execCommand.mockReturnValue(true);

      const result = await serviceWithoutClipboard.copy('test text');

      expect(documentMock.createElement).toHaveBeenCalledWith('textarea');
      expect(documentMock.execCommand).toHaveBeenCalledWith('copy');
      expect(result).toBe(true);
    });
  });

  describe('read', () => {
    it('should read text using Clipboard API when available', async () => {
      navigatorMock.clipboard.readText.mockResolvedValue('read text');
      const result = await service.read();
      expect(navigatorMock.clipboard.readText).toHaveBeenCalled();
      expect(result).toBe('read text');
    });

    it('should return empty string when Clipboard API fails', async () => {
      navigatorMock.clipboard.readText.mockRejectedValue(new Error('Failed'));
      const result = await service.read();
      expect(result).toBe('');
    });

    it('should return empty string if navigator.clipboard is not available', async () => {
      TestBed.resetTestingModule();

      // Set navigator without clipboard property before creating service
      Object.defineProperty(window, 'navigator', {
        value: {},
        writable: true,
        configurable: true,
      });

      TestBed.configureTestingModule({
        providers: [
          ClipboardService,
          { provide: DOCUMENT, useValue: documentMock },
          { provide: PLATFORM_ID, useValue: 'browser' },
        ],
      });
      const serviceWithoutClipboard = TestBed.inject(ClipboardService);

      const result = await serviceWithoutClipboard.read();
      expect(result).toBe('');
    });

    it('should return empty string if not in browser', async () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          ClipboardService,
          { provide: DOCUMENT, useValue: documentMock },
          { provide: PLATFORM_ID, useValue: 'server' },
        ],
      });
      service = TestBed.inject(ClipboardService);

      const result = await service.read();
      expect(result).toBe('');
    });
  });
});
