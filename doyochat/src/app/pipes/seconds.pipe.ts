import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'seconds'
})
export class SecondsPipe implements PipeTransform {

  transform(value: number): string {
    return (value/1000).toString() + ' сек';
  }

}
