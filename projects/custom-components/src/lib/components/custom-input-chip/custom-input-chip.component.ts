import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-custom-input-chip',
  templateUrl: './custom-input-chip.component.html',
  styleUrls: ['../custom-select/custom-select.component.scss','./custom-input-chip.component.scss']
})
export class CustomInputChipComponent {
  @Input() placeholder : string=''
  @Input() isDisabled : boolean=false
  @Input() labelValue : string='Barcode No'
  @Input() required : boolean=false;
  @Input() isValid : boolean=true
  @Input()selectionModel:SelectionModel<string>=new SelectionModel<string>(true,[])
  constructor() { }
 
  addValue(ref:any){
    if(ref.value.trim()){
      this.selectionModel.select(ref.value.trim())
    }
  }
}
