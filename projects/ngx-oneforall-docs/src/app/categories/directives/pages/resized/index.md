# FirstErrorKey Pipe

A custom Angular pipe that retrieves the first error key from an `AbstractControl` instance. This is useful for displaying the first validation error in a form control.

## Usage

The `FirstErrorKeyPipe` can be used to extract the first error key from a form control's validation errors. This is particularly helpful when you want to display only the first validation error to the user.

### Example 1: Displaying the First Error Key

```html
<form>
  <input [formControl]="formControl" placeholder="Enter value" />
  @if (formControl | firstErrorKey as firstError) {
    <div>
      First error key: {{ firstError }}
    </div>
  }
</form>