![Project Image](https://github.com/love1024/ngx-oneforall/blob/main/projects/ngx-oneforall-docs/public/brand.png)

<p align="center">
  <a href="https://www.npmjs.com/package/ngx-oneforall">
    <img src="https://img.shields.io/npm/v/ngx-oneforall?style=flat-square&color=cb0303" alt="npm version" />
  </a>
  <a href="https://github.com/love1024/ngx-oneforall/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square" alt="license" />
  </a>
  <a href="https://github.com/love1024/ngx-oneforall">
    <img src="https://img.shields.io/badge/coverage-100%25-success?style=flat-square" alt="coverage" />
  </a>
  <a href="https://bundlephobia.com/package/ngx-oneforall">
    <img src="https://img.shields.io/badge/max_utility_size-3kb-success?style=flat-square" alt="size" />
  </a>
</p>

**ngx-oneforall** is a collection of 85+ high-quality Angular utilities designed to solve common development challenges. Instead of reinventing the wheel or managing dozens of small dependencies, you get a unified toolkit that just works.

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

## Available Utilities

| Category | Utilities |
|----------|-----------|
| **Constants** | `breakpoints`, `device`, `file-extension`, `host-platforms`, `http`, `key`, `regex`, `sort-direction`, `time`, `types` |
| **Decorators** | `cache`, `catch-error`, `debounce`, `log-execution-time`, `memoize`, `only-in-browser`, `throttle` |
| **Directives** | `auto-focus`, `click-outside`, `click-throttle`, `hover-class`, `infinite-scroll`, `numbers-only`, `press-enter`, `repeat`, `resized`, `shortcut`, `typed-template`, `visibility-change` |
| **Guards** | `param`, `query-param`, `unsaved-changes` |
| **Interceptors** | `base-url`, `cache`, `correlation-id`, `encryption`, `jwt`, `performance`, `timeout` |
| **Pipes** | `bytes`, `call`, `first-error-key`, `highlight-search`, `initials`, `pluralize`, `range`, `safe-html`, `time-ago`, `truncate` |
| **Rxjs** | `backoff-retry`, `catch-error-with-fallback`, `data-polling`, `debug`, `live-search`, `loading-status` |
| **Services** | `cache`, `clipboard`, `cookie`, `device`, `event`, `history`, `idle`, `jwt`, `logger`, `network-status`, `shortcut`, `storage` |
| **Signals** | `breakpoint-matcher`, `debounced-signal`, `deep-computed`, `event-signal`, `interval-signal`, `route-param-signal`, `route-query-param-signal`, `router-event-signal`, `state-signal`, `storage-signal`, `throttled-signal`, `websocket-signal` |
| **Utils** | `base64`, `download-link`, `find-type`, `hash`, `host-platform`, `is-key-defined`, `is-number`, `is-present`, `is-record`, `normalize-key`, `safe-await`, `safe-serialize`, `unique-component-id` |
| **Validators** | `credit-card`, `date`, `match-field`, `max-date`, `min-date`, `min-length-trimmed`, `not-blank`, `number`, `phone`, `range`, `range-length`, `url` |


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
