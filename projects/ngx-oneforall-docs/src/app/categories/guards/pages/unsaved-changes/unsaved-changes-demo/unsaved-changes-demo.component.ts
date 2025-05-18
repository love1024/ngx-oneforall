import { Component, OnDestroy } from '@angular/core';
import { HasUnsavedChanges, unsavedChangesGuard } from '@ngx-oneforall/guards';

@Component({
  selector: 'lib-unsaved-changes-demo',
  imports: [],
  template: ` <p>unsaved-changes-demo works!</p> `,
  styles: ``,
})
export class UnsavedChangesDemoComponent
  implements HasUnsavedChanges, OnDestroy
{
  guard = unsavedChangesGuard();

  ngOnDestroy() {
    this.guard(this);
  }

  hasUnsavedChanges() {
    return false;
  }
}
