import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { NetworkStatusService } from './network-status.service';

describe('NetworkStatusService', () => {
  let service: NetworkStatusService;
  let mockDocument: Document;
  let mockWindow: Window & typeof globalThis;

  beforeEach(() => {
    mockWindow = window;

    mockDocument = {
      defaultView: mockWindow,
    } as unknown as Document;

    TestBed.configureTestingModule({
      providers: [
        NetworkStatusService,
        { provide: DOCUMENT, useValue: mockDocument },
      ],
    });
  });

  describe('when window is available', () => {
    beforeEach(() => {
      service = TestBed.inject(NetworkStatusService);
    });

    it('should create the service', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize with online status as true', () => {
      expect(service.isOnline).toBe(true);
      expect(service.isOffline).toBe(false);
    });

    it('should update status to online when the "online" event is triggered', () => {
      const onlineEvent = new Event('online');
      mockWindow.dispatchEvent(onlineEvent);

      expect(service.isOnline).toBe(true);
      expect(service.isOffline).toBe(false);
    });

    it('should update status to offline when the "offline" event is triggered', () => {
      const offlineEvent = new Event('offline');
      mockWindow.dispatchEvent(offlineEvent);

      expect(service.isOnline).toBe(false);
      expect(service.isOffline).toBe(true);
    });

    it('should expose an observable for online status', done => {
      const onlineStatus$ = service.isOnline$;

      const onlineEvent = new Event('online');
      const offlineEvent = new Event('offline');

      const emittedStatuses: boolean[] = [];
      const subscription = onlineStatus$.subscribe(status => {
        emittedStatuses.push(status);

        if (emittedStatuses.length === 2) {
          expect(emittedStatuses).toEqual([true, false]);
          subscription.unsubscribe();
          done();
        }
      });

      mockWindow.dispatchEvent(onlineEvent);
      setTimeout(() => mockWindow.dispatchEvent(offlineEvent));
    });

    it('should expose a readonly signal for online status', () => {
      expect(service.isOnlineSignal()).toBe(true);

      const offlineEvent = new Event('offline');
      mockWindow.dispatchEvent(offlineEvent);

      expect(service.isOnlineSignal()).toBe(false);
    });
  });

  describe('when window is not available', () => {
    beforeEach(() => {
      TestBed.overrideProvider(DOCUMENT, {
        useValue: {
          defaultView: null,
        },
      });
      service = TestBed.inject(NetworkStatusService);
    });
    it('should not subscribe to network events if window is not available', () => {
      const serviceWithoutWindow = TestBed.inject(NetworkStatusService);

      expect(serviceWithoutWindow.isOnline).toBe(true);

      // TODO: check somehow if the subscription to network events is not created
    });
  });
});
