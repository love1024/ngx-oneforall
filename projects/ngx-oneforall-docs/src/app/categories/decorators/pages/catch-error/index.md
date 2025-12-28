The `CatchError` decorator is a versatile utility for handling errors in class methods. It wraps a method call in a try-catch block and provides a fallback mechanism. It supports synchronous methods, asynchronous methods (Promises), and **Observables**.

## Usage

Apply the decorator to a method. You can provide a static fallback value or a **dynamic fallback function** that receives the error.

```typescript
import { CatchError } from '@ngx-oneforall/decorators/catch-error';
import { of } from 'rxjs';

class MyService {
  // Static fallback
  @CatchError('Fallback value')
  getData() {
    throw new Error('Sync fail');
  }

  // Dynamic fallback function
  @CatchError((err: Error) => `Error occurred: ${err.message}`)
  async fetchAsync() {
    throw new Error('Async fail');
  }

  // Observable support
  @CatchError('Observable fallback')
  getObservable() {
    return throwError(() => new Error('Observable fail'));
  }
  
  // Dynamic Observable fallback
  @CatchError((err: Error) => of(`Handled: ${err.message}`))
  getDynamicObservable() {
    return throwError(() => new Error('Observable fail'));
  }
}
```

## API

### Arguments

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `fallback` | `any \| ((error: any) => any)` | `undefined` | The value or function to return if an error is caught. |
| `logError` | `boolean` | `true` | Whether to log the error to the console. |

### Observable Handling

If the method returns an **Observable**, the decorator automatically applies `catchError`. 
- If the fallback is a value, it returns `of(fallback)`. 
- If the fallback is a function returning an Observable, it returns that Observable.
- If the fallback is `undefined`, it re-throws the original error.

---

{{ NgDocActions.demo("CatchErrorDemoComponent") }}

## Examples

### Dynamic Fallback for API Errors

```typescript
@CatchError(error => ({ error: true, message: error.message }))
async performAction() {
  return await this.api.post(...);
}
```

### Silent Error Catching

```typescript
@CatchError(null, false)
riskyLog() {
  return this.service.mightThrow();
}
```
