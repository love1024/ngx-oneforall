The `OnlyInBrowser` decorator is a specialized Angular utility designed to ensure that certain methods are executed exclusively in the browser environment, and not during server-side rendering (SSR). This is particularly important for Angular Universal applications, where code may run on both the server and the client. By restricting method execution to the browser context, you can prevent errors and unintended side effects that may occur when accessing browser-specific APIs on the server.

## Why Restrict Execution to the Browser?

Angular Universal enables SSR for improved SEO and faster initial page loads. However, some operations—such as DOM manipulation, accessing `window` or `document`, or using browser-only APIs—should only run in the browser. Executing such code on the server can lead to runtime errors or inconsistent application behavior.

## How the `OnlyInBrowser` Decorator Works

The `OnlyInBrowser` decorator is implemented as a method decorator. It leverages Angular's `isPlatformBrowser` utility to detect the current execution context. When applied to a method, it checks if the code is running in the browser before allowing the method to execute. If the context is not the browser (i.e., during SSR), the method is skipped.

### Key Benefits

- **SSR Safety**: Prevents browser-specific code from running on the server.
- **Cleaner Code**: Eliminates manual platform checks within methods.
- **Improved Reliability**: Reduces the risk of SSR-related errors.

## Usage of the `OnlyInBrowser` Decorator

To use the `OnlyInBrowser` decorator, import it from your utility library and apply it to any method that should only run in the browser. No parameters are required.

### Example: Conditionally Running a Method in the Browser

```typescript
import { Component } from '@angular/core';
import { OnlyInBrowser } from 'ngx-oneforall-lib';

@Component({
  selector: 'app-browser-only',
  ...
})
export class BrowserOnlyComponent {
  constructor() {
    this.doBrowserTask();
  }

  @OnlyInBrowser()
  doBrowserTask() {
    // This code will only run in the browser, not during SSR
    console.log('Running browser-specific logic');
    alert('This alert will only show in the browser!');
  }
}
```

#### Explanation

- The `@OnlyInBrowser()` decorator wraps the `doBrowserTask` method.
- When the method is called, it checks the platform context.
- If running in the browser, the method executes as normal.
- If running on the server, the method is skipped and no browser-specific code is executed.

## Use Cases

You can apply `OnlyInBrowser` to any method that interacts with browser APIs, such as:

- Accessing `window` or `document`
- Manipulating the DOM
- Using browser storage (localStorage, sessionStorage)
- Integrating with browser-only libraries


## Live Demonstration

To see the `OnlyInBrowser` decorator in action, check out the live demonstration below:

{{ NgDocActions.demo("OnlyInBrowserDemoComponent") }}

## Conclusion

The `OnlyInBrowser` decorator is an essential tool for Angular developers building Universal applications. By ensuring that browser-specific methods are only executed in the appropriate context, you can safeguard your application against SSR-related issues and maintain clean, maintainable code. Use `OnlyInBrowser` whenever you need to interact with browser APIs or perform operations that should not run on the server.

