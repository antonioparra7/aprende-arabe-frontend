import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LevelsComponent } from './levels.component';



@NgModule({
  declarations: [LevelsComponent],
  imports: [
    CommonModule
  ],
  exports:[LevelsComponent]
})
export class LevelsModule { }
