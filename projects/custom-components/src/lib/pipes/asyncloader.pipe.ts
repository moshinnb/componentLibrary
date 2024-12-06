import { Pipe, PipeTransform } from '@angular/core';
import { catchError, isObservable, map, of, startWith } from 'rxjs';

@Pipe({
  name: 'asyncloader'
})
export class AsyncloaderPipe implements PipeTransform {

  transform(value:any) {
    return isObservable(value)?
    value.pipe(
      map((value: any) => ({ loading: false, data:value })),
      startWith({ loading: true,data:[] }),
      catchError(error => of({ loading: false, error ,data:[]}))
    ):value;
  }

}
