import { ViewportRuler } from '@angular/cdk/scrolling';
import {  ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ControlContainer, FormControl, FormGroupDirective, Validators } from '@angular/forms';
import { ClientRectObject } from '@popperjs/core';
import { map, Observable, startWith, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-custom-select',
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.scss'],
  viewProviders:[{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class CustomSelectComponent implements OnInit, OnChanges,OnDestroy{
  @Input() labelValue : string = ''
  @Input() required : boolean = false
  @Input() formcontrolname : string | null = null
  @Input() isFormValid:boolean|null=true
  @Input() isDisabled:boolean=false
  @Input() enableSearch:boolean=false
  @Input() fromLabAdmin : boolean=false
  @Input() dropDownValues : any = []
  @Input() dropDownKeyProp : string = ''
  @Input() dropDownValueProp : string = ''
  @Input() placeholder : string = 'Search here'
  @Input() defaultOption : string = 'Select Option'
  @Input() popUpRef : any
  @Input() sorted:boolean = true //sort's data in alphabetical order  
  @ViewChild('customSelect') select :any
  @ViewChild('cstmpopup') cstmpopupEle :any;
  @ViewChild('maindivct') maindiv :any;
  @ViewChild('inp') mainInp :any;

  protected readonly _destroy = new Subject<void>();
  value : any
  showDropDown : boolean = false
  selectedItem : string = ''
  contentWidth: ClientRectObject= {} as ClientRectObject;
  incrementValue :number = 0;
  filterForm = new FormControl('');
  currentFilteredValues = []
  isKeyEventActive : boolean = false
  filterDropDown$ = this.filterForm.valueChanges.pipe(
    startWith(''),
    map((value) => this._filter(value || '')))
  arrowkeyLocation = 0


  constructor(
    private fcd:  FormGroupDirective,protected _viewportRuler: ViewportRuler, protected _changeDetectorRef: ChangeDetectorRef
  ){}
  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['dropDownValues']){
      this.currentFilteredValues = structuredClone(this.dropDownValues)
      this.filterForm.patchValue(this.filterForm.value)
    }
    if(changes['dropDownValues'] && this.fcd?.control?.get(this.formcontrolname ?? '')?.value){
      this.selectionHelper()   
    }
    if(changes['defaultOption'] && !changes['enableSearch'])
      {
        this.incrementValue=this.defaultOption.length?1:0
      }
  }

  ngOnInit(): void {
    if(this.dropDownValues?.length)
      this.dropDownValues=this.sorted? this.dropDownValues.sort((i:any,j:any)=>i[this.dropDownKeyProp].trim()>j[this.dropDownKeyProp].trim()?1:-1) : this.dropDownValues

    this._viewportRuler
      .change()
      .pipe(takeUntil(this._destroy))
      .subscribe(() => {
        if (this.showDropDown) {
          this.contentWidth = this.select.nativeElement.getBoundingClientRect();
          this._changeDetectorRef.markForCheck();
        }
      });
    if(!this.fcd.control.get(this.formcontrolname ?? '')?.value && !this.enableSearch){
      this.selectedItem = this.defaultOption
    }
    else {
      this.selectionHelper()
    }

    this.fcd.control.get(this.formcontrolname ?? '')?.valueChanges.subscribe((value) => {
      if(!value && !this.enableSearch) this.selectedItem = this.defaultOption
      else this.selectionHelper()
    })
  }
  
  addValue(drp :any){ 
    if(this.popUpRef && this.selectedItem != this.defaultOption && this.selectedItem != drp[this.dropDownKeyProp]){
      this.popUpRef().afterClosed().subscribe((res:any) => {
        if(res){
          this.addvalue_selectionHelper(drp)
        } 
      })
    
  }
  else this.addvalue_selectionHelper(drp)
  }

  addvalue_selectionHelper(drp:any){
    if(this.selectedItem != drp[this.dropDownKeyProp])
    {
      this.showDropDown = false
      this.selectedItem = drp[this.dropDownKeyProp]
      this.fcd.control.get(this.formcontrolname ?? '')?.markAsDirty()
      this.fcd.control.get(this.formcontrolname ?? '')?.markAsTouched()
      this.fcd.control.get(this.formcontrolname ?? '')?.setValue(drp[this.dropDownValueProp])
      this.filterForm.setValue('')
      this.select.nativeElement.blur();
      this.maindiv.nativeElement.focus();
    }
  }

  showHideDropDown(){
    if(!this.fcd.control.get(this.formcontrolname ?? '')?.disabled)
      {
        this.showDropDown = !this.showDropDown
        this.contentWidth = this.select.nativeElement.getBoundingClientRect()
        //this.arrowkeyLocation=0
      }
  } 

  setToDefault(){
    if(this.popUpRef && this.selectedItem != this.defaultOption){
      this.popUpRef().afterClosed().subscribe((res:any) => {
        if(res){
          this.setDefaultHelper()
        } 
      })
    
  }
  else this.setDefaultHelper()
  }

  setDefaultHelper(){
    if(this.selectedItem != this.defaultOption)
    {
      this.showDropDown = false
      this.selectedItem = this.defaultOption
      this.fcd.control.get(this.formcontrolname ?? '')?.markAsDirty()
      this.fcd.control.get(this.formcontrolname ?? '')?.markAsTouched()
      this.fcd.control.get(this.formcontrolname ?? '')?.setValue('')
      this.maindiv.nativeElement.focus();
    }
  }

  get form(){
    return this.fcd.control.get(this.formcontrolname ?? '')
  }

  keydown(event:KeyboardEvent){
    if(!this.showDropDown && ['enter','arrowdown'].includes(event.key.toLowerCase()) || event.keyCode >= 65 && event.keyCode <= 90)
      {
          if(this.showDropDown && event.key.toLowerCase() == 'arrowdown' || (this.showDropDown && this.enableSearch)) {}
          else this.showDropDown = !this.showDropDown

          this.contentWidth = this.select.nativeElement.getBoundingClientRect()
          this.arrowkeyLocation = this.enableSearch ? -1 : 0
          this.maindiv.nativeElement.focus();

          if(event.keyCode >= 65 && event.keyCode <= 90 && !this.enableSearch){
            var loc = this.dropDownValues.findIndex((i:any)=> i[this.dropDownKeyProp][0].toLowerCase() === event.key.toLowerCase())
            this.arrowkeyLocation = loc == -1 ? this.arrowkeyLocation : loc
            this.arrowkeyLocation = this.arrowkeyLocation + this.incrementValue
            this.cstmpopupEle? this.cstmpopupEle.nativeElement.children[this.arrowkeyLocation].focus():''
          }

          if(event.key.toLowerCase() == 'arrowdown') event.preventDefault()
      }
      else if(event.key.toLowerCase() == "enter" && !this.isKeyEventActive){
        this.addValue(this.currentFilteredValues[0])
      }
  }
  focusOnElement()
  {
    this.currentFilteredValues = structuredClone(this.dropDownValues)
    this.isKeyEventActive = false
    if(this.fcd.control.get(this.formcontrolname ?? '')?.value){
    this.arrowkeyLocation=this.dropDownValues.findIndex((i:any)=>i[this.dropDownValueProp]==this.form?.value)==-1?0:this.dropDownValues.findIndex((i:any)=>i[this.dropDownValueProp]==this.form?.value)
    this.arrowkeyLocation=this.arrowkeyLocation+this.incrementValue
    this.cstmpopupEle? this.cstmpopupEle.nativeElement.children[this.arrowkeyLocation].focus():''
    }
   //else this.arrowkeyLocation = this.enableSearch ? -1 : 0

    if(this.enableSearch) this.mainInp.nativeElement.focus()
  }

  pressed(event:any){
    this.isKeyEventActive = true
    if(event.key=='Tab')
      {
        this.showDropDown=false;
        this.maindiv.nativeElement.focus();
      }
    else if(event.key=="ArrowDown" )
      {
        if(this.arrowkeyLocation < (this.defaultOption ? this.currentFilteredValues.length : this.currentFilteredValues.length - 1) ){
        this.cstmpopupEle? this.cstmpopupEle.nativeElement.children[++this.arrowkeyLocation]?.focus():''
      }
        event.preventDefault();
      }
    else if(event.key=="ArrowUp")
    {
        if(this.arrowkeyLocation>0){
        this.cstmpopupEle? this.cstmpopupEle.nativeElement.children[--this.arrowkeyLocation]?.focus():'' 
        }
        event.preventDefault();
    }
    else{
      if(event.keyCode >= 65 && event.keyCode <= 90 && !this.enableSearch){
        this.arrowkeyLocation=this.dropDownValues.findIndex((i:any)=> i[this.dropDownKeyProp][0].toLowerCase() === event.key.toLowerCase())
        this.arrowkeyLocation = this.arrowkeyLocation == -1 ? 0 : this.arrowkeyLocation
        this.arrowkeyLocation = this.arrowkeyLocation + this.incrementValue
        this.cstmpopupEle? this.cstmpopupEle.nativeElement.children[this.arrowkeyLocation].focus():''
      }
    }
    
  }

  private selectionHelper(){

    if(this.dropDownValues.length){  
      this.dropDownValues = [...this.dropDownValues]
     // this.dropDownValues=this.sorted? this.dropDownValues.sort((i:any,j:any)=>i[this.dropDownKeyProp].trim()>j[this.dropDownKeyProp].trim()?1:-1) : this.dropDownValues
      const value = this.dropDownValues.find((j:any) => j[this.dropDownValueProp] === this.fcd.control.get(this.formcontrolname??'')?.value)
      this.selectedItem = value[this.dropDownKeyProp]
    }
  }
  

  private _filter(value: any) {
    if (value.length && this.dropDownValues.length) {
      const filterValue = this._normalizeValue(value);
      this.currentFilteredValues = this.dropDownValues.filter((dropdown:any) =>
        this._normalizeValue(dropdown[this.dropDownKeyProp]).includes(filterValue)
      );
      if(!this.currentFilteredValues.length) this.showDropDown = false
      else this.showDropDown = true

      return this.currentFilteredValues
    }
    return this.dropDownValues
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  FilterDropDown(value : string){
    this.isKeyEventActive = false
    if(this.fcd.control.get(this.formcontrolname ?? '')?.value && !this.dropDownValues.includes((j:any) => j[this.dropDownKeyProp] === value)){
      this.fcd.control.get(this.formcontrolname ?? '')?.setValue('')
    }

    this.filterForm.setValue(value)
    this.selectedItem = value

    if(this.filterForm.value){
      this.arrowkeyLocation = 0
    }
  }

  SetFormValidator(){
    this.fcd.control.get(this.formcontrolname ?? '')?.markAsDirty()
    this.fcd.control.get(this.formcontrolname ?? '')?.markAsTouched()
    if(this.enableSearch){
      if(this.filterForm.value && !this.fcd.control.get(this.formcontrolname ?? '')?.value) this.fcd.control.get(this.formcontrolname ?? '')?.setErrors({ invalidValue : true })
      else {
            if(this.fcd.control.get(this.formcontrolname ?? '')?.hasValidator(Validators.required) && !this.fcd.control.get(this.formcontrolname ?? '')?.value){
              this.fcd.control.get(this.formcontrolname ?? '')?.setErrors({required : true})
            }
            else this.fcd.control.get(this.formcontrolname ?? '')?.setErrors(null)
        }
    }
  }

  get validators_required(){
    return this.fcd.control.get(this.formcontrolname ?? '')?.hasValidator(Validators.required)
  }
}
