import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import { LessonsComponent } from './lessons.component';


@NgModule({
  declarations: [LessonsComponent],
  imports: [
    CommonModule, MatTableModule
  ],
  exports: [LessonsComponent]
})
export class LessonsModule { }
