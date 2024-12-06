import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-input-auto-complete',
  templateUrl: './input-auto-complete.component.html',
  styleUrls: ['./input-auto-complete.component.scss']
})
export class InputAutoCompleteComponent implements OnChanges {
  @ViewChild('ele') ele: ElementRef = {} as ElementRef;
  @Input() type: string = 'text'
  @Input() labelValue: string = ''
  @Input() required: boolean = false
  @Input() isReadOnly: boolean = false
  @Input() placeholder: string = ''
  @Input() validateField: boolean = false
  @Input() InvalidMessage: string = ''
  @Input() containerClass: string = 'mb-3 me-3'
  @Input() value: string = ''
  @Input() enableClear: boolean = false
  @Input() isFormValid: boolean | null = true
  control = new FormControl('');
  @Input() dropDownValue: string[] = [];
  @Output() onSelected = new EventEmitter()
  @Output() onKeyUpChanges = new EventEmitter()
  isOpen = false
  dropDownValue1: string[] = [];
  @Input() id: string = ''

  contentwidth = 0
  centered = false;
  disabled = false;
  unbounded = false;
  radius: number = 10;
  color: string = 'primary';

  toggle(event: any = null) {
    if (event) {
      (event.keyCode === 8 || event.keyCode === 46) && !this.isOpen ? this.onSelected.emit(this.ele.nativeElement.value) : ''
    }
    this.contentwidth = this.ele.nativeElement.clientWidth
    !this.isReadOnly ? this.dropDownValue1 = this._filter(this.ele.nativeElement.value) : ''
  }

  ngOnInit(): void {
    this.control.patchValue(this.value)
  }

  private _filter(value: string) {
    this.onKeyUpChanges.emit(value);
    if (value.length && this.dropDownValue.length) {
      const filterValue = this._normalizeValue(value.toLocaleLowerCase());
      return this.dropDownValue.filter((i) => i.toString().toLowerCase().includes(value.toLowerCase()))
    }
    return this.dropDownValue
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }


  ngOnChanges(changes: SimpleChanges): void {
    this.control.patchValue(this.value)
  }

  onFocus() {
    this.isOpen = true;
  }
  
  focusedIndex = -1;

  onKeyDown(event: KeyboardEvent) {
    if (this.isOpen) {
      if (event.key === 'ArrowDown') {
        this.focusedIndex = (this.focusedIndex + 1) % this.dropDownValue1.length;
        event.preventDefault();
      } else if (event.key === 'ArrowUp') {
        this.focusedIndex = (this.focusedIndex - 1 + this.dropDownValue1.length) % this.dropDownValue1.length;
        event.preventDefault();
      } else if (event.key === 'Enter') {
        if (this.focusedIndex >= 0 && this.focusedIndex < this.dropDownValue1.length) {
          this.selectItem(this.dropDownValue1[this.focusedIndex]);
        }
      } else if (event.key === 'Escape') {
        this.isOpen = false;
      }
    }
  }

  onKeyUp(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.isOpen = false;
    }
  }


  selectItem(value: string) {
    this.onKeyUpChanges.emit(value)
    this.control.patchValue(value);
    this.onSelected.emit(value);
    this.isOpen = false;
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
    this.ele.nativeElement.focus();
  }

  onBackdropClick() {
    this.isOpen = false;
    this.onSelected.emit(this.ele.nativeElement.value);
  }

  clearValue(){
    this.onKeyUpChanges.emit('')
    this.control.patchValue('');
    this.onSelected.emit('');
  }
}

