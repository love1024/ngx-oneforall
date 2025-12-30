import { Pipe, PipeTransform } from '@angular/core';

const DEFAULT_UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
const BINARY_BASE = 1024;
const SI_BASE = 1000;

/**
 * Pipe that converts byte values to human-readable format.
 *
 * @usageNotes
 * ```html
 * {{ 1024 | bytes }}                 <!-- "1.00 KB" (binary) -->
 * {{ 1536 | bytes:0 }}               <!-- "2 KB" -->
 * {{ 1048576 | bytes:1 }}            <!-- "1.0 MB" -->
 * {{ 1000 | bytes:2:null:true }}     <!-- "1.00 KB" (SI) -->
 * ```
 */
@Pipe({
  name: 'bytes',
})
export class BytesPipe implements PipeTransform {
  /**
   * Converts bytes to human-readable format (e.g., 1024 → "1.00 KB")
   *
   * @param value - Bytes as number or string
   * @param decimals - Decimal places (default: 2)
   * @param units - Custom unit labels (default: ['B', 'KB', 'MB', 'GB', 'TB', 'PB'])
   * @param useSI - Use SI standard (base 1000) instead of binary (base 1024). Default: false
   * @returns Formatted string with appropriate unit
   */
  transform(
    value: number | string,
    decimals = 2,
    units: string[] | null = DEFAULT_UNITS,
    useSI = false
  ): string {
    const unitLabels = units ?? DEFAULT_UNITS;
    const base = useSI ? SI_BASE : BINARY_BASE;

    if (value === '' || value == null || isNaN(Number(value))) {
      return `0 ${unitLabels[0]}`;
    }

    const bytes = Number(value);

    // Handle negative numbers
    if (bytes < 0) {
      return '-' + this.transform(Math.abs(bytes), decimals, unitLabels, useSI);
    }

    if (bytes === 0) {
      return `0 ${unitLabels[0]}`;
    }

    const index = Math.floor(Math.log(bytes) / Math.log(base));
    // Prevent index out of bounds for very large numbers
    const unitIndex = Math.min(index, unitLabels.length - 1);

    const size = bytes / Math.pow(base, unitIndex);

    const formatted =
      decimals !== null && decimals >= 0
        ? size.toFixed(decimals)
        : size.toString();

    return `${formatted} ${unitLabels[unitIndex]}`;
  }
}
