import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationStart, NavigationEnd, NavigationError, NavigationCancel } from '@angular/router';
import { GLoaderComponent } from './g-loader/g-loader.component';
import { LoadingService } from './services/loading.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GLoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'project1';

  constructor(private router: Router, private loadingService: LoadingService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.loadingService.show();
      }
            if (event instanceof NavigationEnd) {

              
        setTimeout(() => {

          this.loadingService.hide();

          console.log('Loader stopped');

        }, 5000);
      }

      if (event instanceof NavigationError || event instanceof NavigationCancel) {
        this.loadingService.hide();
      }
    });
  }
}
