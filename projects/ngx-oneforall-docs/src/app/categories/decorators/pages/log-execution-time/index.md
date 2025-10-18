The `LogExecutionTime` decorator is a powerful Angular utility designed to measure and log the execution time of methods. It provides valuable insights into the performance of both synchronous and asynchronous operations, helping developers identify bottlenecks and optimize their applications.

## Purpose and Benefits

Performance monitoring is crucial for modern web applications. By automatically logging how long methods take to execute, `LogExecutionTime` enables:

- **Transparent Performance Tracking**: Easily monitor method execution times without manual instrumentation.
- **Support for Async Operations**: Handles both synchronous and asynchronous methods seamlessly.
- **Customizable Labels**: Optionally specify a label for each log entry to improve traceability.
- **Non-Intrusive Integration**: No need to modify method logic—just apply the decorator.


## Usage

To use the `LogExecutionTime` decorator, import it and apply it to any method whose execution time you want to monitor. You can optionally provide a label for the log output.

### Example: Logging Execution Time of Methods

```typescript
import { Component } from '@angular/core';
import { LogExecutionTime } from 'ngx-oneforall-lib';

@Component({
  selector: 'app-performance-demo',
  ...
})
export class PerformanceDemoComponent {
  @LogExecutionTime('syncTask')
  syncTask() {
    // Synchronous code
    for (let i = 0; i < 1e6; i++) {}
  }

  @LogExecutionTime('asyncTask')
  async asyncTask() {
    // Asynchronous code
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}
```

#### Explanation

- The `@LogExecutionTime('syncTask')` decorator logs the execution time of the `syncTask` method with the label "syncTask".
- The `@LogExecutionTime('asyncTask')` decorator does the same for the asynchronous `asyncTask` method.
- If no label is provided, the method name is used as the default label.

## Use Cases

Apply `LogExecutionTime` to:

- Performance-critical business logic
- Data processing functions
- API call handlers
- Any method where execution time matters

## Live Demonstration

See the `LogExecutionTime` decorator in action:

{{ NgDocActions.demo("LogExecutionTimeDemoComponent") }}

## Conclusion

The `LogExecutionTime` decorator is an essential tool for Angular developers seeking to monitor and optimize application performance. By providing automatic, customizable logging for both synchronous and asynchronous methods, it streamlines performance analysis and helps maintain high-quality, responsive applications.
