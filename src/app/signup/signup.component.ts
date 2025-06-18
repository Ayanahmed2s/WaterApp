import { Component } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, Validators, FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';

 interface categories {
  value: string;
  viewValue: string;
}
interface customertype {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-signup',
    imports: [FormsModule,CommonModule,RouterModule,MatCardModule,MatSelectModule,MatIconModule,MatInputModule,MatButtonModule,MatFormFieldModule,ReactiveFormsModule],
    templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})

export class SignupComponent {
 signupForm: FormGroup;
  hide = true;

  types = [
    { value: 'Residential', viewValue: 'Residential' },
    { value: 'Commercial', viewValue: 'Commercial' },
    { value: 'Special', viewValue: 'Special' },
  ];

  Category = [
    { value: 'Permanent', viewValue: 'Permanent' },
    { value: 'Temporary', viewValue: 'Temporary' },
  ];

  constructor(private fb: FormBuilder, private supabaseService: SupabaseService,private router:Router) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      address:['', [Validators.required]],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      customer_type: ['', Validators.required],
      category: ['', Validators.required],
    
    });
  }

  async onSubmit() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    const { name,address, phone, email, password, customer_type, category } = this.signupForm.value;

    const { data, error } = await this.supabaseService.signUp(this.signupForm.value);

    if (error) {
      console.error('Signup error:', error.message);
      return;
    }

    const userId = data.user?.id;
    if (!userId) {
      console.error('Signup returned no user ID.');
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    localStorage.setItem('pendingProfile', JSON.stringify({
      name,
      address,
      phone,
      email,
      customer_type,
      category
    }));
  this.router.navigate(['/login']);
    alert('Signup successful! Check your email for verification.');
  }
}