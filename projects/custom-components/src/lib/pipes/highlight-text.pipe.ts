import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlightText',
  
})
export class HighlightTextPipe implements PipeTransform {

  transform(value: string, searchTerm: string): string {
    if (!searchTerm) {
      return value;
    }

    // Escape special characters for the regex
    const escapedSearchTerm = searchTerm.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, '\\$&');

    // Create a case-insensitive regex to match the search term
    const regex = new RegExp(`(${escapedSearchTerm})`, 'gi');
    
    // Replace matched text with the highlighted version
    return value.replace(regex, `<span class="markup-style">$1</span>`);
  }

}
