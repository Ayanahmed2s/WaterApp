import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { SupabaseService } from '../services/supabase.service';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatSelectModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginform: FormGroup;
  hide = true;
  isBrowser = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private supabaseService: SupabaseService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    this.loginform = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  async onSubmit() {

    if (this.loginform.invalid) {
      this.loginform.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginform.value;

    try {
      const { data, error } = await this.supabaseService.login({ email, password });

      if (error) {
        console.error('Login error:', error.message);
        alert('Login failed: ' + error.message);
        return;
      }

      const userId = data.user?.id;
      if (!userId) {
        console.error('Login returned no user ID.');
        return;
      }

      // 🔍 Load and update pending profile if it exists
      const profileString = localStorage.getItem('pendingProfile');
      if (profileString) {
        const profileFields = JSON.parse(profileString);

        const { error: updateError } = await this.supabaseService.updateProfileData(
          userId,
          profileFields
        );

        if (updateError) {
          console.error('Profile update failed:', updateError.message);
        } else {
          console.log('Profile updated.');
          localStorage.removeItem('pendingProfile');
        }
      }

      this.router.navigate(['/dashboard']);
      alert('Login successful!');
    } catch (err: any) {
      console.error('Unexpected login error:', err.message || err);
    }
  }
}
