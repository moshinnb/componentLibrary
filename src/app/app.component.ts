import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl,  FormGroup,  FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
 
  title = 'componentLibrary';
  selctionmodel:any =new SelectionModel(true,['mohsin']);
  frmGroup=this._fb.group({
    customSelect:[''],
    customDate:[''],
    customInput:['']

  })
  constructor(private _fb:FormBuilder) {
   
    
  }
  formControl=new FormControl('')
  ngOnInit(): void {
    console.log(this.selctionmodel.selected)
  }
}
