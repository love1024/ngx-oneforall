import { HostPlatform } from "@ngx-oneforall/constants";
import { getHostPlatform } from "../host-platform/host-platform";


const META_KEYS = new Set(['meta', 'cmd', 'command', 'super', 'win', 'os']);
const APPLE_PLATFORMS = new Set([HostPlatform.MAC, HostPlatform.IOS]);

const KEY_MAP: Record<string, string> = {
    ' ': 'space', 'space': 'space', 'spacebar': 'space',

    'arrowup': 'arrowup', 'up': 'arrowup',
    'arrowdown': 'arrowdown', 'down': 'arrowdown',
    'arrowleft': 'arrowleft', 'left': 'arrowleft',
    'arrowright': 'arrowright', 'right': 'arrowright',

    'esc': 'escape', 'escape': 'escape',

    'enter': 'enter', 'return': 'enter',

    'backspace': 'backspace',
    'del': 'delete', 'delete': 'delete',

    'tab': 'tab',

    // Modifiers
    'ctrl': 'control', 'control': 'control',
    'controlleft': 'control', 'controlright': 'control',

    'alt': 'alt', 'altright': 'alt', 'altleft': 'alt', 'option': 'alt',
    'shift': 'shift', 'shiftleft': 'shift', 'shiftright': 'shift',

    '.': 'period', 'period': 'period',
    ',': 'comma', 'comma': 'comma',
    ';': 'semicolon', 'semicolon': 'semicolon',
    '\'': 'quote', '"': 'quote', 'quote': 'quote',

    '/': 'slash', 'slash': 'slash',
    '\\': 'backslash', 'backslash': 'backslash',

    '[': 'bracketleft', 'bracketleft': 'bracketleft',
    ']': 'bracketright', 'bracketright': 'bracketright',

    '`': 'backquote', 'backquote': 'backquote',

    '-': 'minus', '_': 'minus', 'minus': 'minus',
    '=': 'equal', '+': 'equal', 'equal': 'equal',

    // Extra keys
    'contextmenu': 'context',
    'menu': 'context',

    'capslock': 'capslock',
    'numlock': 'numlock',
    'scrolllock': 'scrolllock',

    'home': 'home', 'end': 'end',
    'pageup': 'pageup', 'pagedown': 'pagedown',
    'insert': 'insert',

    // Numpad keys (from event.key)
    'numpadadd': 'numpadadd',
    'numpadsubtract': 'numpadsubtract',
    'numpadmultiply': 'numpadmultiply',
    'numpaddivide': 'numpaddivide',
    'numpaddecimal': 'numpaddecimal',
    'numpadcomma': 'numpadcomma',
    'numpadequal': 'numpadequal',
    'numpadenter': 'enter',
};

export function normalizeKey(
    key: string,
    platform: HostPlatform = getHostPlatform()
): string {
    let k = key.toLowerCase().trim();

    if (KEY_MAP[k]) k = KEY_MAP[k];

    const isApple = APPLE_PLATFORMS.has(platform);

    if (!isApple && META_KEYS.has(k)) return 'control';
    if (META_KEYS.has(k)) return 'meta';

    return k;
}
