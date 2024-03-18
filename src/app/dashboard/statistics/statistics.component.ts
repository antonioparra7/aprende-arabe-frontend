import { Component, ViewChild} from '@angular/core';

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ChartComponent,
  ApexPlotOptions
} from "ng-apexcharts";
import { forkJoin } from 'rxjs';
import { User } from 'src/app/entities/user';
import { DashboardService } from 'src/app/services/dashboard.service';
import { LessonService } from 'src/app/services/lesson.service';
import { QualificationService } from 'src/app/services/qualification.service';
import { RatingService } from 'src/app/services/rating.service';
import { TestService } from 'src/app/services/test.service';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  plotOptions: ApexPlotOptions;
  colors: any;
};

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent {
  public user: User;
  public dataCompleted: boolean = false;

  // Grafico tests realizados
  @ViewChild("testsChart") testsChart!: ChartComponent;
  public testsChartOptions: Partial<ChartOptions>;
  // Grafico porcentaje tests realizados
  @ViewChild("percentageTestsChart") percentageTestsChart!: ChartComponent;
  public percentageTestsChartOptions: Partial<ChartOptions>;
  // Grafico lecciones valoradas
  @ViewChild("lessonsChart") lessonsChart!: ChartComponent;
  public lessonsChartOptions: Partial<ChartOptions>;
  // Grafico porcentaje lecciones valoradas
  @ViewChild("percentageLessonsChart") percentageLessonsChart!: ChartComponent;
  public percentageLessonsChartOptions: Partial<ChartOptions>;

  constructor(private dashboardService: DashboardService, private testService: TestService,
    private lessonService: LessonService, private qualificationService: QualificationService,
    private ratingService: RatingService) {

    this.testsChartOptions = {
      series: [],
      chart: {
        width: 370,
        type: "pie"
      },
      labels: [],
      responsive: [
        {
          breakpoint: 370,
          options: {
            chart: {
              width: 370
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ],
      colors: ['#FFEB3B', '#E91E63']
    };
    this.percentageTestsChartOptions = {
      series: [],
      chart: {
        height: 210,
        type: "radialBar"
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: "70%"
          }
        }
      },
      labels: []
    };
    this.lessonsChartOptions = {
      series: [],
      chart: {
        width: 370,
        type: "donut"
      },
      labels: [],
      responsive: [
        {
          breakpoint: 370,
          options: {
            chart: {
              width: 370
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
    this.percentageLessonsChartOptions = {
      series: [],
      chart: {
        height: 210,
        type: "radialBar"
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: "70%"
          }
        }
      },
      labels: []
    };
  };

  ngOnInit(): void {
    this.user = this.dashboardService.getUser();
    if (this.user?.id == undefined) {
      const userData = localStorage.getItem('user');
      if (userData) {
        this.user = JSON.parse(userData);
      }
    }

    const $tests = this.testService.getTests();
    const $lessons = this.lessonService.getLessons();
    const $qualificationsUser = this.qualificationService.getQualificationsByUserId(this.user.id);
    const $ratingsUser = this.ratingService.getRatingsByUserId(this.user.id);

    forkJoin([$tests,$lessons,$qualificationsUser,$ratingsUser]).subscribe(([tests,lessons,qualificationsUser,ratingsUser]) => {

       
        // Grafico tests realizados
        this.testsChartOptions.series = [qualificationsUser.length, tests.length - qualificationsUser.length];
        this.testsChartOptions.labels = ["Tests realizados", "Tests sin realizar"];
         
        // Grafico porcentaje tests realizados
        const percentageTests = this.calculatePercentage(qualificationsUser.length, tests.length);
        this.percentageTestsChartOptions.series = [percentageTests];
        this.percentageTestsChartOptions.labels = ["Porcentaje de tests realizados"];

        // Grafico lecciones valoradas
        this.lessonsChartOptions.series = [ratingsUser.length, lessons.length - ratingsUser.length];
        this.lessonsChartOptions.labels = ["Lecciones valoradas", "Lecciones sin valorar"];

        // Grafico porcentaje lecciones valoradas
        const percentageRatings = this.calculatePercentage(ratingsUser.length, lessons.length);
        this.percentageLessonsChartOptions.series = [percentageRatings];
        this.percentageLessonsChartOptions.labels = ["Porcentaje de lecciones valoradas"];
        this.dataCompleted = true;
    });
    
  }
  calculatePercentage(num: number, total: number): number {
    return (total > 0) ? Math.floor((num * 100) / total) : 0;
  }
}
