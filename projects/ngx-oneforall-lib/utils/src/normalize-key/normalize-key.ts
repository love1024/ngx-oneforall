import { HostPlatform } from "@ngx-oneforall/constants";
import { getHostPlatform } from "@ngx-oneforall/utils";

// Static transform map - created once and reused
const TRANSFORM_MAP: Record<string, string> = {
    'space': ' ',
    'up': 'arrowup',
    'down': 'arrowdown',
    'left': 'arrowleft',
    'right': 'arrowright',
    'esc': 'escape',
    'altleft': 'alt',
};

// Set for faster meta key lookups
const META_KEYS = new Set(['meta', 'cmd', 'command']);

// Apple platforms that use meta key
const APPLE_PLATFORMS = new Set([HostPlatform.MAC, HostPlatform.IOS]);

export function normalizeKey(key: string, platform: HostPlatform = getHostPlatform()): string {
    const lowerKey = key.toLowerCase().trim();
    const isApplePlatform = APPLE_PLATFORMS.has(platform);

    // Convert meta/cmd to control on non-Apple platforms
    if (!isApplePlatform && META_KEYS.has(lowerKey)) {
        return 'control';
    }

    return TRANSFORM_MAP[lowerKey] ?? lowerKey;
}
