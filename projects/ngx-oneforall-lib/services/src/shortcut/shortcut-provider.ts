import { Provider } from '@angular/core';
import { ShortcutService } from './shortcut.service';

export function provideShortcutService(): Provider {
    return ShortcutService;
}
