import { ChangeDetectionStrategy, Component, ElementRef, viewChild, inject } from '@angular/core';
import { eventSignal } from '@ngx-oneforall/signals';

@Component({
    selector: 'event-signal-demo',
    standalone: true,
    template: `
    <div class="demo-container">
      <button #btn>Click me ({{ clickCount() }})</button>
      <div class="event-log" #area>
        Move mouse over me
        <br>
        Coordinates: {{ coordinates() }}
      </div>
    </div>
  `,
    styles: [`
    .demo-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .event-log {
      padding: 2rem;
      background: var(--ng-doc-code-background);
      border-radius: 4px;
      text-align: center;
    }
    button {
      padding: 0.75rem 1.5rem;
      background: var(--ng-doc-primary);
      color: white;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 0.95rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    button:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
      filter: brightness(1.1);
    }
    button:active {
      transform: translateY(0);
      box-shadow: 0 1px 2px rgba(0,0,0,0.1);
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventSignalDemoComponent {
    btn = viewChild.required<ElementRef<HTMLButtonElement>>('btn');
    area = viewChild.required<ElementRef<HTMLElement>>('area');
    private elementRef = inject(ElementRef);

    clickSignal = eventSignal(this.elementRef.nativeElement, 'click');

    // Derived state
    clickCount = () => {
        const event = this.clickSignal();
        return event ? 'Clicked!' : 'No clicks yet';
    };

    // For mouse move, let's use the host element too.
    moveSignal = eventSignal(this.elementRef.nativeElement, 'mousemove');

    coordinates = () => {
        const e = this.moveSignal() as MouseEvent | null;
        return e ? `${e.offsetX}, ${e.offsetY}` : '0, 0';
    };
}
