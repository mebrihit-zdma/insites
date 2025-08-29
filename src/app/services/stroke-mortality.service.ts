import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface StrokeMortalityData {
  stateRate: number;
  nationalRate: number;
  labels: string[];
  backgroundColor: string[];
}

@Injectable({
  providedIn: 'root'
})
export class StrokeMortalityService {
  private strokeMortalitySubject = new BehaviorSubject<StrokeMortalityData>({
    stateRate: 28.5,
    nationalRate: 29.4,
    labels: ['North Carolina', 'National Average'],
    backgroundColor: ['#075300', '#E7F6E5']
  });

  constructor() { }

  // Observable for stroke mortality data
  getStrokeMortalityData(): Observable<StrokeMortalityData> {
    return this.strokeMortalitySubject.asObservable();
  }

  // Update stroke mortality data
  updateStrokeMortalityData(data: StrokeMortalityData) {
    console.log('StrokeMortalityService: Updating data to:', data);
    this.strokeMortalitySubject.next(data);
  }

  // Get current stroke mortality data value
  getCurrentStrokeMortalityData(): StrokeMortalityData {
    return this.strokeMortalitySubject.value;
  }
}
