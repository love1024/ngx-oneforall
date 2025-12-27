import { EventService, AppEvent } from './event.service';

describe('EventService', () => {
  let service: EventService<string>;

  beforeEach(() => {
    service = new EventService<string>();
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('should emit dispatched events', done => {
    const testEvent: AppEvent<string> = { name: 'test', data: { foo: 'bar' } };
    service.getEventEmitter().subscribe(event => {
      expect(event).toEqual(testEvent);
      done();
    });
    service.dispatchEvent('test', { foo: 'bar' });
  });

  it('should emit event with undefined data if not provided', done => {
    service.getEventEmitter().subscribe(event => {
      expect(event.name).toBe('noData');
      expect(event.data).toBeUndefined();
      done();
    });
    service.dispatchEvent('noData');
  });
});
