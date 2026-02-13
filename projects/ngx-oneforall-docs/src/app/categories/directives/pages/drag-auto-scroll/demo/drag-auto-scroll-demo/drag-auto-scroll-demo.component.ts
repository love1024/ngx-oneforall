import { Component, signal } from '@angular/core';
import { DragAutoScrollDirective } from 'ngx-oneforall/directives/drag-auto-scroll';

@Component({
  selector: 'lib-drag-auto-scroll-demo',
  imports: [DragAutoScrollDirective],
  template: `
    <div dragAutoScroll class="list">
      @for (item of items(); track item; let i = $index) {
        <div
          class="item"
          draggable="true"
          [class.dragging]="dragIndex() === i"
          [class.drag-over]="dropIndex() === i && dragIndex() !== i"
          (dragstart)="onDragStart(i)"
          (dragover)="onDragOver($event, i)"
          (dragend)="onDragEnd()"
          (drop)="onDrop($event, i)">
          <span class="handle">⠿</span>
          {{ item }}
        </div>
      }
    </div>
  `,
  styleUrl: './drag-auto-scroll-demo.component.scss',
})
export class DragAutoScrollDemoComponent {
  items = signal(Array.from({ length: 30 }, (_, i) => `Item ${i + 1}`));
  dragIndex = signal<number | null>(null);
  dropIndex = signal<number | null>(null);

  onDragStart(index: number) {
    this.dragIndex.set(index);
  }

  onDragOver(event: DragEvent, index: number) {
    event.preventDefault();
    this.dropIndex.set(index);
  }

  onDrop(event: DragEvent, targetIndex: number) {
    event.preventDefault();
    const from = this.dragIndex();
    if (from === null || from === targetIndex) return;

    const updated = [...this.items()];
    const [moved] = updated.splice(from, 1);
    updated.splice(targetIndex, 0, moved);
    this.items.set(updated);

    this.dragIndex.set(null);
    this.dropIndex.set(null);
  }

  onDragEnd() {
    this.dragIndex.set(null);
    this.dropIndex.set(null);
  }
}
