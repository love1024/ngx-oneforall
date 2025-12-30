import { Component, PLATFORM_ID } from '@angular/core';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { webSocketSignal } from './websocket-signal';

describe('webSocketSignal', () => {
  let mockWebSocket: any;

  beforeEach(() => {
    // Mock WebSocket
    mockWebSocket = {
      send: jest.fn(),
      close: jest.fn(),
      readyState: WebSocket.OPEN,
      onopen: null,
      onmessage: null,
      onerror: null,
      onclose: null,
    };

    (global as any).WebSocket = jest.fn(() => mockWebSocket);
    (global as any).WebSocket.OPEN = 1;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create with connecting status', () => {
    TestBed.runInInjectionContext(() => {
      const ws = webSocketSignal('ws://localhost');
      expect(ws.status()).toBe('connecting');
      expect(global.WebSocket).toHaveBeenCalledWith('ws://localhost');
    });
  });

  it('should update status to open on connection', () => {
    TestBed.runInInjectionContext(() => {
      const ws = webSocketSignal('ws://localhost');

      // Simulate open event
      mockWebSocket.onopen();

      expect(ws.status()).toBe('open');
    });
  });

  it('should receive messages (JSON)', () => {
    TestBed.runInInjectionContext(() => {
      const ws = webSocketSignal('ws://localhost');

      mockWebSocket.onmessage({ data: '{"id": 1}' } as MessageEvent);

      expect(ws.messages()).toEqual({ id: 1 });
    });
  });

  it('should receive messages (Text/Non-JSON)', () => {
    TestBed.runInInjectionContext(() => {
      const ws = webSocketSignal('ws://localhost');

      mockWebSocket.onmessage({ data: 'hello' } as MessageEvent);

      expect(ws.messages()).toBe('hello');
    });
  });

  it('should handle errors', () => {
    TestBed.runInInjectionContext(() => {
      const ws = webSocketSignal('ws://localhost');
      const errorEvent = new Event('error');

      mockWebSocket.onerror(errorEvent);

      expect(ws.status()).toBe('error');
      expect(ws.error()).toBe(errorEvent);
    });
  });

  it('should handle close', () => {
    TestBed.runInInjectionContext(() => {
      const ws = webSocketSignal('ws://localhost');

      mockWebSocket.onclose();

      expect(ws.status()).toBe('closed');
    });
  });

  it('should send messages when open', () => {
    TestBed.runInInjectionContext(() => {
      const ws = webSocketSignal('ws://localhost');
      mockWebSocket.readyState = 1; // OPEN

      ws.send({ test: true });

      expect(mockWebSocket.send).toHaveBeenCalledWith('{"test":true}');
    });
  });

  it('should report error if sending when not open', () => {
    TestBed.runInInjectionContext(() => {
      const ws = webSocketSignal('ws://localhost');
      mockWebSocket.readyState = 0; // CONNECTING

      ws.send({ test: true });

      expect(mockWebSocket.send).not.toHaveBeenCalled();
      expect(ws.error()?.type).toBe('WebSocket not open');
    });
  });

  it('should close on request', () => {
    TestBed.runInInjectionContext(() => {
      const ws = webSocketSignal('ws://localhost');
      ws.close();
      expect(mockWebSocket.close).toHaveBeenCalled();
    });
  });

  it('should close on destroy', () => {
    @Component({ template: '', standalone: true })
    class TestComponent {
      ws = webSocketSignal('ws://localhost');
    }

    const fixture = TestBed.createComponent(TestComponent);
    fixture.destroy();

    expect(mockWebSocket.close).toHaveBeenCalled();
  });

  it('should not create WebSocket on server (SSR)', () => {
    const WebSocketSpy = jest.fn();
    (global as any).WebSocket = WebSocketSpy;

    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
    });

    TestBed.runInInjectionContext(() => {
      const ws = webSocketSignal('ws://localhost');
      expect(ws.status()).toBe('closed');
      expect(ws.messages()).toBeNull();
    });

    expect(WebSocketSpy).not.toHaveBeenCalled();
  });
});
