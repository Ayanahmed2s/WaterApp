import { Component ,inject} from '@angular/core';
import { SupabaseService } from '../services/supabase.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, Validators, FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Router} from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
@Component({
  selector: 'app-login',
  imports: [FormsModule,CommonModule,RouterModule,MatCardModule,MatSelectModule,MatIconModule,MatInputModule,MatButtonModule,MatFormFieldModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
loginform: FormGroup;
  hide = true;

  constructor(private fb: FormBuilder,private router :Router, private supabaseService: SupabaseService) {
    this.loginform = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  } 

  async onSubmit() {
    if (this.loginform.invalid) {
      this.loginform.markAllAsTouched();
      return;
    }

    const { email, password} =this.loginform.value;

    const { data, error } = await this.supabaseService.login(this.loginform.value);

 
  if (error) {
    console.error('Login error:', error.message);
    return;
  }

  const userId = data.user.id;

  // 🔍 Get pending profile data
  const profileString = localStorage.getItem('pendingProfile');
  if (profileString) {
    const profileFields = JSON.parse(profileString);

    // ✅ Try updating profile
    const { error: updateError } = await this.supabaseService.updateProfileData(userId, profileFields);

    if (updateError) {
      console.error('Profile update failed:', updateError.message);
    } else {
      console.log('Profile updated.');
      // localStorage.removeItem('pendingProfile'); // ✅ cleanup
    }
  }
  this.router.navigate(['/login']);
  // ✅ Redirect to dashboard
 alert('login successfull')
}

}
