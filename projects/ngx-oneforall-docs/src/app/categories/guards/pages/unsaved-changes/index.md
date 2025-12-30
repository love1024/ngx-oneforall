

Unsaved changes guards are essential for protecting users from accidentally losing their work when navigating away from a page with unsaved modifications. This guard leverages the native `window.confirm` dialog to prompt the user for confirmation.

#### How to Use

1. **Import the Guard**
    Import `unsavedChangesGuard` and the `HasUnsavedChanges` interface:
    ```typescript
    import { HasUnsavedChanges, unsavedChangesGuard } from 'ngx-oneforall/guards/unsaved-changes';
    ```

2. **Register the Guard**
    Add the guard to your route configuration using `canDeactivate`:
    ```typescript {4}
    {
      path: 'form',
      canDeactivate: [
         unsavedChangesGuard()
      ]
    }
    ```

3. **Implement the Interface**
    Implement `HasUnsavedChanges` in your component:
    ```typescript
    export class UnsavedChangesDemoComponent implements HasUnsavedChanges {
      // ...
      hasUnsavedChanges() {
         return this.form.dirty;
      }
    }
    ```

4. **Async Checks (Optional)**
    The `hasUnsavedChanges` method can return a `boolean`, `Promise<boolean>`, or `Observable<boolean>`.
    
    ```typescript
    hasUnsavedChanges(): Observable<boolean> {
       return this.apiClient.checkDraftStatus().pipe(
         map(status => status.hasChanges)
       );
    }
    ```

#### Use Cases
- Preventing navigation away from a form with unsaved data.
- Alerting users before closing a tab or browser window if changes haven't been saved.
- Guarding against accidental loss of progress in multi-step wizards or editors.

#### Live Demo

> **Note**
> This demo manually triggers the guard check to show the confirmation dialog. In a real routing scenario, this would happen automatically before navigation.

{{ NgDocActions.demo("UnsavedChangesDemoComponent") }}


#### Customizing the Confirmation Message
You can customize the message displayed in the confirmation dialog by passing a string to the factory function.

```typescript {4}
  {
    path: 'form',
    canDeactivate: [
      unsavedChangesGuard('You have unsaved work! Are you sure you want to leave?')
    ]
  }
```


