import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { Component, DebugElement, ElementRef, NgZone } from '@angular/core';
import { ResizedDirective, ResizedEvent } from './resized.directive';
import { By } from '@angular/platform-browser';

@Component({
    template: `<div resized></div>`,
    standalone: true,
    imports: [ResizedDirective]
})
class TestHostComponent {}



describe('ResizedDirective', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let elementRef: DebugElement;
    let directive: ResizedDirective;
    let mockResizeObserver: jest.Mocked<ResizeObserver> = {
        observe: jest.fn(),
        disconnect: jest.fn(),
        unobserve: jest.fn(),
    } as unknown as jest.Mocked<ResizeObserver>;

    let emitSpy: jest.SpyInstance;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ResizedDirective, TestHostComponent]
        }).compileComponents();


        fixture = TestBed.createComponent(TestHostComponent);
       
        elementRef = fixture.debugElement.query(By.directive(ResizedDirective));
        directive = elementRef.injector.get(ResizedDirective);
        
        emitSpy = jest.spyOn(directive.resized, 'emit');

                
        // Mock ResizeObserver globally
        global.ResizeObserver = jest.fn().mockImplementation((cb) => {
            cb([]);
            return mockResizeObserver
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should initialize ResizeObserver and observe the element', () => {
        fixture.detectChanges();
        expect(mockResizeObserver.observe).toHaveBeenCalledWith(elementRef.nativeElement);
    });

    it('should emit resized event on size change', () => {
        const mockEntry = {
            contentRect: { width: 100, height: 100 } as DOMRectReadOnly,
        } as ResizeObserverEntry;

        global.ResizeObserver = jest.fn().mockImplementation((cb) => {
            cb([mockEntry]);
            return mockResizeObserver
        });

        fixture.detectChanges();

        expect(emitSpy).toHaveBeenCalledWith({
            current: mockEntry.contentRect,
            previous: null,
        });
    });

    it('should update previousRect after emitting resized event', () => {
        const mockEntry1 = {
            contentRect: { width: 100, height: 100 } as DOMRectReadOnly,
        } as ResizeObserverEntry;

        const mockEntry2 = {
            contentRect: { width: 200, height: 200 } as DOMRectReadOnly,
        } as ResizeObserverEntry;

        global.ResizeObserver = jest.fn().mockImplementation((cb) => {
            cb([mockEntry1]);
            cb([mockEntry2]);
            return mockResizeObserver
        });

        fixture.detectChanges();

        expect(emitSpy).toHaveBeenCalledWith({
            current: mockEntry2.contentRect,
            previous: mockEntry1.contentRect,
        });
    });

    it('should disconnect ResizeObserver on destroy', () => {
        fixture.detectChanges()

        fixture.destroy();
        expect(mockResizeObserver.disconnect).toHaveBeenCalled();
    });
    it('should not emit resized event if entries length is 0', () => {
        directive['handleResize']([]);

        expect(emitSpy).not.toHaveBeenCalled();
    });

});