import { getPlatform, PLATFORM_ID } from '@angular/core';

export function getCurrentPlatformId() {
  return getPlatform()?.injector.get(PLATFORM_ID);
}
