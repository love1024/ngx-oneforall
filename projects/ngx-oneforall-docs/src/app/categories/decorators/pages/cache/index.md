The `debounce` decorator is a powerful utility in Angular that helps to limit the rate at which a function is executed. This is particularly useful in scenarios where frequent user interactions, such as typing or scrolling, can trigger a function multiple times in quick succession. By using the `debounce` decorator, you can ensure that the function is executed only after a specified delay, improving performance and user experience.

### How the `debounce` Decorator Works

The `debounce` decorator wraps a method and delays its execution until after a specified amount of time has passed since the last time it was invoked. If the method is called again before the delay period ends, the timer resets. This behavior is ideal for handling events like:

- Search input fields
- Button clicks
- Window resize events

### Usage Example

Below is an example of how to use the `debounce` decorator in an Angular component:

```typescript
import { Component } from '@angular/core';
import { debounce } from 'ngx-oneforall';

@Component({
  selector: 'app-debounce-demo',
  template: `
    <div>
      <h2>Debounce Decorator Example</h2>
      <input
        type="text"
        placeholder="Type something..."
        (input)="onInputChange($event)" />
      <p>Debounced Value: {{ debouncedValue }}</p>
    </div>
  `,
})
export class DebounceDemoComponent {
  debouncedValue: string = '';

  @debounce(300) // 300ms delay
  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.debouncedValue = input.value;
    console.log('Debounced Input:', this.debouncedValue);
  }
}
```

### Key Points in the Example

1. **Decorator Usage**: The `@debounce(300)` decorator is applied to the `onInputChange` method, specifying a delay of 300 milliseconds.
2. **Input Handling**: The `onInputChange` method is triggered by the `input` event on the text field. However, the actual execution of the method is delayed by the debounce timer.
3. **Improved Performance**: Without the debounce decorator, the method would be called on every keystroke, potentially leading to performance issues. The decorator ensures that the method is executed only after the user stops typing for 300 milliseconds.

### Live Demonstration

Explore a live demonstration of the `debounce` decorator in action:

{{ NgDocActions.demo("CacheServiceDemoComponent") }}

### Benefits of Using the `debounce` Decorator

- **Performance Optimization**: Reduces the frequency of method calls, especially for high-frequency events.
- **Cleaner Code**: Eliminates the need to manually implement debounce logic in your methods.
- **Reusability**: The decorator can be reused across multiple components and methods, promoting consistency.

### Conclusion

The `debounce` decorator is a simple yet effective tool for managing high-frequency events in Angular applications. By incorporating it into your codebase, you can enhance both performance and maintainability. Try it out in your projects and experience the difference it makes!
