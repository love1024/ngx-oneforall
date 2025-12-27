import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  VisibilityChange,
  VisibilityChangeDirective,
} from '@ngx-oneforall/directives/visibility-change';

@Component({
  selector: 'lib-visibility-change-demo',
  imports: [VisibilityChangeDirective, FormsModule],
  template: `
    <div class="parent">
      <div>
        @if (show()) {
          <div
            (visibilityChange)="visibilityChange($event)"
            [threshold]="threshold()"
            class="box">
            Scroll Down To Hide
          </div>
        }
        <button (click)="showHide()">{{ show() ? 'Remove' : 'Add' }}</button>
      </div>
    </div>
    <div class="threshold-slider">
      <label>
        Threshold:
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          [(ngModel)]="threshold" />
        {{ threshold() }}
      </label>
    </div>
    @if (evt(); as e) {
      <div class="logs">
        <div><span>Visibility:</span> {{ e.isVisible }}</div>
        <div>
          <span>Removed From DOM:</span> {{ e.target ? 'false' : 'true' }}
        </div>
      </div>
    }
  `,
  styleUrl: './visibility-change-demo.component.scss',
})
export class VisibilityChangeDemoComponent {
  show = signal(true);
  evt = signal<VisibilityChange | null>(null);
  // Threshold to control visiblity
  threshold = signal(1.0);

  showHide() {
    this.show.update(v => !v);
  }

  visibilityChange(e: VisibilityChange) {
    this.evt.set(e);
  }
}
