import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  constructor() { }
  private loadingSubject = new BehaviorSubject<boolean>(false);

  loading$ = this.loadingSubject.asObservable();

  show(): void {
    setTimeout(() => {
      this.loadingSubject.next(true);
    }, 20)

  }

  hide(): void {

    setTimeout(() => {
      this.loadingSubject.next(false);
    }, 2000)
  }
}
