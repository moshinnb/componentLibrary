import {  NgModule } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CustomComponentsComponent } from './custom-components.component';
import { CustomInputChipComponent } from './components/custom-input-chip/custom-input-chip.component';
import { CustomInputComponent } from './components/custom-input/custom-input.component';
import { CustomSelectComponent } from './components/custom-select/custom-select.component';
import { CustomDropdownCheckboxComponent } from './components/custom-dropdown-checkbox/custom-dropdown-checkbox.component';
import { ButtonComponent } from './components/button/button.component';
import { AutoCompleteSelectComponent } from './components/auto-complete-select/auto-complete-select.component';
import { InputAutoCompleteComponent } from './components/input-auto-complete/input-auto-complete.component';
import { SwitchComponent } from './components/switch/switch.component';
import { FileDragDropDirective } from './directives/file-drag-drop.directive';
import { TooltipEllipsisDirective } from './directives/tooltip-ellipsis.directive';
import { DisplaySelectedValueDirective } from './directives/display-selected-value.directive';
import { FormatDatePipe } from './pipes/formate-date/format-date.pipe';
import { AsyncloaderPipe } from './pipes/asyncloader.pipe';
import { HighlightTextPipe } from './pipes/highlight-text.pipe';
import { ReplaceStringPipe } from './pipes/replace-string.pipe';
import { OverlayModule } from '@angular/cdk/overlay';
import {  FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {  MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {  MatInputModule } from '@angular/material/input';
import { SearchBoxComponent } from './components/search-box/search-box.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CustomDatetimeComponent } from './components/custom-datetime/custom-datetime.component';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { MatFormFieldModule } from '@angular/material/form-field';






@NgModule({
  declarations: [
    CustomComponentsComponent,
    CustomInputChipComponent,
    CustomInputComponent,
    CustomSelectComponent,
    CustomDropdownCheckboxComponent,

    ButtonComponent,
    CustomDatetimeComponent,
    AutoCompleteSelectComponent,
    InputAutoCompleteComponent,
    SearchBoxComponent,
    SwitchComponent,


    FileDragDropDirective,
    TooltipEllipsisDirective,
    DisplaySelectedValueDirective,

    FormatDatePipe,
    AsyncloaderPipe,
    HighlightTextPipe,
    ReplaceStringPipe

  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    OverlayModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    NgxMaskDirective, 
    NgxMaskPipe,
    MatRippleModule
    
   
  ],
  exports: [
    CustomComponentsComponent,
    CustomInputChipComponent,
    CustomInputComponent,
    CustomSelectComponent,
    CustomDropdownCheckboxComponent,
    ButtonComponent,
    CustomDatetimeComponent,
    AutoCompleteSelectComponent,
    InputAutoCompleteComponent,
    SearchBoxComponent,
    SwitchComponent,


    FileDragDropDirective,
    TooltipEllipsisDirective,
    DisplaySelectedValueDirective,

    FormatDatePipe,
    AsyncloaderPipe,
    HighlightTextPipe,
    ReplaceStringPipe,

  ],
  providers:[
    provideNgxMask()
   ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CustomComponentsModule { }
