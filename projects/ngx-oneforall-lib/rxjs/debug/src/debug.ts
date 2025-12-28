import { tap } from 'rxjs';

export function debug<T>(
  tag: string,
  when: (value?: T) => boolean = () => true
) {
  return tap<T>({
    next(value) {
      if (!when(value)) return;
      console.log(
        `%c[${tag}: Next]`,
        'background: #00bbd4ff; color: #fff; padding: 3px; font-size: 9px;',
        value
      );
    },
    error(error) {
      if (!when()) return;
      console.log(
        `%c[${tag}: Error]`,
        'background: #E91E63; color: #fff; padding: 3px; font-size: 9px;',
        error
      );
    },
    complete() {
      if (!when()) return;
      console.log(
        `%c[${tag}]: Complete`,
        'background:  #009688; color: #fff; padding: 3px; font-size: 9px;'
      );
    },
  });
}
