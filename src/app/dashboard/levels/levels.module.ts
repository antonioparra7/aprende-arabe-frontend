import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LevelsComponent } from './levels.component';
import {MatButtonModule} from '@angular/material/button';


@NgModule({
  declarations: [LevelsComponent],
  imports: [
    CommonModule, MatButtonModule
  ],
  exports:[LevelsComponent]
})
export class LevelsModule { }
