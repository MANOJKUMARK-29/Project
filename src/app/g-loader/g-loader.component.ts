import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../services/loading.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-g-loader',
  standalone: true,
  imports: [ CommonModule],
  templateUrl: './g-loader.component.html',
  styleUrl: './g-loader.component.css'
})
export class GLoaderComponent {
  loading$: Observable<boolean>;

  constructor(private readonly loadingService: LoadingService) {
    this.loading$ = this.loadingService.loading$;
  }
}
