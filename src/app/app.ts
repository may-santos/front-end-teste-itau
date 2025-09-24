import { Component } from '@angular/core';
import { AuthButtonComponent } from './core/auth/auth-button.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AuthButtonComponent, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

}
