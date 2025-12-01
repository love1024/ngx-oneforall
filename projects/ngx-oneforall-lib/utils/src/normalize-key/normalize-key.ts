import { HostPlatform } from "@ngx-oneforall/constants";
import { getHostPlatform } from "../host-platform/host-platform";


const APPLE_PLATFORMS = new Set([HostPlatform.MAC, HostPlatform.IOS]);

const META_KEYS = new Set([
    'meta', 'cmd', 'command', 'super', 'win', 'os'
]);

const MAP: Record<string, string> = {
    ' ': 'space',
    'space': 'space',
    'spacebar': 'space',
    'up': 'arrowup',
    'arrowup': 'arrowup',
    'down': 'arrowdown',
    'arrowdown': 'arrowdown',
    'left': 'arrowleft',
    'arrowleft': 'arrowleft',
    'right': 'arrowright',
    'arrowright': 'arrowright',
    'esc': 'escape',
    'escape': 'escape',
    'enter': 'enter',
    'return': 'enter',
    'backspace': 'backspace',
    'del': 'delete',
    'delete': 'delete',
    'tab': 'tab',
    'ctrl': 'control',
    'control': 'control',
    'controlleft': 'control',
    'controlright': 'control',
    'alt': 'alt',
    'altleft': 'alt',
    'altright': 'alt',
    'option': 'alt',
    'shift': 'shift',
    'shiftleft': 'shift',
    'shiftright': 'shift',
    'meta': 'meta',
    'cmd': 'meta',
    'command': 'meta',
    '.': 'period',
    ',': 'comma',
    '/': 'slash',
    '\\': 'backslash',
    ';': 'semicolon',
    '\'': 'quote',
    '"': 'quote',
    '[': 'bracketleft',
    ']': 'bracketright',
    '`': 'backquote',
    '-': 'minus',
    '=': 'equal',
    '+': 'equal',
    '_': 'minus',
    '{': 'bracketleft',
    '}': 'bracketright',
    ':': 'semicolon',
    '?': 'slash',
    '|': 'backslash',
    '~': 'backquote',
};

export function normalizeKey(
    key: string,
    platform: HostPlatform = getHostPlatform()
): string {
    let k = key.toLowerCase().trim();

    // Normalize via map
    if (MAP[k]) {
        k = MAP[k];
    }

    const isApple = APPLE_PLATFORMS.has(platform);

    // Meta normalization depends on OS
    if (!isApple && META_KEYS.has(k)) {
        return 'control';
    }

    if (META_KEYS.has(k)) {
        return 'meta';
    }

    return k;
}
