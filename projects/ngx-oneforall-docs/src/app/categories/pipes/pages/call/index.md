The `CallPipe` allows you to call a function directly from the template. This is useful for invoking functions without triggering change detection on every cycle, as the pipe is pure.

### Usage

Apply the pipe in Angular templates:

```html file="./snippets.html"#L1-L2
```

- **fn**: The function to call.
- **args**: Arguments to pass to the function.

### Parameters

- `fn: Function`
    The function to be executed.
- `...args: any[]`
    Arguments to pass to the function.

### Examples

#### Basic Usage

```html file="./snippets.html"#L1-L2
```

### Preserving Context

When using methods that rely on `this`, you must ensure the context is preserved.

#### Option 1: Arrow Functions

Arrow functions automatically capture the `this` context of the component.

```html file="./snippets.html"#L5-L6
```

#### Option 2: Binding Context

If you use a regular class method, `this` will be lost. You must explicitly bind it, for example in the constructor or by assigning a bound version to a property.

```typescript
// In Component
getCounterBound = this.getCounter.bind(this);
```

```html file="./snippets.html"#L9-L10
```

### Behavior

- **Pure**: The function is only called when the function reference or arguments change.
- **Context**: Does not automatically bind `this`. Users must handle context binding.
- **Safety**: Returns the input if it is not a function.
- The pipe is marked as `pure` and `standalone`.

---

#### Live Demo

Explore this example in a live demonstration:

{{ NgDocActions.demo("CallPipeDemoComponent") }}
