import { Injectable } from '@angular/core';
import { QualificationService } from './qualification.service';
import { RatingService } from './rating.service';
import { User } from '../entities/user';
import { Rating } from '../entities/rating';
import { Qualification } from '../entities/qualification';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  qualifications: Qualification[];
  ratings: Rating[];
  constructor(private qualificationService:QualificationService, private ratingService:RatingService) { }
}
