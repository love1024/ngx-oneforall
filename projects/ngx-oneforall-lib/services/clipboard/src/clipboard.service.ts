import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

/**
 * Service for copying and reading text from the clipboard.
 * Uses Clipboard API with fallback to execCommand for older browsers.
 */
@Injectable()
export class ClipboardService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);

  /**
   * Copies the provided text to the clipboard.
   * Uses the Clipboard API if available, otherwise falls back to execCommand.
   * @param text The text to copy.
   * @returns A promise that resolves to true if the copy was successful, false otherwise.
   */
  async copy(text: string): Promise<boolean> {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (error) {
        // Fallback to execCommand if Clipboard API fails
      }
    }

    return this.copyFallback(text);
  }

  /**
   * Reads text from the clipboard.
   * @returns A promise that resolves to the text from the clipboard, or an empty string if failed.
   */
  async read(): Promise<string> {
    if (!isPlatformBrowser(this.platformId)) {
      return '';
    }

    if (navigator.clipboard && navigator.clipboard.readText) {
      try {
        return await navigator.clipboard.readText();
      } catch (error) {
        return '';
      }
    }

    return '';
  }

  private copyFallback(text: string): boolean {
    const textArea = this.document.createElement('textarea');
    textArea.value = text;

    // Ensure the textarea is not visible but part of the DOM
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '0';
    this.document.body.appendChild(textArea);

    textArea.focus();
    textArea.select();

    let success = false;
    try {
      success = this.document.execCommand('copy');
    } catch (err) {
      // execCommand failed
    }

    this.document.body.removeChild(textArea);
    return success;
  }
}
