import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatStepperModule} from '@angular/material/stepper';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { HeaderComponent } from './layouts/header/header.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { LoginComponent } from './login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { RestorePasswordComponent } from './restore-password/restore-password.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SettingsComponent } from './dashboard/settings/settings.component';
import { StatisticsComponent } from './dashboard/statistics/statistics.component';
import { LevelsComponent } from './dashboard/levels/levels.component';
import { ThemesComponent } from './dashboard/themes/themes.component';
import { LessonsComponent } from './dashboard/lessons/lessons.component';
import { TutorialsComponent } from './dashboard/tutorials/tutorials.component';
import { TestsComponent } from './dashboard/tests/tests.component';
import { TranslatorComponent } from './dashboard/translator/translator.component';
import { LevelsModule } from './dashboard/levels/levels.module';
import { ThemesModule } from './dashboard/themes/themes.module';
import { LessonsModule } from './dashboard/lessons/lessons.module';
import { LessonComponent } from './dashboard/lesson/lesson.component';
import { TestComponent } from './dashboard/test/test.component';
import { TutorialComponent } from './dashboard/tutorial/tutorial.component';
import { LessonModule } from './dashboard/lesson/lesson.module';
import { RegisterModule } from './register/register.module';
import { LoginModule } from './login/login.module';
import { RestorePasswordModule } from './restore-password/restore-password.module';
import { StatisticsModule } from './dashboard/statistics/statistics.module';
import { TestsModule } from './dashboard/tests/tests.module';

const routes: Routes = [
  {path:'',redirectTo:'/home',pathMatch:'full'},
  {path:'home',component:HomeComponent},
  {path:'login',component:LoginComponent},
  {path:'register',component:RegisterComponent},
  {path:'restore-password',component:RestorePasswordComponent},
  {path:'admin',component:AdminPanelComponent},
  {path:'dashboard',component:DashboardComponent,
    children: [
      {path:'',component:StatisticsComponent},
      {path:'statistics',component:StatisticsComponent},
      {path:'levels',component:LevelsComponent},
      {path:'themes',component:ThemesComponent},
      {path:'lessons/:themeId',component:LessonsComponent},
      {path:'lesson/:lessonId',component:LessonComponent},
      {path:'tests',component:TestsComponent},
      {path:'test/:testId',component:TestComponent},
      {path:'translator',component:TranslatorComponent},
      {path:'tutorials',component:TutorialsComponent},
      {path:'tutorials/:tutorialId',component:TutorialComponent},
      {path:'settings',component:SettingsComponent}
  ]}
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    RestorePasswordComponent,
    AdminPanelComponent,
    DashboardComponent,
    SettingsComponent,
    TranslatorComponent
  ],
  imports: [
    RegisterModule,
    LoginModule,
    RestorePasswordModule,
    StatisticsModule,
    LevelsModule,
    ThemesModule,
    LessonsModule,
    LessonModule,
    TestsModule,
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatGridListModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatStepperModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
