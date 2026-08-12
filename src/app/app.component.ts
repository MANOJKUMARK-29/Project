import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginformComponent } from './loginform/loginform.component';
import { LoadingService } from './services/loading.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginformComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'project1';
  loading = false;
  constructor( private loadingService: LoadingService) {
}
ngOnInit() : void {
  this.loadingService.show();
  setTimeout(() =>{
    this.loadingService.hide();
  }, 1000);

}}