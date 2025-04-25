import { Component } from '@angular/core';
import { SimpleChangesChildComponent } from './simple-changes-child.component';

@Component({
  selector: 'lib-simple-changes-parent',
  imports: [SimpleChangesChildComponent],
  template: ` <p>simple-changes-parent works!</p> `,
  styles: ``,
})
export class SimpleChangesParentComponent {}
