import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ControlContainer, FormArray, FormGroupDirective, Validators } from '@angular/forms';
import { provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
  viewProviders:[{ provide: ControlContainer, useExisting: FormGroupDirective}]
  
})
export class CustomInputComponent implements OnInit, OnChanges{
  @Input() type : string = 'text'
  @Input() labelValue : string = ''
  @Input() required : boolean = false
  @Input() formcontrolname : string  = ''
  @Input() maxLength : number = 50
  @Input() mask : string = ''
  @Input() prefix : string = ''
  @Input() placeholder : string = ''
  @Input() InvalidMessage : string = ''
  @Input() containerClass : string = 'mb-3 me-3'
  @Input() selectedValue:string=''
  @Input() isDisabled:boolean=false
  @Input() isReadOnly:boolean=false
  @Input() subscript:string=''
  @Output() onFocusOut = new EventEmitter()
  @Output() onFocus = new EventEmitter()
  @Output() onImageClick = new EventEmitter()
  @Input() className : string = ''
  @Input() formarrayname : string = ''
  @Input() formgroupname : any = ''
  @Input() isLabAdmin : boolean = false
  @Input() minDate : Date = new Date( '1900-01-01') ;
  @Input() allowSelectedDateOnEdit : boolean = false
  @Input('sideImage') img =''
  @Input() imageType : 'side' | 'whole' | '' = ''
  _formcontrol : any
 
  constructor(
    private fcd:  FormGroupDirective
  ){}

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['formgroupname']){
       const formarray = this.fcd.control.get(this.formarrayname) as FormArray
       this._formcontrol = formarray.controls[this.formgroupname].get(this.formcontrolname)
    }
  }

  ngOnInit(): void {
    this.maxLength = this.mask.length > 0 ?  524288 : this.maxLength
    if(!this.formarrayname)  this._formcontrol = this.fcd.control.get(this.formcontrolname)
    if(this.mask && this.formcontrolname){
      this.fcd.control.get(this.formcontrolname)?.valueChanges.subscribe((res : any) => {
        if(res === `${this.prefix} `) {
          this.fcd.control.get(this.formcontrolname)?.patchValue('')
        }
        if(res){
          if(res[res.length - 1] === 'x') this.fcd.control.get(this.formcontrolname)?.patchValue(res.slice(0,-1))
          if(res[res.length - 1] === ',') this.fcd.control.get(this.formcontrolname)?.patchValue(res.slice(0,-1))
        }
      })
    }
  }

  focus(ref : any){
    if(ref.value === '' && this.prefix != ''){
      ref.value = this.prefix
    } 
  }

   get form(){
    return this._formcontrol;
    //if(!this.formarrayname)  return this.fcd.control.get(this.formcontrolname)
  }

  get validators_required(){
    return this._formcontrol.hasValidator(Validators.required)
  }
}
