![Bundle Size](https://deno.bundlejs.com/badge?q=ngx-oneforall/utils/download-link&treeshake=[*]&config={"esbuild":{"external":["rxjs","@angular/core","@angular/common","@angular/forms","@angular/router"]}})

`downloadLink` is a utility function that programmatically triggers a file download by creating a temporary anchor element.

## Usage

Use `downloadLink` when you have a file URL (or Blob URL) and want to initiate a download action, for example from a button click or after an API response.

{{ NgDocActions.demo("DownloadLinkDemoComponent", { container: true }) }}

### Example

```typescript
import { downloadLink } from 'ngx-oneforall/utils/download-link';

// Download a remote file
downloadLink('https://example.com/report.pdf', 'report.pdf');

// Download a generated blob
const blob = new Blob(['content'], { type: 'text/plain' });
const url = URL.createObjectURL(blob);
downloadLink(url, 'note.txt');
```

## API

`downloadLink(url: string, fileName: string = 'download'): void`

- **url**: The URL of the file to download. Can be a remote URL or a blob URL.
- **fileName**: The name to suggest for the downloaded file. Defaults to `'download'`.

> **Note**
> For cross-origin URLs, the `download` attribute might be ignored by browsers for security reasons, resulting in navigation instead of download unless the server sends appropriate `Content-Disposition` headers.
