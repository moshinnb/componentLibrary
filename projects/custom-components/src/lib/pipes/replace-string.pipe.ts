import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceString'
})
export class ReplaceStringPipe implements PipeTransform {

  transform(value: string, replacerValue:string,replaceValue:string): string {
    var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

    if(value && replaceValue && replacerValue)
    {
      return value?.replaceAll(replacerValue,replaceValue)
    }
    return value;
  }

}
