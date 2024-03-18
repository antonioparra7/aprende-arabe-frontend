import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgApexchartsModule } from 'ng-apexcharts';
import { StatisticsComponent } from './statistics.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule} from '@angular/material/card';



@NgModule({
  declarations: [StatisticsComponent],
  imports: [
    CommonModule, BrowserModule,NgApexchartsModule, MatCardModule, MatButtonModule
  ],
  exports: [StatisticsComponent],
  bootstrap: [StatisticsComponent]
})
export class StatisticsModule { }
