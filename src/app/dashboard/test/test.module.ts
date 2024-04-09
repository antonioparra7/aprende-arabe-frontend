import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestComponent } from './test.component';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [TestComponent],
  imports: [
    CommonModule, MatButtonModule, MatRadioModule, FormsModule
  ],
  exports: [TestComponent]
})
export class TestModule { }
