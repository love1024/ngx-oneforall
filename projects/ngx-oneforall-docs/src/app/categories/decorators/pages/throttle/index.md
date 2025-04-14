# Throttle Decorator

The `Throttle` decorator is a custom Angular method decorator that ensures a method is only invoked once within a specified delay period. This is particularly useful for event handlers like `click` or `scroll` to prevent excessive calls.

## Usage

The `Throttle` decorator can be applied to any method to throttle its execution. Below is an example demonstrating its usage.

### Example: Throttling a Click Handler

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
