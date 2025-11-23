
The \`ClipboardService\` provides a simple way to interact with the system clipboard in an Angular application. It abstracts the complexity of the Clipboard API and provides a fallback mechanism for older browsers.

#### Features
- Copies text to the clipboard using the modern Clipboard API.
- Falls back to \`document.execCommand('copy')\` if the Clipboard API is unavailable or fails.
- Reads text from the clipboard.
- Safely handles platform checks (browser vs server).

#### Usage
1. Import and provide the \`ClipboardService\` in your component or module.
2. Inject the service to use its methods.

#### Example
```typescript
import { ClipboardService, provideClipboardService } from '@ngx-oneforall/services';

@Component({
  // ...
  providers: [provideClipboardService()],
})
export class MyComponent {
  constructor(private clipboardService: ClipboardService) {}

  async copy() {
    const success = await this.clipboardService.copy('Hello World');
    if (success) {
      console.log('Copied!');
    }
  }
}
```

#### Methods
- **\`copy(text: string): Promise<boolean>\`**: Copies the provided text to the clipboard. Returns a promise that resolves to \`true\` if successful, \`false\` otherwise.
- **\`read(): Promise<string>\`**: Reads text from the clipboard. Returns a promise that resolves to the text, or an empty string if failed.

#### Live Demo

Try out the clipboard service below:

{{ NgDocActions.demo("ClipboardDemoComponent") }}
