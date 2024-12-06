import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ControlContainer, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-toggle-switch',
  template: `
  <span  [ngClass]="labelActivetext?.toLowerCase()=='active' ? 'label-text' : null ">{{_CheckedStatus ? labelActivetext : labelInactivetext }}</span>
  <span [class.ml-2]="labelActivetext.length" *ngIf="formcontrolname" >
  <label class="switch" [id]="id">
      <input #inp type="checkbox" [checked]="_CheckedStatus" (click)="emitValue($event)"  [formControlName]="formcontrolname"  [attr.disabled]="isDisable"  />
      <span class="slider round" [ngClass]="isDisable ? 'disable' : null "></span>
  </label>
  </span>
  <span  class="ml-2" *ngIf="!formcontrolname">
  <label  class="switch" [id]="id">
      <input #inp type="checkbox" [checked]="_CheckedStatus" [disabled]="isDisable" (click)="emitValue($event)"   />
      <span class="slider round" [ngClass]="isDisable ? 'disable' : null "></span>
  </label>
  </span>

  `,
  styleUrls: ['./switch.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class SwitchComponent implements OnChanges, OnInit {

  constructor(
    private _fb: FormGroupDirective
  ) { }

  ngOnInit(): void {
    this._CheckedStatus = this.isChecked

    if (this.formcontrolname) {
      this._CheckedStatus = this._fb.control.get(this.formcontrolname)?.value
      this._fb.control.get(this.formcontrolname)?.valueChanges.subscribe((res:any) => {
        this._CheckedStatus = res
      })

      if (this.isDisable) this._fb.control.get(this.formcontrolname)?.disable()
      else this._fb.control.get(this.formcontrolname)?.enable()
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this._CheckedStatus = this.isChecked

    if (this.formcontrolname) {
      if (changes['isDisable']) {
        if (this.isDisable) this._fb.control.get(this.formcontrolname)?.disable()
        else this._fb.control.get(this.formcontrolname)?.enable()
      }
    }
  }
  
  @Input() isChecked: boolean = false
  @Input() isDisable: boolean = false
  @Input('type') id: '' | 'secondary' | 'secondary-primary' | 'admin-primary' = ''
  @Input() formcontrolname: string | null = null
  @Output() clicked = new EventEmitter()
  @Input() labelActivetext: any = ''
  @Input() labelInactivetext: any = ''
  _CheckedStatus: boolean = false
  //@ViewChild('inp') input
  //valueHolder : boolean = false


  emitValue(e: any) {
    this._CheckedStatus = e.target.checked
    //this.valueHolder = this.isChecked
    //let x = this.input.nativeElement
    this.clicked.emit(e.target.checked)
  }
}
