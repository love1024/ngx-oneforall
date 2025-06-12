


The `autoFocus` directive is a utility designed to automatically focus an element when it is rendered. This is particularly useful for improving user experience in forms, dialogs, or any interactive UI components where immediate focus is desired.

### Features

- **Automatic Focus:** When applied, the directive ensures the host element receives focus as soon as it appears in the DOM.
- **Reactive Focus Management:** The directive tracks the focus state and can respond to changes dynamically.
- **Manual Focus Control:** You can programmatically control the focus state using an input property.

### How to use

```html
<!-- Basic usage -->
<input autoFocus />

<!-- With manual control -->
<input autoFocus [isFocused]="true" />
```



### Input: `isFocused`

You can pass an input property called `isFocused` to the directive. This property is a boolean that determines whether the element should be focused. By updating this value, you can programmatically focus or blur the element as needed.

**Example:**

```html
<input autoFocus [isFocused]="shouldFocus" />
```

In this example, setting `shouldFocus` to `true` will focus the input, while setting it to `false` will remove focus.

### Example Usage

See the directive in action with the following live demonstration:

{{ NgDocActions.demoPane("AutoFocusDemoComponent") }}

