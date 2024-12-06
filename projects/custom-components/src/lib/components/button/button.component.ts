import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit{
  @Input() type : string = 'button'
  @Input() buttonclass : string = 'general'
  @Input() faIconName : any = ''
  @Input() isDisabled : any
  @Input() isRightButtonDisabled : boolean = false
  @Input() buttonHoverText : string = ''
  @Input() multiple : boolean = false
  @Input() buttonText : string = ''
  @Input() image : any= ''
  @Input() customClass : string = ''
  @Output() rightBtnClick = new EventEmitter()
  @Output() leftBtnClick = new EventEmitter()
  @Input() hideLeftBtn:boolean=false
  @Input() hideRightBtn:boolean=false
  
  ngOnInit(): void {
    if(this.customClass) this.buttonclass = `${this.buttonclass} ${this.customClass}`
  }

}
