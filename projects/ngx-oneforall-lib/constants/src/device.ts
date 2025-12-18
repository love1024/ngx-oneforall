export const DEVICE_TYPE = {
  Mobile: 'mobile',
  Tablet: 'tablet',
  Desktop: 'desktop',
} as const;

export const ORIENTATION = {
  Portrait: 'portrait',
  Landscape: 'landscape',
} as const;

export type DeviceType = (typeof DEVICE_TYPE)[keyof typeof DEVICE_TYPE];
export type Orientation = (typeof ORIENTATION)[keyof typeof ORIENTATION];
