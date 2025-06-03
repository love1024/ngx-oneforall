import { Component, OnDestroy } from '@angular/core';
import { HasUnsavedChanges, unsavedChangesGuard } from '@ngx-oneforall/guards';

@Component({
  selector: 'lib-unsaved-changes-demo',
  imports: [],
  template: `
    <h2>Unsaved Guard Demo</h2>
    <p>Try to navigate away to run this guard.</p>
  `,
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
    return true;
  }
}
