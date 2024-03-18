import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LessonComponent } from './lesson.component';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [LessonComponent],
  imports: [
    CommonModule, MatButtonModule
  ],
  exports: [LessonComponent]
})
export class LessonModule { }
