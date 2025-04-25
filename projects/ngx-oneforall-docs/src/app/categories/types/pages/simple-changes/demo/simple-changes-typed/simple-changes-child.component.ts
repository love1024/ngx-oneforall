import { Component, input, OnChanges } from '@angular/core';
import { SimpleChangesTyped } from '@ngx-oneforall/types';

@Component({
  selector: 'lib-simple-changes-child',
  imports: [],
  template: ` <p>simple-changes-child works!</p> `,
  styles: ``,
})
export class SimpleChangesChildComponent implements OnChanges {
  count = input.required<number>();

  ngOnChanges(changes: SimpleChangesTyped<SimpleChangesChildComponent>): void {
    if (
      changes.count &&
      changes.count.previousValue !== changes.count.currentValue
    ) {
      console.log('Count changed:', changes.count);
    }
  }
}
