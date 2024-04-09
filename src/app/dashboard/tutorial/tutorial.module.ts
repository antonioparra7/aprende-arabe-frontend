import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TutorialComponent } from './tutorial.component';
import { YouTubePlayerModule } from '@angular/youtube-player';



@NgModule({
  declarations: [TutorialComponent],
  imports: [
    CommonModule, YouTubePlayerModule
  ],
  exports:[TutorialComponent]
})
export class TutorialModule { }
