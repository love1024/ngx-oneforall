The `@ngx-oneforall/constants` package provides a comprehensive set of common file extensions. These constants are useful for file type validation, filtering, and handling file uploads.

## Usage

Import the `FILE_EXTENSION` constant to use in your file handling logic.

```typescript
import { FILE_EXTENSION } from '@ngx-oneforall/constants';

// Example: Checking if a file is an image
const isImage = [
  FILE_EXTENSION.PNG,
  FILE_EXTENSION.JPG,
  FILE_EXTENSION.JPEG,
  FILE_EXTENSION.GIF,
  FILE_EXTENSION.WEBP
].includes(fileExtension.toLowerCase());

// Example: Restricting file upload to documents
const acceptedDocs = `${FILE_EXTENSION.PDF},${FILE_EXTENSION.DOCX},${FILE_EXTENSION.XLSX}`;
```

## FILE_EXTENSION

### Images

| Name | Value |
| :--- | :--- |
| **PNG** | `'png'` |
| **JPG** | `'jpg'` |
| **JPEG** | `'jpeg'` |
| **GIF** | `'gif'` |
| **WEBP** | `'webp'` |
| **SVG** | `'svg'` |

### Documents

| Name | Value |
| :--- | :--- |
| **PDF** | `'pdf'` |
| **DOC** | `'doc'` |
| **DOCX** | `'docx'` |
| **XLS** | `'xls'` |
| **XLSX** | `'xlsx'` |
| **CSV** | `'csv'` |
| **TXT** | `'txt'` |
| **RTF** | `'rtf'` |

### Presentations

| Name | Value |
| :--- | :--- |
| **PPT** | `'ppt'` |
| **PPTX** | `'pptx'` |

### Archives

| Name | Value |
| :--- | :--- |
| **ZIP** | `'zip'` |
| **RAR** | `'rar'` |
| **TAR** | `'tar'` |
| **GZ** | `'gz'` |
| **_7Z** | `'7z'` |

### Audio

| Name | Value |
| :--- | :--- |
| **MP3** | `'mp3'` |
| **WAV** | `'wav'` |
| **AAC** | `'aac'` |
| **FLAC** | `'flac'` |
| **OGG** | `'ogg'` |

### Video

| Name | Value |
| :--- | :--- |
| **MP4** | `'mp4'` |
| **WEBM** | `'webm'` |
| **MKV** | `'mkv'` |
| **AVI** | `'avi'` |
| **MOV** | `'mov'` |
