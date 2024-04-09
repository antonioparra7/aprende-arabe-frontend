import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { TutorialsComponent } from './tutorials.component';



@NgModule({
  declarations: [TutorialsComponent],
  imports: [
    CommonModule, MatTableModule
  ],
  exports: [TutorialsComponent]
})
export class TutorialsModule { }
