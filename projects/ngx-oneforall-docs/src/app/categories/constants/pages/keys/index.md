The `ngx-oneforall/constants` package provides sets of constants for keyboard keys and their corresponding numeric codes. These are useful for handling keyboard events in a type-safe and readable way.

## Usage

You can use these constants when listening to keyboard events to avoid hardcoding strings or magic numbers.

```typescript
import { Key, KeyCode } from 'ngx-oneforall/constants';

// Using Key strings
if (event.key === Key.Enter) {
  // Handle enter key
}

// Using KeyCodes
if (event.keyCode === KeyCode.Enter) {
  // Handle enter key code
}
```

## Key Strings

The `Key` constant contains standard string values for keys, typically matching `event.key`.

| Name | Value |
| :--- | :--- |
| **Backspace** | `'Backspace'` |
| **Tab** | `'Tab'` |
| **Enter** | `'Enter'` |
| **Shift** | `'Shift'` |
| **Control** | `'Control'` |
| **Alt** | `'Alt'` |
| **Pause** | `'Pause'` |
| **CapsLock** | `'CapsLock'` |
| **Escape** | `'Escape'` |
| **Space** | `' '` |
| **PageUp** | `'PageUp'` |
| **PageDown** | `'PageDown'` |
| **End** | `'End'` |
| **Home** | `'Home'` |
| **ArrowLeft** | `'ArrowLeft'` |
| **ArrowUp** | `'ArrowUp'` |
| **ArrowRight** | `'ArrowRight'` |
| **ArrowDown** | `'ArrowDown'` |
| **Insert** | `'Insert'` |
| **Delete** | `'Delete'` |

### Numbers & Letters

Includes digits `0-9` (value matches digit) and letters `a-z` (lowercase).

### Function Keys

Includes `F1` through `F12`.

---

## Key Codes

The `KeyCode` constant contains the numeric values for keys, typically matching `event.keyCode`.

| Name | Code |
| :--- | :--- |
| **Backspace** | `8` |
| **Tab** | `9` |
| **Enter** | `13` |
| **Shift** | `16` |
| **Control** | `17` |
| **Alt** | `18` |
| **Pause** | `19` |
| **CapsLock** | `20` |
| **Escape** | `27` |
| **Space** | `32` |
| **PageUp** | `33` |
| **PageDown** | `34` |
| **End** | `35` |
| **Home** | `36` |
| **ArrowLeft** | `37` |
| **ArrowUp** | `38` |
| **ArrowRight** | `39` |
| **ArrowDown** | `40` |
| **Insert** | `45` |
| **Delete** | `46` |

### Numbers & Letters

- **Digits (0-9)**: Codes `48` to `57`.
- **Letters (A-Z)**: Codes `65` to `90`.

### Function Keys

- **F1-F12**: Codes `112` to `123`.
