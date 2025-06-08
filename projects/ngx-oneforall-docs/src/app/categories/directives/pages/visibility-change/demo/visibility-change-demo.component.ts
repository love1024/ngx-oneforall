import { Component, signal } from '@angular/core';
import {
  VisibilityChange,
  VisibilityChangeDirective,
} from '@ngx-oneforall/directives';

@Component({
  selector: 'lib-visibility-change-demo',
  imports: [VisibilityChangeDirective],
  template: `
    <div class="parent">
      <div>
        @if (show()) {
          <div (visibilityChange)="visibilityChange($event)" class="box">
            Scroll Down To Hide
          </div>
        }
        <button (click)="showHide()">{{ show() ? 'Remove' : 'Add' }}</button>
      </div>
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

  showHide() {
    this.show.update(v => !v);
  }

  visibilityChange(e: VisibilityChange) {
    this.evt.set(e);
  }
}
