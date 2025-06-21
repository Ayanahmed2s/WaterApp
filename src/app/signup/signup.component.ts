import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { async } from 'rxjs';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-signup',
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
    MatFormFieldModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  signupForm: FormGroup;
  hide = true;
  isBrowser: boolean = false;

  types = [
    { value: 'Residential', viewValue: 'Residential' },
    { value: 'Commercial', viewValue: 'Commercial' },
    { value: 'Special', viewValue: 'Special' },
  ];

  Category = [
    { value: 'Permanent', viewValue: 'Permanent' },
    { value: 'Temporary', viewValue: 'Temporary' },
  ];

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      customer_type: ['', Validators.required],
      category: ['', Validators.required],
    });
  }

  async onSubmit() {
    if (!this.isBrowser) return;

    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    const formValue = this.signupForm.value;

    try {
      const { data, error } = await this.supabaseService.signUp(formValue);

      if (error) {
        console.error('Signup error:', error.message);
        alert('Signup failed: ' + error.message);
        return;
      }

      const userId = data.user?.id;
      if (!userId) {
        console.error('Signup returned no user ID.');
        return;
      }

      // Store remaining data in localStorage safely (in browser)
      localStorage.setItem('pendingProfile',JSON.stringify({
          name: formValue.name,
          address: formValue.address,
          phone: formValue.phone,
          email: formValue.email,
          customer_type: formValue.customer_type,
          category: formValue.category,
        })
      );

      this.router.navigate(['/login']);
      alert('Signup successful! Check your email for verification.');
    } catch (err: any) {
      console.error('Unexpected error during signup:', err.message || err);
    }
  }
}
