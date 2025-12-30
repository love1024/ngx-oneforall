
import { inject, DOCUMENT } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { isObservable, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

export interface HasUnsavedChanges {
  hasUnsavedChanges: () => boolean | Observable<boolean> | Promise<boolean>;
}

/**
 * A guard that checks if a component has unsaved changes before deactivation.
 * It prompts the user for confirmation using `window.confirm` if changes exist.
 *
 * @param message - The message to display in the confirmation dialog. Default is 'You have unsaved changes. Do you want to leave this page?'.
 * @returns A `CanDeactivateFn` that returns `true` if navigation should proceed, `false` otherwise.
 *
 * @example
 * // In your routes:
 * {
 *   path: 'edit',
 *   component: EditComponent,
 *   canDeactivate: [unsavedChangesGuard('Discard changes?')]
 * }
 */
export const unsavedChangesGuard = (
  message = 'You have unsaved changes. Do you want to leave this page?'
): CanDeactivateFn<HasUnsavedChanges> => {
  return (component: HasUnsavedChanges) => {
    const window = inject(DOCUMENT).defaultView;

    // If SSR or no window, allow navigation
    if (!window || !window.confirm) {
      return true;
    }

    if (!component?.hasUnsavedChanges) {
      return true;
    }

    const result = component.hasUnsavedChanges();

    if (isObservable(result)) {
      return result.pipe(
        take(1),
        map(hasChanges => (hasChanges ? window.confirm(message) : true))
      );
    }

    if (result instanceof Promise) {
      return result.then(hasChanges =>
        hasChanges ? window.confirm(message) : true
      );
    }

    return result ? window.confirm(message) : true;
  };
};
