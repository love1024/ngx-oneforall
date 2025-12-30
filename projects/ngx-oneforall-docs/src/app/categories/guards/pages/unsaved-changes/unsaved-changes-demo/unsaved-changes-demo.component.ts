import {
  Component,
  EnvironmentInjector,
  inject,
  OnDestroy,
  runInInjectionContext,
} from '@angular/core';
import {
  HasUnsavedChanges,
  unsavedChangesGuard,
} from '@ngx-oneforall/guards/unsaved-changes';

@Component({
  selector: 'lib-unsaved-changes-demo',
  imports: [],
  template: `
    <h2>Unsaved Guard Demo</h2>
    <p>Try to navigate away to run this guard.</p>
  `,
})
export class UnsavedChangesDemoComponent
  implements HasUnsavedChanges, OnDestroy
{
  environmentInjector = inject(EnvironmentInjector);
  guard = unsavedChangesGuard();

  ngOnDestroy() {
    // This is just for demo purposes
    runInInjectionContext(this.environmentInjector, () => {
      this.guard(this, {} as any, {} as any, {} as any);
    });
  }

  hasUnsavedChanges() {
    return true;
  }
}
