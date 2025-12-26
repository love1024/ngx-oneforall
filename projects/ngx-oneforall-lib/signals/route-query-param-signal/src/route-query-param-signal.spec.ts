import { Component } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute, ParamMap, convertToParamMap } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import {
  routeQueryParamSignal,
  routeQueryParamsMapSignal,
} from './route-query-param-signal';

describe('routeQueryParamSignal and routeQueryParamsMapSignal', () => {
  describe('Single query param', () => {
    @Component({
      selector: 'app-query-param-viewer',
      template: `<div class="id-value">{{ id() }}</div>`,
    })
    class QueryParamViewerComponent {
      id = routeQueryParamSignal('id');
    }

    let fixture: ComponentFixture<QueryParamViewerComponent>;
    let queryParamMapSubject: BehaviorSubject<ParamMap>;
    let activatedRouteStub: unknown;

    beforeEach(() => {
      queryParamMapSubject = new BehaviorSubject<ParamMap>(
        convertToParamMap({ id: '123' })
      );
      activatedRouteStub = {
        queryParamMap: queryParamMapSubject.asObservable(),
        snapshot: {
          queryParamMap: convertToParamMap({ id: '123' }),
        },
      };

      TestBed.configureTestingModule({
        imports: [QueryParamViewerComponent],
        providers: [{ provide: ActivatedRoute, useValue: activatedRouteStub }],
      });

      fixture = TestBed.createComponent(QueryParamViewerComponent);
      fixture.detectChanges();
    });

    it('should display the initial id from query params', () => {
      const div = fixture.nativeElement.querySelector('.id-value');
      expect(div.textContent).toBe('123');
    });

    it('should update when the query param changes', () => {
      queryParamMapSubject.next(convertToParamMap({ id: '456' }));
      fixture.detectChanges();
      const div = fixture.nativeElement.querySelector('.id-value');
      expect(div.textContent).toBe('456');
    });

    it('should display null if id param is missing', () => {
      queryParamMapSubject.next(convertToParamMap({}));
      fixture.detectChanges();
      const div = fixture.nativeElement.querySelector('.id-value');
      expect(div.textContent).toBe('');
    });

    it('should react to multiple param changes', () => {
      queryParamMapSubject.next(convertToParamMap({ id: '789' }));
      fixture.detectChanges();
      let div = fixture.nativeElement.querySelector('.id-value');
      expect(div.textContent).toBe('789');

      queryParamMapSubject.next(convertToParamMap({ id: '101' }));
      fixture.detectChanges();
      div = fixture.nativeElement.querySelector('.id-value');
      expect(div.textContent).toBe('101');
    });
  });

  describe('Query params map', () => {
    @Component({
      selector: 'app-query-param-map-viewer',
      template: `
        <div class="all-params">
          <span class="id-value">{{ params().get('id') }}</span>
          <span class="foo-value">{{ params().get('foo') }}</span>
        </div>
      `,
    })
    class QueryParamMapViewerComponent {
      params = routeQueryParamsMapSignal();
    }

    let fixture: ComponentFixture<QueryParamMapViewerComponent>;
    let queryParamMapSubject: BehaviorSubject<ParamMap>;
    let activatedRouteStub: unknown;

    beforeEach(() => {
      queryParamMapSubject = new BehaviorSubject<ParamMap>(
        convertToParamMap({ id: 'abc', foo: 'bar' })
      );
      activatedRouteStub = {
        queryParamMap: queryParamMapSubject.asObservable(),
        snapshot: {
          queryParamMap: convertToParamMap({ id: 'abc', foo: 'bar' }),
        },
      };

      TestBed.configureTestingModule({
        imports: [QueryParamMapViewerComponent],
        providers: [{ provide: ActivatedRoute, useValue: activatedRouteStub }],
      });

      fixture = TestBed.createComponent(QueryParamMapViewerComponent);
      fixture.detectChanges();
    });

    it('should display all initial query params', () => {
      const idDiv = fixture.nativeElement.querySelector('.id-value');
      const fooDiv = fixture.nativeElement.querySelector('.foo-value');
      expect(idDiv.textContent).toBe('abc');
      expect(fooDiv.textContent).toBe('bar');
    });

    it('should update when query params change', () => {
      queryParamMapSubject.next(convertToParamMap({ id: 'xyz', foo: 'baz' }));
      fixture.detectChanges();

      const idDiv = fixture.nativeElement.querySelector('.id-value');
      const fooDiv = fixture.nativeElement.querySelector('.foo-value');
      expect(idDiv.textContent).toBe('xyz');
      expect(fooDiv.textContent).toBe('baz');
    });

    it('should display undefined for missing params', () => {
      queryParamMapSubject.next(convertToParamMap({}));
      fixture.detectChanges();
      const idDiv = fixture.nativeElement.querySelector('.id-value');
      const fooDiv = fixture.nativeElement.querySelector('.foo-value');
      expect(idDiv.textContent).toBe('');
      expect(fooDiv.textContent).toBe('');
    });

    it('should react to multiple param changes', () => {
      queryParamMapSubject.next(convertToParamMap({ id: '1', foo: '2' }));
      fixture.detectChanges();
      let idDiv = fixture.nativeElement.querySelector('.id-value');
      let fooDiv = fixture.nativeElement.querySelector('.foo-value');
      expect(idDiv.textContent).toBe('1');
      expect(fooDiv.textContent).toBe('2');

      queryParamMapSubject.next(convertToParamMap({ id: '3', foo: '4' }));
      fixture.detectChanges();
      idDiv = fixture.nativeElement.querySelector('.id-value');
      fooDiv = fixture.nativeElement.querySelector('.foo-value');
      expect(idDiv.textContent).toBe('3');
      expect(fooDiv.textContent).toBe('4');
    });
  });
});
