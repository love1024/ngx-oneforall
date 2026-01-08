import { Component, signal } from '@angular/core';
import {
  DraggableDirective,
  DragEvent,
} from 'ngx-oneforall/directives/draggable';

@Component({
  selector: 'lib-draggable-demo',
  imports: [DraggableDirective],
  template: `
    <!-- Example 1: Basic Draggable -->
    <h4>1. Basic Draggable</h4>
    <div class="demo-wrapper">
      <div class="draggable-box" makeDraggable (dragMove)="onDragMove($event)">
        <strong>Drag Me!</strong>
        <span>Position: ({{ position().x }}, {{ position().y }})</span>
      </div>
    </div>
    <p class="info">Click and drag the purple box to move it freely.</p>

    <!-- Example 2: Modal with Drag Handle -->
    <h4>2. Modal with Drag Handle</h4>
    <div class="demo-wrapper">
      <div class="modal-card" #modal>
        <div class="modal-header" makeDraggable [makeDraggableTarget]="modal">
          <span>Drag this header</span>
        </div>
        <div class="modal-body">
          <p>Only the header is draggable, but the entire modal moves.</p>
          <p>This body area cannot initiate drag.</p>
        </div>
      </div>
    </div>
    <p class="info">
      Use <code>[makeDraggableTarget]</code> to move a parent element by
      dragging a child.
    </p>

    <!-- Example 3: Boundary Constrained -->
    <h4>3. Boundary Constrained</h4>
    <div class="demo-wrapper boundary-area">
      <div
        class="constrained-box"
        makeDraggable
        [makeDraggableBoundary]="'parent'">
        <strong>Constrained</strong>
        <span>Can't leave the box!</span>
      </div>
    </div>
    <p class="info">
      Use <code>[makeDraggableBoundary]="'parent'"</code> to keep element inside
      its container.
    </p>
  `,
  styleUrl: './draggable-demo.component.scss',
})
export class DraggableDemoComponent {
  position = signal({ x: 0, y: 0 });

  onDragMove(event: DragEvent) {
    this.position.set({ x: Math.round(event.x), y: Math.round(event.y) });
  }
}
