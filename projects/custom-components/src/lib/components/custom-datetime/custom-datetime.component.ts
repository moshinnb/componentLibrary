import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { ControlContainer, FormControl, FormControlName, FormGroupDirective } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-custom-datetime',
  templateUrl: './custom-datetime.component.html',
  styleUrls: ['../custom-select/custom-select.component.scss', './custom-datetime.component.scss'],
  viewProviders:[{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class CustomDatetimeComponent implements OnInit, OnChanges{
  @Input() labelValue : string = ''
  @Input() required : boolean = false
  @Input() formcontrolname : string  = ''
  @Input() placeholder : string  = ''
  @Input() isDisabled : boolean = false
  @Input() isLabAdmin : boolean = false
  @Input() minDate : Date = new Date('1900-01-01')
  @Input() allowSelectedDateOnEdit : boolean = false
  _formcontrol : FormControl=new FormControl('')
  previousValue : Date |null = null

  constructor(
    private fcd:  FormGroupDirective
  ){}

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['isDisabled'] && !changes['isDisabled'].isFirstChange()){
      this.isDisabled ? this._formcontrol.disable() : this._formcontrol.enable()
    }
  }

  ngOnInit(): void {
    this._formcontrol = this.fcd.control.get(this.formcontrolname) as FormControl
    if(this._formcontrol.value) this.previousValue = new Date(this._formcontrol.value)
    //this.isDisabled ? this._formcontrol.disable() : this._formcontrol.enable()
  }  

  get form(){
    return this._formcontrol;
  }

  onDateInput(event: any): void {
    const input = event.target as HTMLInputElement;
    if (!(/^[0-9]$/.test(event.data))) {
      input.value = input.value.replace(/[^0-9/]/g, '');   
      return
    } 
    //  if (input.value.includes('/'))
    //  {
    //   const parts = input.value.split('/');      
    
    //   if (parts[0] && parts[0].length === 1) {
    //     parts[0] = '0' + parts[0]; 
    //   }     
    //   input.value = parts.join('/');
    //  }
      
    let value = input.value.replace(/[^0-9]/g, '');   
    if (
      event.key != 'Backspace' &&
      event.key != 'Delete' &&
      (input.value.match(/\//g) || []).length < 2
    ) {
      if (value.length >= 2) {
        value = `${value.slice(0, 2)}/${value.slice(2)}`;
      }

      if (value.length >= 5) {
        value = `${value.slice(0, 5)}/${value.slice(5)}`;
      }

      if (value.length > 10) {
        value = value.slice(0, 10); // Limit to 10 characters
      }
      input.value = value;
    }  
  }

  licensureExpDateInput(event: MatDatepickerInputEvent<Date>):void {
    if (!event.target.value) {
      this._formcontrol.patchValue('')
      return;
    }
  }

  blockPreviousDate =(d: any )=>  {
    // const day = (d || new Date()).getDay();
    // return day !== 0 && day !== 6;
   
    if(this.allowSelectedDateOnEdit){
    d?.setHours(0,0,0,0)
    this.minDate?.setHours(0,0,0,0)
    if(this.previousValue)  this.previousValue?.setHours(0,0,0,0)

    return  d >= this.minDate || (d?.toLocaleDateString() === this.previousValue?.toLocaleDateString())
  }
return true
  };
}
