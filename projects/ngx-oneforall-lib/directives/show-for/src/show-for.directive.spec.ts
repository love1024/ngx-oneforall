import { Component, signal } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ShowForDirective } from './show-for.directive';
import { By } from '@angular/platform-browser';

@Component({
  imports: [ShowForDirective],
  template: `
    <ng-template
      [showFor]="duration()"
      [showForThen]="thenTpl"
      (showForOnExpired)="onExpired()">
      <div class="content">Visible content</div>
    </ng-template>

    <ng-template #thenTpl>
      <div class="expired">Expired</div>
    </ng-template>
  `,
})
class TestHostComponent {
  duration = signal(1000);
  expiredCount = 0;

  onExpired() {
    this.expiredCount++;
  }
}

@Component({
  imports: [ShowForDirective],
  template: ` <div *showFor="duration()" class="simple">Simple</div> `,
})
class SimpleHostComponent {
  duration = signal(500);
}

describe('ShowForDirective', () => {
  describe('with then template', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let component: TestHostComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TestHostComponent, ShowForDirective],
      });
      fixture = TestBed.createComponent(TestHostComponent);
      component = fixture.componentInstance;
    });

    it('should show element initially', fakeAsync(() => {
      fixture.detectChanges();
      const content = fixture.debugElement.query(By.css('.content'));
      expect(content).toBeTruthy();
      expect(content.nativeElement.textContent.trim()).toBe('Visible content');

      // cleanup
      tick(1000);
    }));

    it('should remove element after timer expires', fakeAsync(() => {
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('.content'))).toBeTruthy();

      tick(1000);
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('.content'))).toBeNull();
    }));

    it('should show then template after expiry', fakeAsync(() => {
      fixture.detectChanges();

      tick(1000);
      fixture.detectChanges();

      const expired = fixture.debugElement.query(By.css('.expired'));
      expect(expired).toBeTruthy();
      expect(expired.nativeElement.textContent.trim()).toBe('Expired');
    }));

    it('should emit showForOnExpired when timer expires', fakeAsync(() => {
      fixture.detectChanges();
      expect(component.expiredCount).toBe(0);

      tick(1000);
      fixture.detectChanges();

      expect(component.expiredCount).toBe(1);
    }));

    it('should reset timer when duration changes', fakeAsync(() => {
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('.content'))).toBeTruthy();

      tick(500);
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('.content'))).toBeTruthy();

      // Change duration, which resets the timer
      component.duration.set(2000);
      fixture.detectChanges();

      // Old timer (500ms remaining) should not fire
      tick(500);
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('.content'))).toBeTruthy();

      // New timer should fire at 2000ms from reset
      tick(1500);
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('.content'))).toBeNull();
      expect(fixture.debugElement.query(By.css('.expired'))).toBeTruthy();
    }));
  });

  describe('without then template', () => {
    let fixture: ComponentFixture<SimpleHostComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [SimpleHostComponent, ShowForDirective],
      });
      fixture = TestBed.createComponent(SimpleHostComponent);
    });

    it('should remove element and leave nothing after expiry', fakeAsync(() => {
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('.simple'))).toBeTruthy();

      tick(500);
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('.simple'))).toBeNull();
      expect(fixture.nativeElement.textContent.trim()).toBe('');
    }));

    it('should treat negative duration as 0', fakeAsync(() => {
      fixture.componentInstance.duration.set(-100);
      fixture.detectChanges();

      tick(0);
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('.simple'))).toBeNull();
    }));
  });
});
