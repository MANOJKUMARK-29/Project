import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  constructor() { }

  private loadingSubject = new BehaviorSubject<boolean>(true);
  loading$ : Observable<boolean> = this.loadingSubject.asObservable();
  show(): void{
    this.loadingSubject.next(false);
  }
  hide(): void{
    this.loadingSubject.next(false);
  }
}
