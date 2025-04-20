

Follow the steps below to install and set up the `ngx-oneforall` library in your Angular project.

## Step 1: Install ngx-oneforall

To add the `ngx-oneforall` library to your Angular project, run the following command in your project directory:

```bash
npm install ngx-oneforall --save
```

Alternatively, if you are using `yarn`, use:

```bash
yarn add ngx-oneforall
```


## Step 2: Import Specific Features

After installation, you can import only the specific parts of the `ngx-oneforall` library that you need, such as pipes or services. 
### Example: Importing a Pipe and a Service into a Standalone Component

```typescript
import { Component } from '@angular/core';
import { MemoizePipe, SomeService } from 'ngx-oneforall';

@Component({
  selector: 'app-component',
  templateUrl: 'app.component.html'
  standalone: true,
  imports: [MemoizePipe],
  providers: [SomeService]
})
export class AppComponent {
}
```
```

This approach allows you to include only the features you need, keeping your application lightweight and optimized.


## Troubleshooting

If you encounter any issues during installation, consider the following:

1. Ensure that your Angular version is compatible with the library.
2. Delete the `node_modules` folder and reinstall dependencies:
   ```bash
   rm -rf node_modules
   npm install
   ```
3. Check for any peer dependency warnings during installation and resolve them.

## Additional Resources

For more details, refer to the official documentation of `ngx-oneforall` or visit the [GitHub repository](https://github.com/your-repo-link).
