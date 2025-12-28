import { Pipe, PipeTransform } from '@angular/core';

const DEFAULT_UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
const base = 1024;

@Pipe({
  name: 'bytes',
  standalone: true,
  pure: true,
})
export class BytesPipe implements PipeTransform {

  transform(value: number | string, decimals: number = 2, units: string[] = DEFAULT_UNITS): string {
    if (value === '' || value === null || value === undefined || isNaN(Number(value))) {
      return `0 ${units[0]}`;
    }

    const bytes = Number(value);

    // Handle negative numbers
    if (bytes < 0) {
      return '-' + this.transform(Math.abs(bytes), decimals, units);
    }

    if (bytes === 0) {
      return `0 ${units[0]}`;
    }

    const index = Math.floor(Math.log(bytes) / Math.log(base));
    // Prevent index out of bounds for very large numbers
    const unitIndex = Math.min(index, units.length - 1);

    const size = bytes / Math.pow(base, unitIndex);

    const formatted =
      decimals !== null && decimals >= 0
        ? size.toFixed(decimals)
        : size.toString();

    return `${formatted} ${units[unitIndex]}`;
  }
}
