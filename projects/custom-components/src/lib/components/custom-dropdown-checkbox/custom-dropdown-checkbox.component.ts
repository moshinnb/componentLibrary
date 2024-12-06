import { SelectionModel } from '@angular/cdk/collections';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { AfterViewInit, ChangeDetectorRef, Component, ContentChild, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, QueryList, SimpleChanges, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { ClientRectObject } from '@popperjs/core';
import { Subject, takeUntil, reduce, debounceTime, map, startWith, tap, of, Observable } from 'rxjs';

@Component({
  selector: 'app-custom-dropdown-checkbox',
  templateUrl: './custom-dropdown-checkbox.component.html',
  styleUrls: ['../custom-select/custom-select.component.scss','./custom-dropdown-checkbox.component.scss']
})
export class CustomDropdownCheckboxComponent implements OnInit,OnDestroy,OnChanges {
   
@Input() type : string = 'text'
@Input() labelValue : string = ''
@Input() required : boolean = false
@Input() formcontrolname : string | null = null
@Input() maxLength : number = 50
@Input() mask : string = ''
@Input() prefix : string = ''
@Input() placeholder : string = ''
@Input() validateField : boolean = false
@Input() InvalidMessage : string = ''
@Input() containerClass : string = 'mb-3 me-3'
@Input() selectedValue:string=''
@Input() isFormValid:boolean|null=true
@Input() isDisabled:boolean=false
@Input() listData : any = []
@Input() enableSearch:boolean=false
@Input() isAllOptionShown:boolean=true;
@Input() dropDownKeyProp : string = ''
@Input() dropDownValueProp : string = ''
@Input() inputSearchPlaceholder : string = 'Type here to search'
 @Input() noRecordsFoundMessage: string = 'No Results'
 @Input() isValid:boolean=true
@Input() popUpRef : any


@Output() onFocusOut = new EventEmitter();
showDropDown:boolean=false
contentWidth: ClientRectObject={} as ClientRectObject
private resizeObserver!: ResizeObserver;

dropdownSelectionUnsubscribe:any=null
overflowCharecterCount=0
arrowkeyLocation=0
remainingCount=0

control=new FormControl();
dropdownList$:Observable<any> =of([])
protected readonly _destroy = new Subject<void>();

@ViewChild('customSelect') select:any
@ViewChild('cstmpopup') cstmpopupEle :any;
@ViewChild('maindivct') maindiv :any;
@ViewChild('inp') mainInp :any;
@ViewChildren('checkboxRef') checkboxes: QueryList<MatCheckbox> | null = null;
@ViewChild('searchBox') searchBox :any;
@Input()selectionModel:SelectionModel<string>=new SelectionModel<string>(true,[])
showTooltip:boolean=false
contentwidth=0
  constructor(protected _viewportRuler: ViewportRuler, protected _changeDetectorRef: ChangeDetectorRef) { }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['listData'])
      {
        if (this.listData.length) {
          if (this.dropDownKeyProp == '' && this.dropDownValueProp == '') {
            this.listData = this.listData?.map((i:any) => ({ dropDownKeyProp: i, dropDownValueProp: i }))
            this.dropDownKeyProp = 'dropDownKeyProp',
              this.dropDownKeyProp = 'dropDownKeyProp'
          }
      } 
      }
    if((changes['selectionModel'] ||(changes['listData'] && this.selectionModel.selected.length))&& this.overflowCharecterCount )
    {
        this.selectedValueAndshowTooltip()
    }  
    
  }
  ngOnDestroy(): void {
    if(this.dropdownSelectionUnsubscribe)
    {
      this.dropdownSelectionUnsubscribe.unsubscribe();
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

setOverlayWidth()
{
  this.contentWidth = this.select.nativeElement.getBoundingClientRect()
}
ngOnInit(): void {
  this.dropdownList$=this.control.valueChanges.pipe(debounceTime(100),
  startWith(''),
  map((value) => this._filter(value || '')),
  tap((value)=>value&&(this.arrowkeyLocation=0))
  )
  this.dropdownSelectionUnsubscribe=this.selectionModel.changed.subscribe((data)=>{
    this.selectedValueAndshowTooltip()
  })
  
}
_filter(value:any ){
  if(value.trim()=='')
    return this.listData
  else
    return this.listData.filter((i:any)=> this._normalizeValue(i[this.dropDownKeyProp]??'').includes(this._normalizeValue(value)))
}
private _normalizeValue(value: string): string {
  return value.toLowerCase().replace(/\s/g, '');
}
focusOut(red :any)
{
  this.onFocusOut.emit();
  this.showDropDown=false
}
selectedDisplay()
{      
  return this.selectionModel.selected.length-1>0?`+(${this.selectionModel.selected.length-1})`:'';
}    
isAllItemsSelected()
{
  return this.listData.length==this.selectionModel.selected.length
}
toggleAllItems(){
  if(this.isAllItemsSelected())
  {
    this.selectionModel.clear()
    return 
  }
  this.selectionModel.select(...this.listData.map((i:any)=>i[this.dropDownValueProp]))

}
 showHideDropDown(){
  if(!this.isDisabled)
  {
    this.showDropDown= !this.showDropDown
    this.contentWidth = this.select.nativeElement.getBoundingClientRect()
    this.control.setValue('')
    if(this.showDropDown)
    {
      setTimeout(() => {
       
        const search= document.getElementById('searchBox')?.getElementsByTagName('input')[0]
        if(search)
          search.focus()
        
      }, 1);
    }
    else{
      this.maindiv.nativeElement.focus()

    }
  }
  }
  tooltipContent(){
   
    return this.listData?.length ? this.selectionModel.selected?.map((i:any)=>
      {
        const value:any=this.listData?.find((j:any)=>j[this.dropDownValueProp]==i)
        if(value)
          return value[this.dropDownKeyProp]
  }).join('\n'): '';

  }
  keydown(event:any){
    if(!this.showDropDown && ['enter','arrowdown'].includes(event.key.toLowerCase()) )
      {
          this.showHideDropDown()
          event.preventDefault();
          event.stopPropgation();
      }
  }
  focusOnCheckBox(index:number)
  {
   const checkbox_=this.checkboxes?.toArray()[index]
   const checkboxElement  =checkbox_?._elementRef.nativeElement.querySelector('input');
   checkboxElement.focus();
   checkbox_?._elementRef.nativeElement.scrollIntoView({
     behavior: 'smooth',
     block: 'center',
     inline:'center'
   });
  }
  clickOnCheckBox(index:number)
  {
    const checkbox_=this.checkboxes?.toArray()[index]
    const data:any=this.listData ?this.listData.find((i:any)=>i[this.dropDownKeyProp]==checkbox_?._elementRef.nativeElement.innerText) :null;
    if(data)
    {
    if(this.popUpRef && this.selectionModel.isSelected(data[this.dropDownValueProp])){
      this.popUpRef().afterClosed().subscribe((res:any) => {
        if(res){
          this.selectionModel.toggle(data[this.dropDownValueProp]);
          this.checkboxes?.toArray().length ?this.checkboxes.toArray()[index]._elementRef.nativeElement.querySelector('input').checked = false: null
        }
      })
  }
  else this.selectionModel.toggle(data[this.dropDownValueProp]);
}
  
    // checkbox_.toggle();
  }

  pressed(event:any){
    if(event.key=='Tab')
      {
        this.showHideDropDown()
      }
    else if(event.key=="ArrowDown" )
      {
        if(this.checkboxes && (this.arrowkeyLocation <  this.checkboxes.toArray().length-1)) {
          this.focusOnCheckBox(++this.arrowkeyLocation)
        // this.cstmpopupEle? this.cstmpopupEle.nativeElement.children[++this.arrowkeyLocation]?.focus():''
      }
        event.preventDefault();
      }
    else if(event.key=="ArrowUp")
    {
        if(this.arrowkeyLocation>0){
        // this.cstmpopupEle? this.cstmpopupEle.nativeElement.children[--this.arrowkeyLocation]?.focus():'' 
        this.focusOnCheckBox(--this.arrowkeyLocation)
        }
        event.preventDefault();
    }
    else if(event.key=='Enter')
    {
      this.clickOnCheckBox(this.arrowkeyLocation)
      // this.cstmpopupEle.nativeElement.children[this.arrowkeyLocation].getElementsByTagName('input')[0]?.click()
      event.preventDefault();
    }
   
    
  }

  //////
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.calculateMaxCharactersWithEllipsis();
      // this.calculateCharacterCount()
      this.selectedValueAndshowTooltip()
       // Create the ResizeObserver after the view has initialized
       this.resizeObserver = new ResizeObserver(() => {
        this.setOverlayWidth();
        this.calculateMaxCharactersWithEllipsis();
      });
  
      // Start observing the input box for width changes
      if (this.select) {
        this.resizeObserver.observe(this.select.nativeElement);
        this.calculateMaxCharactersWithEllipsis();
      }
    }, 0);  ///added due to changeDetection Error
   
  }
    calculateMaxCharactersWithEllipsis(): void {
    const containerWidth = this.mainInp.nativeElement.clientWidth;
    const computedStyle = window.getComputedStyle(this.mainInp.nativeElement);
    const paddingLeft = parseFloat(computedStyle.paddingLeft);
    const paddingRight = parseFloat(computedStyle.paddingRight);
    const borderLeft = parseFloat(computedStyle.borderLeftWidth);
    const borderRight = parseFloat(computedStyle.borderRightWidth);
    // Adjust the available width by subtracting padding and borders
    const availableWidth = containerWidth - paddingLeft - paddingRight - borderLeft - borderRight;

    // Get the font style of the container
    const font = window.getComputedStyle(this.mainInp.nativeElement).font;

    // Create a temporary span to measure the width of the text
    const testSpan = document.createElement('span');
    testSpan.style.font = font;
    testSpan.style.position = 'absolute'; // Off-screen
    document.body.appendChild(testSpan);
  
      testSpan.textContent = `...`;

    const ellipsisWidth = testSpan.offsetWidth;

    // Now let's calculate how many characters can fit without the ellipsis
    let testText = '';
    let charsToFit = 0;

    while (true) {
      testText += 'A'; // Add one character at a time
      testSpan.textContent = testText; // Update the span's text content

      // Check if the span's width exceeds the available width minus the ellipsis width
      if (testSpan.offsetWidth + ellipsisWidth > availableWidth) {
        break;
      }

      charsToFit++; // Count characters that fit
    }
    this.overflowCharecterCount=charsToFit;

    
    // Cleanup the temporary span
    document.body.removeChild(testSpan);

  }

  calculateCharacterCount(): void {
    if (this.mainInp) {
      // Get the width of the input box
      const inputWidth = this.mainInp.nativeElement.offsetWidth;

      // Choose a character's average width (in pixels) based on font size
      const fontSize = window.getComputedStyle(this.mainInp.nativeElement).fontSize;
      const fontWidth = this.getAverageCharacterWidth(fontSize);

      // Calculate how many characters can fit in the input box
      this.overflowCharecterCount = Math.floor(inputWidth / fontWidth);
    }
  }
  
  getAverageCharacterWidth(fontSize: string): number {
    
    const fontSizeInPixels = parseInt(fontSize, 10);
    return fontSizeInPixels * 0.5; 
  }

  getRemaningCountOfValues()
  { if(!this.selectionModel.selected.length || !this.listData.length)
      return 0;
    const selectedList= this.selectionModel.selected?.filter((i:any)=>{
      const value:any=this.listData?.find((j:any)=>j[this.dropDownValueProp]==i)
      if(value)
        return value[this.dropDownKeyProp]
    })
    const x=selectedList?.join('~ ')
    if(x?.substring(this.overflowCharecterCount - 4))
    {
       return x.substring(this.overflowCharecterCount -4)?.replace(/^~?|~$/gm,'')?.split('~')?.reduce((p,c)=>selectedList.includes(c.trim())?p+1:p,0) ?? 0
    }
    return 0;
  }
  selectedValueAndshowTooltip()
  {
    this.selectedValue = (this.listData.length && this.selectionModel.selected.length ) ?  this.selectionModel.selected?.map((i:any)=>{
      let value :any=this.listData.find((j:any) => j[this.dropDownValueProp] == i)  
      if(value)
        return value[this.dropDownKeyProp]
  }).join(', ') : ''
    if(this.selectedValue?.length>=this.overflowCharecterCount)
      {
        this.selectedValue=this.selectedValue.substring(0,this.overflowCharecterCount-4)+'...';
        this.showTooltip=true
      }
    else 
    {
      this.showTooltip=false
    }
    this.remainingCount=this.getRemaningCountOfValues()
  }
  randomFunction(event:any){

  }

  updateSelectionModel(value : any, index : number){
    if(this.popUpRef && this.selectionModel.isSelected(value)){
      this.popUpRef().afterClosed().subscribe((res:any) => {
        if(!res){
          this.checkboxes ? this.checkboxes.toArray()[index]._elementRef.nativeElement.querySelector('input').checked = true: null
          //this.selectionModel.select(value)
        } 
        else this.selectionModel.toggle(value)
      })
  }
  else this.selectionModel.toggle(value)
  }
}
interface dropdownObj {
  dropDownKeyProp: string;
  dropDownValueProp: string;
}
