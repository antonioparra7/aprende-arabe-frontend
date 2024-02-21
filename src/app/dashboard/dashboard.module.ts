import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError } from 'rxjs';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { StatisticsComponent } from './statistics/statistics.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgApexchartsModule } from 'ng-apexcharts';
import { LessonComponent } from './lesson/lesson.component';
import { TestComponent } from './test/test.component';
import { TutorialComponent } from './tutorial/tutorial.component';



@NgModule({
  declarations: [StatisticsComponent, LessonComponent, TestComponent, TutorialComponent],
  imports: [
    CommonModule,
    NgApexchartsModule
  ]
})
export class DashboardModule { }
