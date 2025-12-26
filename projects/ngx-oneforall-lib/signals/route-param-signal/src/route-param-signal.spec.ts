import { Component } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute, ParamMap, convertToParamMap } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { routeParamSignal, routeParamsMapSignal } from './route-param-signal';

describe('ParamViewerComponent with routeParamSignal', () => {
  describe('Single route param', () => {
    @Component({
      selector: 'app-param-viewer',
      template: `<div class="id-value">{{ id() }}</div>`,
    })
    class ParamViewerComponent {
      id = routeParamSignal('id');
    }

    let fixture: ComponentFixture<ParamViewerComponent>;
    let paramMapSubject: BehaviorSubject<ParamMap>;
    let activatedRouteStub: unknown;

    beforeEach(() => {
      paramMapSubject = new BehaviorSubject<ParamMap>(
        convertToParamMap({ id: '123' })
      );
      activatedRouteStub = {
        paramMap: paramMapSubject.asObservable(),
        snapshot: {
          paramMap: convertToParamMap({ id: '123' }),
        },
      };

      TestBed.configureTestingModule({
        imports: [ParamViewerComponent],
        providers: [{ provide: ActivatedRoute, useValue: activatedRouteStub }],
      });

      fixture = TestBed.createComponent(ParamViewerComponent);
      fixture.detectChanges();
    });

    it('should display the initial id from route params', () => {
      const div = fixture.nativeElement.querySelector('.id-value');
      expect(div.textContent).toBe('123');
    });

    it('should update when the route param changes', () => {
      paramMapSubject.next(convertToParamMap({ id: '456' }));
      fixture.detectChanges();
      const div = fixture.nativeElement.querySelector('.id-value');
      expect(div.textContent).toBe('456');
    });

    it('should display null if id param is missing', () => {
      paramMapSubject.next(convertToParamMap({}));
      fixture.detectChanges();
      const div = fixture.nativeElement.querySelector('.id-value');
      expect(div.textContent).toBe('');
    });

    it('should react to multiple param changes', () => {
      paramMapSubject.next(convertToParamMap({ id: '789' }));
      fixture.detectChanges();
      let div = fixture.nativeElement.querySelector('.id-value');
      expect(div.textContent).toBe('789');

      paramMapSubject.next(convertToParamMap({ id: '101' }));
      fixture.detectChanges();
      div = fixture.nativeElement.querySelector('.id-value');
      expect(div.textContent).toBe('101');
    });
  });

  describe('Route params map', () => {
    @Component({
      selector: 'app-param-map-viewer',
      template: `
        <div class="all-params">
          <span class="id-value">{{ params().get('id') }}</span>
          <span class="foo-value">{{ params().get('foo') }}</span>
        </div>
      `,
    })
    class ParamMapViewerComponent {
      params = routeParamsMapSignal();
    }

    let fixture: ComponentFixture<ParamMapViewerComponent>;
    let paramMapSubject: BehaviorSubject<ParamMap>;
    let activatedRouteStub: unknown;

    beforeEach(() => {
      paramMapSubject = new BehaviorSubject<ParamMap>(
        convertToParamMap({ id: 'abc', foo: 'bar' })
      );
      activatedRouteStub = {
        paramMap: paramMapSubject.asObservable(),
        snapshot: {
          paramMap: convertToParamMap({ id: 'abc', foo: 'bar' }),
        },
      };

      TestBed.configureTestingModule({
        imports: [ParamMapViewerComponent],
        providers: [{ provide: ActivatedRoute, useValue: activatedRouteStub }],
      });

      fixture = TestBed.createComponent(ParamMapViewerComponent);
      fixture.detectChanges();
    });

    it('should display all initial route params', () => {
      const idDiv = fixture.nativeElement.querySelector('.id-value');
      const fooDiv = fixture.nativeElement.querySelector('.foo-value');
      expect(idDiv.textContent).toBe('abc');
      expect(fooDiv.textContent).toBe('bar');
    });

    it('should update when route params change', () => {
      paramMapSubject.next(convertToParamMap({ id: 'xyz', foo: 'baz' }));
      fixture.detectChanges();

      const idDiv = fixture.nativeElement.querySelector('.id-value');
      const fooDiv = fixture.nativeElement.querySelector('.foo-value');
      expect(idDiv.textContent).toBe('xyz');
      expect(fooDiv.textContent).toBe('baz');
    });

    it('should display undefined for missing params', () => {
      paramMapSubject.next(convertToParamMap({}));
      fixture.detectChanges();
      const idDiv = fixture.nativeElement.querySelector('.id-value');
      const fooDiv = fixture.nativeElement.querySelector('.foo-value');
      expect(idDiv.textContent).toBe('');
      expect(fooDiv.textContent).toBe('');
    });
  });
});
