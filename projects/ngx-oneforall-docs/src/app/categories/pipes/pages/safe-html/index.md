The `safeHtml` pipe is a custom Angular pipe that allows rendering of raw HTML content in your Angular application. It uses Angular's `DomSanitizer` service to mark the provided HTML as trusted, bypassing Angular's built-in security mechanisms. This means the developer must ensure the content is safe to avoid security vulnerabilities such as Cross-Site Scripting (XSS) attacks.

#### Purpose
Binding raw HTML directly to the DOM using Angular's `innerHTML` is blocked by Angular's security mechanisms to prevent vulnerabilities. The `safeHtml` pipe allows you to bypass these restrictions and render raw HTML, but it requires you to validate the content for safety before passing it to the pipe.

#### How It Works
The `safeHtml` pipe uses Angular's `DomSanitizer.bypassSecurityTrustHtml` method to mark the provided HTML string as trusted. It validates that the input is a string and throws an error if it is not. If the input is `null` or `undefined`, it returns an empty string. However, it does not sanitize or modify the content to make it safe—this responsibility lies entirely with the developer.

#### Usage
To use the `safeHtml` pipe, pass a dynamic HTML string to the pipe in your Angular template. The pipe will mark the content as trusted and render it in the DOM.

Example:

```html
<div [innerHTML]="unsafeHtml | safeHtml"></div>
```

**Important:** Ensure that the HTML content passed to the pipe is safe and free from malicious code. This pipe bypasses Angular's security checks, so improper use can expose your application to XSS attacks.


#### Live Demonstration
Experience the `safeHtml` pipe in action through the following live demonstration:

{{ NgDocActions.demo("SafeHtmlPipeDemoComponent") }}