import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
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
  title = 'water';
  isLoginOrSignup = false;
  isBrowser = false;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (!this.isBrowser) return;

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = event.url.split('?')[0];
        this.isLoginOrSignup = ['/login', '/signup'].includes(url);
      }
    });
  }
}
