

Unsaved changes guards are essential for protecting users from accidentally losing their work when navigating away from a page with unsaved modifications. These guards are commonly used in forms, editors, or any interactive components where users can input or modify data.

#### How to Use

1. **Register the Guard in Route Configuration**  
    Add the unsaved changes guard to the `canDeactivate` property of the relevant route:
    ```typescript {4}
    {
      path: '/form',
      canDeactivate: [
         unsavedChangesGuard()
      ]
    }
    ```

2. **Implement the `HasUnsavedChanges` Interface**  
    In the component that should be protected, implement the `HasUnsavedChanges` interface:
    ```typescript
    export class UnsavedChangesDemoComponent implements HasUnsavedChanges {
      ...
      hasUnsavedChanges() {
         return true;
      }
    }
    ```

3. **Customize the `hasUnsavedChanges` Method**  
    Define the logic within `hasUnsavedChanges` to determine if there are unsaved changes. This method can return a boolean, a `Promise`, or an `Observable`:
    > **Note** The guard supports synchronous and asynchronous checks.
    
    ```typescript
    export class UnsavedChangesDemoComponent implements HasUnsavedChanges {
      ...
      hasUnsavedChanges(): Observable<boolean> {
         // Example: resolve after 3 seconds
         return timer(3000).pipe(map(() => true));
      }
    }
    ```

#### Use Cases
- Preventing navigation away from a form with unsaved data.
- Alerting users before closing a tab or browser window if changes haven't been saved.
- Guarding against accidental loss of progress in multi-step wizards or editors.
- Providing a consistent user experience across different routes or modules that involve user input.

#### Live Demo
> **Warning**
> Note that this demo will not block you from moving away.

{{ NgDocActions.demo("UnsavedChangesDemoComponent") }}




#### Customizing the Confirmation Message
The unsaved changes guard allows you to override the default confirmation message. By supplying a custom message, you can tailor the prompt to fit the context of your application or provide more specific guidance to users. This flexibility ensures that users receive clear and relevant information before making a decision to leave the page.


#### Example
```typescript {4}
  {
    path: '/form',
    canDeactivate: [
      unsavedChangesGuard('The form changes will be lost. Are you sure?')
    ]
  }
```


