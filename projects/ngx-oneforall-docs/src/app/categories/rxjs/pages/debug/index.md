`debug` is a utility operator that provides styled logging for RxJS streams. It wraps the `tap` operator to log `next`, `error`, and `complete` events with a custom tag and distinct CSS styles, making it easier to debug complex observable chains in the browser console.

## Usage

{{ NgDocActions.demo("DebugDemoComponent", { container: true }) }}

### Basic Example

```typescript
import { of } from 'rxjs';
import { debug } from 'ngx-oneforall/rxjs/debug';

const source$ = of(1, 2, 3).pipe(
    debug('NumbersStream')
);

source$.subscribe();
// Console output:
// [NumbersStream: Next] 1
// [NumbersStream: Next] 2
// [NumbersStream: Next] 3
// [NumbersStream]: Complete
```

## API

`debug<T>(tag: string, when?: (value?: T) => boolean): MonoTypeOperatorFunction<T>`

### Parameters

- **tag**: A string label that identifies the stream in the console output.
- **when**: (Optional) A function that returns a boolean. Logging only occurs if this function returns `true`. It receives the emitted value as an argument (for `next` events).

### Examples

#### Conditional Logging

```typescript
import { of } from 'rxjs';
import { debug } from 'ngx-oneforall/rxjs/debug';

const isDev = true;
const source$ = of('data').pipe(
    debug('MyStream', () => isDev)
);
```

#### Filtering Logs by Value

```typescript
const source$ = of(1, 10, 100).pipe(
    debug('BigNumbers', (val) => val >= 10)
);
// Only 10 and 100 will be logged.
```

### Console Styles

The operator uses different console methods and colors to help you distinguish between event types:


- **Next**: `console.log` - Cyan background with white text.
- **Error**: `console.error` - Pinkish-red background with white text.
- **Complete**: `console.info` - Teal background with white text.

### Benefits

- **Visibility**: Easily spot your stream logs among other console output.
- **No Boilerplate**: Replaces multiple `tap(val => console.log(val))` calls with a single operator.
- **State Tracking**: Automatically handles error and completion logging without extra code.
