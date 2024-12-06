import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate'
})
export class FormatDatePipe extends DatePipe implements PipeTransform {

  override transform(value: any, ...args: unknown[]): any {
    if(args.length === 0) return super.transform(value, "MMM d, y, h:mm a");
    else return super.transform(value, String(args[0]));
  }

}
