/**
 * Common file extension constants organized by category.
 * Use for file type validation, filtering, or display.
 *
 * @example
 * const allowedImages = [FILE_EXTENSION.PNG, FILE_EXTENSION.JPG, FILE_EXTENSION.WEBP];
 */
export const FILE_EXTENSION = {
  // Images
  PNG: 'png',
  JPG: 'jpg',
  JPEG: 'jpeg',
  GIF: 'gif',
  WEBP: 'webp',
  SVG: 'svg',

  // Documents
  PDF: 'pdf',
  DOC: 'doc',
  DOCX: 'docx',
  XLS: 'xls',
  XLSX: 'xlsx',
  CSV: 'csv',
  TXT: 'txt',
  RTF: 'rtf',

  // Presentations
  PPT: 'ppt',
  PPTX: 'pptx',

  // Archives
  ZIP: 'zip',
  RAR: 'rar',
  TAR: 'tar',
  GZ: 'gz',
  _7Z: '7z',

  // Audio
  MP3: 'mp3',
  WAV: 'wav',
  AAC: 'aac',
  FLAC: 'flac',
  OGG: 'ogg',

  // Video
  MP4: 'mp4',
  WEBM: 'webm',
  MKV: 'mkv',
  AVI: 'avi',
  MOV: 'mov',
} as const;

/** Union type of all file extensions. */
export type FileExtension =
  (typeof FILE_EXTENSION)[keyof typeof FILE_EXTENSION];
