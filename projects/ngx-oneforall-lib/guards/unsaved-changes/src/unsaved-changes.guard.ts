import { DOCUMENT } from '@angular/common';
import { inject } from '@angular/core';
import { lastValueFrom, Observable } from 'rxjs';

export interface HasUnsavedChanges {
  hasUnsavedChanges: () => boolean | Observable<boolean> | Promise<boolean>;
}

export const unsavedChangesGuard = (
  message = 'You have unsaved changes. Do you want to leave this page?'
) => {
  const window = inject(DOCUMENT).defaultView;

  return (component: HasUnsavedChanges) => {
    if (!window || !window.confirm) {
      return true;
    }
    const result = component.hasUnsavedChanges();
    if (typeof result === 'boolean') {
      return result ? window.confirm(message) : true;
    }

    let hasChangesPromise = Promise.resolve(false);
    if (result instanceof Observable) {
      hasChangesPromise = lastValueFrom(result);
    } else if (result instanceof Promise) {
      hasChangesPromise = result;
    }
    return hasChangesPromise.then(hasChanges => {
      if (hasChanges) {
        return window.confirm(message);
      }
      return true;
    });
  };
};
