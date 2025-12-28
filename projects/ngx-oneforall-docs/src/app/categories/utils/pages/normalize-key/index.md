---
keyword: NormalizeKeyPage
---

The `normalizeKey` utility standardizes keyboard key values across different browsers and platforms. It handles common inconsistencies and maps user-friendly aliases to standard `KeyboardEvent.key` values.

## Usage

Import `normalizeKey` from `ngx-oneforall`:

```typescript
import {normalizeKey} from '@ngx-oneforall/utils/normalize-key';

// Basic usage
const key = normalizeKey('Esc'); // Returns 'escape'
const space = normalizeKey('Space'); // Returns ' '

// Platform-specific normalization
// On Windows/Linux/Android, 'meta' becomes 'control'
const meta = normalizeKey('meta'); 
```

## Transformations

The utility performs the following transformations:

| Input | Output | Description |
|-------|--------|-------------|
| `space` | `' '` | Maps the string 'space' to a literal space character |
| `esc` | `escape` | Standardizes escape key |
| `up` | `arrowup` | Standardizes arrow keys |
| `down` | `arrowdown` | |
| `left` | `arrowleft` | |
| `right` | `arrowright` | |
| `altleft` | `alt` | Standardizes alt key |
| `meta` | `control` | **On non-Apple platforms only** |

## Case Insensitivity

The function is case-insensitive. Inputs like `ESC`, `Esc`, and `esc` will all return `escape`.

## Demo

Type in the input below to see how keys are normalized:

{{ NgDocActions.demo("NormalizeKeyDemoComponent", {container: true}) }}
