The `hoverClass` directive is a reusable Angular directive that dynamically applies one or more CSS classes to an element when it is hovered by the mouse. This directive is particularly useful for enhancing user experience by providing visual feedback on hover, such as highlighting buttons, cards, or any interactive UI elements.

### Features

- **Dynamic Class Application:** Accepts one or multiple CSS class names to be toggled on hover.
- **Configurable Enable/Disable:** The directive can be enabled or disabled dynamically using an input binding.
- **Reactive Updates:** Automatically responds to changes in the class names or enabled state.
- **Seamless Integration:** Designed to work with Angular's dependency injection and rendering mechanisms.

### Usage

To use the `hoverClass` directive, simply add the `hoverClass` attribute to any HTML element and provide the desired class or classes as its value. Optionally, you can bind the `hoverClassEnabled` input to control whether the hover effect is active.

```html
<!-- Apply a single class on hover -->
<button [hoverClass]="'highlight'">Hover me</button>

<!-- Apply multiple classes on hover -->
<div [hoverClass]="'shadow-lg border-primary'">Hover over this box</div>

<!-- Conditionally enable/disable the hover effect -->
<span [hoverClass]="'underline'" [hoverClassEnabled]="isHoverActive">Hoverable text</span>
```

### Inputs

| Input              | Type      | Description                                              |
|--------------------|-----------|----------------------------------------------------------|
| `hoverClass`       | `string`  | Required. Space-separated list of CSS classes to toggle. |
| `hoverClassEnabled`| `boolean` | Optional. Enables or disables the hover effect. Defaults to `true`. |

### How It Works

- On mouse enter, the directive adds the specified classes to the host element if `hoverClassEnabled` is `true`.
- On mouse leave, it removes those classes.
- If the `hoverClass` input changes, the directive updates the classes to be toggled accordingly.
- If `hoverClassEnabled` is set to `false`, the directive ensures that no hover classes are applied.

### Example Usage

See the directive in action with the following live demonstration:

{{ NgDocActions.demoPane("HoverClassDemoComponent") }}

