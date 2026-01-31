


**ngx-oneforall** is a collection of 100+ high-quality Angular utilities designed to solve common development challenges. Instead of reinventing the wheel or managing dozens of small dependencies, you get a unified toolkit that just works.

![Project Image](/ngx-oneforall/assets/brand.png)

> **One For All** - A single library providing the essential blocks for modern Angular development.


# Key Features

### Performance & Efficiency
Every utility is written from scratch and optimized specifically for Angular. We prioritize memory efficiency and runtime performance rather than just wrapping existing heavy libraries. Maximum size of a utility is 3kb gzipped.

### Modular & Tree-shakable
Import only what you use. The library is fully tree-shakable, so adding one utility doesn't bloat your bundle with the rest of the library.

### Zero Dependencies
We keep the dependency tree clean. **ngx-oneforall** has **NO third-party dependencies** (except `libphonenumber-js` for the phone validator). This reduces security risks, simplifies updates, and prevents version conflicts.

### First-Class SSR Support
Built for modern hydration. Every component and utility is designed to work seamlessly in Server-Side Rendering (SSR) environments out of the box.

### 100% Test Coverage
We take reliability seriously. The entire library is fully covered by tests to ensure edge cases are handled and behavior remains consistent across updates.

### Built for Modern Angular
Designed with **Signals** and **Standalone Components** in mind. This isn't a legacy port—it's built for the current and future state of Angular.

---

# Why Use It?

### Stop Re-writing Utilities
Avoid copy-pasting the same regex patterns, validators, and helper functions between projects. Use a standardized, tested set of utilities instead.

### Focus on Business Logic
Don't waste time maintaining generic boilerplate code. Use these proven primitives to build your actual application features faster.

### Better Developer Experience
Fully typed APIs and consistent behavior make these utilities predictable and easy to work with. You get strict typing and comprehensive documentation right in your IDE.

---

# Available Utilities

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

---

# Issues & Feature Requests

Found a bug or edge case? Have an idea for a new utility? We'd love to hear from you!

- **Report Issues**: If you encounter any bugs or unexpected behavior, please [open an issue](https://github.com/love1024/ngx-oneforall/issues).
- **Feature Requests**: Have a utility in mind that would benefit the community? Submit a feature request via [GitHub Issues](https://github.com/love1024/ngx-oneforall/issues).
