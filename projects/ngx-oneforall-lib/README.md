![Project Image](https://github.com/love1024/ngx-oneforall/blob/main/projects/ngx-oneforall-docs/public/brand.png)

<p align="center">
  <a href="https://www.npmjs.com/package/ngx-oneforall">
    <img src="https://img.shields.io/npm/v/ngx-oneforall?style=flat-square&color=cb0303" alt="npm version" />
  </a>
  <a href="https://github.com/love1024/ngx-oneforall/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square" alt="license" />
  </a>
  <a href="https://github.com/love1024/ngx-oneforall/actions">
    <img src="https://img.shields.io/github/actions/workflow/status/love1024/ngx-oneforall/build.yml?branch=main&style=flat-square" alt="build status" />
  </a>
  <a href="https://github.com/love1024/ngx-oneforall">
    <img src="https://img.shields.io/badge/coverage-100%25-success?style=flat-square" alt="coverage" />
  </a>
  <a href="https://bundlephobia.com/package/ngx-oneforall">
    <img src="https://img.shields.io/badge/minzipped-3kb-success?style=flat-square" alt="size" />
  </a>
  <a href="https://github.com/love1024/ngx-oneforall/stargazers">
    <img src="https://img.shields.io/github/stars/love1024/ngx-oneforall?style=social" alt="GitHub stars" />
  </a>
</p>

**ngx-oneforall** is a collection of 80+ high-quality Angular utilities designed to solve common development challenges. Instead of reinventing the wheel or managing dozens of small dependencies, you get a unified toolkit that just works.

> **One For All** - A single library providing the essential blocks for modern Angular development.


## Documentation

Full API documentation and demos are available at: [https://love1024.github.io/ngx-oneforall/](https://love1024.github.io/ngx-oneforall/)

## Key Features

- **Performance First**: Every utility is written from scratch and optimized specifically for Angular.
- **Tree-Shakable**: Import only what you need. Zero bundle bloat—no utility exceeds 3kb gzipped.
- **Zero Dependencies**: Keeps your dependency tree clean and secure.
- **SSR Ready**: Built for modern hydration and server-side rendering.
- **Modern Angular**: Designed for Signals and Standalone Components.
- **Fully Tested**: Comprehensive test suite with 100% coverage.

## Why Use It?

- **Stop Re-writing Utilities**: Avoid copy-pasting the same services, directives, validators, and helper functions between projects.
- **Focus on Business Logic**: Don't waste time maintaining generic boilerplate code. Use proven primitives.
- **Better Developer Experience**: Fully typed APIs and consistent behavior make coding a joy.

## Requirements

- **Angular**: 17.1+ / 18.x / 19.x / 20.x / 21.x
- **RxJS**: 7.x or 8.x

## Installation

```bash
npm install ngx-oneforall
```

Or

```bash
yarn add ngx-oneforall
```

### Optional Dependencies

For phone validator, install:

```bash
npm install libphonenumber-js
```

## Usage

Simply import what you need. `ngx-oneforall` is fully tree-shakable.

### Example: Using `@Cache` Decorator

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cache } from 'ngx-oneforall/decorators/cache';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  // Cache results for 1 minute in localStorage
  @Cache({ ttl: 60000, storage: 'local' })
  getUser(id: number): Observable<User> {
    return this.http.get<User>(`/api/users/${id}`);
  }
}
```

## Issues & Feature Requests

Found a bug or edge case? Have an idea for a new utility? We'd love to hear from you!

- **Report Issues**: If you encounter any bugs or unexpected behavior, please [open an issue](https://github.com/love1024/ngx-oneforall/issues).
- **Feature Requests**: Have a utility in mind that would benefit the community? Submit a feature request via [GitHub Issues](https://github.com/love1024/ngx-oneforall/issues).

## Contributing

Contributions are welcome!

1. Create a feature branch.
2. Commit your changes.
3. Make sure tests are passing and coverage is 100%.
4. Make sure build is successful and there are no linting errors.
5. Submit a pull request.

## License

MIT License. See [LICENSE](LICENSE) for details.
