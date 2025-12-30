Converts a `File` object to a base64-encoded data URL string asynchronously.

## Usage

```typescript
import { fileToBase64 } from '@ngx-oneforall/utils/base64';
```

### Basic Example

```typescript
async onFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  
  if (file) {
    const dataUrl = await fileToBase64(file);
    // dataUrl: "data:image/png;base64,iVBORw0KGgo..."
  }
}
```

### Angular Template

```html
<input type="file" (change)="onFileChange($event)">
<img [src]="imagePreview" *ngIf="imagePreview">
```

## API

`fileToBase64(file: File): Promise<string>`

| Parameter | Type | Description |
|-----------|------|-------------|
| `file` | `File` | The file object from an input element |
| **Returns** | `Promise<string>` | Data URL (e.g., `data:image/png;base64,...`) |

## Use Cases

- **Image Previews**: Display uploaded images before submission
- **File Uploads**: Convert files to base64 for API transmission
- **Avatar Editors**: Create inline image previews
- **Form Data**: Store file content in JSON payloads

## Live Demo

{{ NgDocActions.demo("FileToBase64DemoComponent") }}