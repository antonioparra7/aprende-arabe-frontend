import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import { LessonsComponent } from './lessons.component';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [LessonsComponent],
  imports: [
    CommonModule, MatTableModule, MatButtonModule
  ],
  exports: [LessonsComponent]
})
export class LessonsModule { }
