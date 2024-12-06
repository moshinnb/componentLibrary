import { Component, EventEmitter, Input, KeyValueDiffers, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';

// import { debounce, debounceTime } from 'rxjs';

@Component({
  selector: 'app-search-box',
  template: `
   <div class="flex searchBox" [class.search-padding]="!removeSearchIcon" [class.cusror-not-allowed]="isDisabled">
    <div *ngIf="!removeSearchIcon" class="mr-2 d-flex" [ngClass]="className">
      <img src="../assets/icons/SearchIcon.png" alt="search" class="material-icons md-24 icon " >
    </div>
    <input type="text" [class]="removeSearchIcon ? 'pl-2' : 'input-padding'" class="align-items-center" [formControl]="formContol" [class.cusror-not-allowed]="isDisabled" [placeholder]="placeHolder" >
    <div class="d-flex">
      <img *ngIf="formContol.value" (click)="this.isDisabled ? null : clearSearch()" src="/assets/icons/Close_black.svg" alt="Close" class="material-icons md-24 icon close" >
    </div>
    </div>
  `,
  styles: [`
  .searchBox{
    display: flex;
    align-items: center;
    border: 1.6px solid #8b87879e;
    border-radius: 3px;
    font-size: 12px;
    font-family: 'LabAdminFont';

    input{
      border:none;
      width:100%;
      outline-style: none;
    }

    div:first-child{
      border-right: 1.6px solid #FB8500;
    }

    img{
      margin: 0px 7px; 
      width: 16px; 
      height: 16px;
    }
  }

  .search-padding{
    padding: 2.5px 0px !important;
  }

  .input-padding{
    padding-left: 2px !important;
  }

  .close{
    width: 10px !important;
  }

  
  .cusror-not-allowed{
    cursor : not-allowed;
  }
  `]
})
export class SearchBoxComponent implements OnInit ,OnChanges {
 
 
  @Input() placeHolder : string = 'Type To Search Here'
  @Input() className : any = ''
  @Input() isDisabled : boolean = false
  @Output() enteredValue=new EventEmitter<string|null>()
  @Input() searchText : string = '';
  formContol:any= new FormControl('');
  @Input() debounceTime = 100
  @Input() removeSearchIcon = false
  
  ngOnInit(): void {
    this.formContol.valueChanges.pipe(debounceTime(this.debounceTime)).subscribe((data:any)=>{
      if(data?.trim()=='')
      {
        this.enteredValue.emit(data);
      }
      else{
      data == this.searchText ? null:  this.enteredValue.emit(data);}
    }
  )
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['searchText']&&changes['searchText']?.currentValue!=this.formContol.value)
    {
      this.formContol.setValue(changes['searchText'].currentValue)
    }

    if(changes['isDisabled']){
      this.isDisabled ? this.formContol.disable() : this.formContol.enable()
    }
  }

  keyPressed(text:string)
  {
    this.enteredValue.emit(text);
  }

  clearSearch(){
    this.formContol.setValue('')
    // this.keyPressed('')
  }
}
