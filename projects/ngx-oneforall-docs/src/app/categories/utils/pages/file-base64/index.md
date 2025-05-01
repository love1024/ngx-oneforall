The `fileToBase64` utility is a simple yet powerful function in Angular that converts a file into a Base64-encoded string. This can be particularly useful in scenarios where you need to handle file uploads, display images directly in the browser, or store file data in a format suitable for transmission or storage.


### Benefits of Using `fileToBase64`

1. **Direct Image Display**: Convert image files to Base64 strings and display them directly in the browser using the `src` attribute of an `<img>` tag.
2. **Simplified File Handling**: Easily encode files for transmission over APIs or storage in databases.
3. **Cross-Browser Compatibility**: Leverages the `FileReader` API, which is supported in all modern browsers.
4. **Asynchronous Processing**: Returns a `Promise`, allowing seamless integration with `async/await` syntax for better readability and error handling.

### Example Usage

```typescript
const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

fileInput.addEventListener('change', async (event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
        try {
            const base64String = await fileToBase64(file);
            console.log('Base64 String:', base64String);
        } catch (error) {
            console.error('Error converting file to Base64:', error);
        }
    }
});
```

#### Live Demonstration
Explore the functionality of the `fileToBase64` utility with the following live demonstration:

{{ NgDocActions.demo("FileToBase64DemoComponent") }}


This utility simplifies file processing in Angular applications, making it an essential tool for developers working with file uploads or image previews.