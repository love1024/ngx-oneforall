/**
 * Device type classifications.
 */
export const DEVICE_TYPE = {
  Mobile: 'mobile',
  Tablet: 'tablet',
  Desktop: 'desktop',
} as const;

/**
 * Screen orientation values.
 */
export const ORIENTATION = {
  Portrait: 'portrait',
  Landscape: 'landscape',
} as const;

/** Union type of device types. */
export type DeviceType = (typeof DEVICE_TYPE)[keyof typeof DEVICE_TYPE];

/** Union type of orientations. */
export type Orientation = (typeof ORIENTATION)[keyof typeof ORIENTATION];
