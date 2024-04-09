import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatorComponent } from './translator.component';
import {MatInputModule} from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [TranslatorComponent],
  imports: [
    CommonModule, MatSelectModule, MatButtonModule, MatInputModule, FormsModule
  ],
  exports: [TranslatorComponent]
})
export class TranslatorModule { }
