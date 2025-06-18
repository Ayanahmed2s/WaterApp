import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SidetopbarComponent } from "./sidetopbar/sidetopbar.component";
import { SignupComponent } from "./signup/signup.component";
import { LoginComponent } from "./login/login.component";
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule,
    RouterModule,
    MatSlideToggleModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule, SidetopbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  isSidetopbar: boolean | undefined;
  title = 'water';
IsLoginPage:  boolean | undefined;
IsSignupPage:  boolean | undefined;
   constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = event.url.split('?')[0]; // ✅ Ignore query params
        this.isSidetopbar = url === '/sidetopbar';
        this.IsLoginPage = url === '/login';
        this.IsSignupPage = url === '/signup';
      }
    });
  }
}
