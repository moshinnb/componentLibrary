import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {  ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LibraryComponentsComponent } from './library-components/library-components.component';
import { CustomComponentsModule } from "../../projects/custom-components/src/lib/custom-components.module";

@NgModule({
  declarations: [
    AppComponent,
    LibraryComponentsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    CustomComponentsModule,
    
],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
