Install the library via npm or yarn:

```bash
npm install ngx-oneforall
```

Or

```bash
yarn add ngx-oneforall
```

## Optional Dependencies

For phone validator, install:

```bash
npm install libphonenumber-js
```

## Requirements

- **Angular**: 17.1+ / 18.x / 19.x / 20.x / 21.x
- **RxJS**: 7.x or 8.x

# Usage

**ngx-oneforall** is modular by design. Import only what you need from its specific path.

### Example

```typescript
import { Component } from '@angular/core';
import { TruncatePipe } from 'ngx-oneforall/pipes/truncate';
import { ClickOutsideDirective } from 'ngx-oneforall/directives/click-outside';
import { CacheService } from 'ngx-oneforall/services/cache';

@Component({
  selector: 'app-component',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [TruncatePipe, ClickOutsideDirective],
  providers: [CacheService]
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


