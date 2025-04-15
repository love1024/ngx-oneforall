The `Throttle` decorator is a custom Angular method decorator designed to limit the frequency of method execution within a specified delay period. This is particularly beneficial for optimizing performance in scenarios such as handling frequent events like `click` or `scroll`, where excessive method calls can lead to performance bottlenecks.

## Overview

By applying the `Throttle` decorator to a method, you can ensure that it is invoked at most once during the defined delay interval. This helps in reducing redundant executions and improves the efficiency of your application.

## Example: Throttling a Click Event Handler

The following example demonstrates how to use the `Throttle` decorator to throttle a button click handler:

```typescript
import { throttle } from 'ngx-oneforall-lib';

class Example {
  @throttle(500)
  handleClick() {
    console.log('Button clicked');
  }
}

const example = new Example();
example.handleClick(); // Executes immediately
example.handleClick(); // Ignored if called within 500ms
```

In this example, the `handleClick` method is throttled to execute at most once every 500 milliseconds. Any additional calls within this interval are ignored.

## Live Demonstration

Explore a live demonstration of the `Throttle` decorator in action:

{{ NgDocActions.demo("ThrottleDemoComponent") }}
