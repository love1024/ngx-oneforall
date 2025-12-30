
Install the library via npm or yarn:

```bash
npm install ngx-oneforall
```

Or

```bash
yarn add ngx-oneforall
```

# Usage

**ngx-oneforall** is fully modular. You can import individual pipes, directives, or services directly into your standalone components.

### Example

```typescript
import { Component } from '@angular/core';
import { MemoizePipe, SomeService } from 'ngx-oneforall';

@Component({
  selector: 'app-component',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [MemoizePipe],
  providers: [SomeService]
})
export class AppComponent {
}
```

Since the library is tree-shakable, only the features you actually import will be included in your final bundle.

# Troubleshooting

If you run into issues:
1. Check that your Angular version is compatible.
2. Try clearing your `node_modules` and reinstalling.
3. Check for any peer dependency warnings during installation.


