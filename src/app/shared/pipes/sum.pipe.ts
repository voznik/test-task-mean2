import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sum'
})

export class SumPipe implements PipeTransform {
  transform(items: Array<any>, attr: string): any {
    if (!items || !items.length)
      return ''
    else
      return items.reduce((a, b) => a + b[attr], 0);
  }
}
