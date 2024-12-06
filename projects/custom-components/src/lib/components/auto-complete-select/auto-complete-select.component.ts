import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';

@Component({
  selector: 'app-auto-complete-select',
  templateUrl: './auto-complete-select.component.html',
  styleUrls: ['./auto-complete-select.component.scss']
})
export class AutoCompleteSelectComponent implements OnInit, OnChanges {
  @Input() key: string = ''
  @Input() value: string = ''
  @Input() placeholder: string = 'Enter Here'
  @Input() dropDownValue: any = []
  @Input() NodataFound: string = 'No records found'
  @Input() defaultValue: string = ''
  @Input() fromLabAdmin: boolean = false
  disabled: boolean = false
  @ViewChild('dropdownArove') dropdown:any
  @Input() set isDisabled(value: boolean) {
    this.disabled = value
  }
  get isDisabled() { return this.disabled }
  @Output() onSelection: EventEmitter<{ selectedValue: string, selectedObject: dropDownDetials } | undefined> = new EventEmitter();
  @Output() onClearValue = new EventEmitter()
  control = new FormControl('');
  dropDownValue$: any = of([]) ;
  dropdownSubject =  new BehaviorSubject({searchValue : '', showAll: false})
  dropdownSubject$ = this.dropdownSubject.asObservable()
  selectedValue : string = ''
  selectionStyleClass : string = ''
  listOfKeysFromDrp: string[] = []

  constructor() { }

  ngOnInit() {
    // this.isDisabled?document.getElementsByName('input')[0].setAttribute('disabled','true'):document.getElementsByName('input')[0].removeAttribute('disabled');
    if (this.dropDownValue.length) {
      if (this.key == '' && this.value == '') {
        this.dropDownValue = this.dropDownValue?.map((i:any) => ({ key: i, value: i }))
        this.key = 'key',
          this.value = 'value'
      }
      this.listOfKeysFromDrp = this.dropDownValue.map((j:any) => j[this.key])
      // this.dropDownValue = this.dropDownValue?.map((e, i) => ({
      //   ...e
      // }))
    }
    this.control.valueChanges.pipe(
      tap((value:any) =>{
        if(!value) this.onClearValue.emit()
        if(this.selectedValue && !this.listOfKeysFromDrp.includes(value)) this.onSelection.emit(undefined)
      }),
      startWith(''),
      // map((value) => this._filter(value || ''))
    ).subscribe((res) => {
      this.dropdownSubject.next({searchValue: res || '', showAll: false})
    })

    this.dropDownValue$ = this.dropdownSubject$.pipe(
      map((value) => {
        if(value.showAll) return this.dropDownValue
        else return this._filter(value.searchValue || '')
    })
    )

    this.selectionStyleClass = this.fromLabAdmin ? 'enable-labadmin-selection' : 'enable-selection'
  }

  private _filter(value: string): any {
    if (value.length && this.dropDownValue.length) {
      const filterValue = this._normalizeValue(value);
      return this.dropDownValue.filter((dropdown:any) =>
        this._normalizeValue(dropdown[this.key]).includes(filterValue)
      );
    }
    return this.dropDownValue
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  openOrCloseDD(event: Event, trigger: MatAutocompleteTrigger, ref: any) {
    event.stopPropagation();
    trigger.panelOpen ? trigger.closePanel() : ref.focus();
    if (trigger.panelOpen){
      ref.click()
      this.onInputFocus()
    }
  }

  onInputFocus(){
    //this.dropDownValue$ = of(this.dropDownValue)
    this.dropdownSubject.next({searchValue: this.control.value || '', showAll: true})
  }

  emitValue(e:any) {
    this.control.setValue(e.option.value[this.key])
    this.selectedValue = e.option.value[this.key]
    this.onSelection.emit({ selectedValue: e.option.value[this.value], selectedObject: e.option.value })
  }
  getUniqueListItems(lis: any, key: any) {
    return [...new Map(lis.map((item: any) => [item[key], item])).values()]
  }

  ngOnChanges(changes: SimpleChanges): void {
    
    if (changes['dropDownValue'] && this.dropDownValue.length) {
      if (this.key == '' && this.value == '') {
        this.dropDownValue = this.dropDownValue?.map((i:any) => ({ key: i, value: i }))
        this.key = 'key',
          this.value = 'value'
      }
      
      this.listOfKeysFromDrp = this.dropDownValue.map((j:any) => j[this.key])
    }
    if (changes['defaultValue'] && this.control.value != this.defaultValue) {
      this.control.setValue(this.defaultValue === '' ? null : this.dropDownValue.filter((j:any) => j[this.value] === this.defaultValue)[0][this.key])
    }
    this.disabled ? this.control.disable() : this.control.enable()
  }

  clearSearch(){
    this.control.setValue(null)
  }
}

export interface dropDownDetials {
   key: string,  
   value: string
}
