import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  viewChild,
  inject,
} from '@angular/core';
import { eventSignal } from 'ngx-oneforall/signals/event-signal';

@Component({
  selector: 'event-signal-demo',
  standalone: true,
  template: `
    <div class="demo-container">
      <button #btn>Click me ({{ clickCount() }})</button>
      <div class="event-log" #area>
        Move mouse over me
        <br />
        Coordinates: {{ coordinates() }}
      </div>
    </div>
  `,
  styleUrl: './event-signal-demo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventSignalDemoComponent {
  btn = viewChild.required<ElementRef<HTMLButtonElement>>('btn');
  area = viewChild.required<ElementRef<HTMLElement>>('area');
  private elementRef = inject(ElementRef);

  clickSignal = eventSignal(this.elementRef.nativeElement, 'click');

  clickCount = () => {
    const event = this.clickSignal();
    return event ? 'Clicked!' : 'No clicks yet';
  };

  moveSignal = eventSignal(this.elementRef.nativeElement, 'mousemove');

  coordinates = () => {
    const e = this.moveSignal() as MouseEvent | null;
    return e ? `${e.offsetX}, ${e.offsetY}` : '0, 0';
  };
}
