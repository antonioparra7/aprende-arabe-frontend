import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Level } from 'src/app/entities/level';
import { LevelService } from 'src/app/services/level.service';

@Component({
  selector: 'app-levels',
  templateUrl: './levels.component.html',
  styleUrls: ['./levels.component.css']
})
export class LevelsComponent implements OnInit {
  public levels:Level[];

  constructor(private levelService:LevelService) {}

  ngOnInit(): void {
    this.levelService.getLevels().subscribe((data) => {
      this.levels = data;
    });
  }

  getImageSrc(imageData: any): string {
    return `data:image/png;base64,${imageData}`;
  }
}
