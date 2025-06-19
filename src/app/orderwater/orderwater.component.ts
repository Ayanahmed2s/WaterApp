import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, Validators, FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { formatDate } from '@angular/common';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { SupabaseService } from '../services/supabase.service';


@Component({
  selector: 'app-orderwater',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './orderwater.component.html',
  styleUrl: './orderwater.component.css'
})
export class OrderwaterComponent {
  isBrowser = false;

  constructor(
    private dialog: MatDialog,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  openDialog() {
    if (!this.isBrowser) return;
    const dialogRef = this.dialog.open(WaterOrderDialog, { width: '400px' });

    dialogRef.afterClosed().subscribe(result => {
      if (result) console.log('Water Order Submitted:', result);
    });
  }
}

@Component({
  selector: 'water-order-dialog',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatCardModule,CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule
  ],
  template: `
    <h2 mat-dialog-title>Order Water</h2>
    <form [formGroup]="orderForm" (ngSubmit)="submit()" class="p-4">
      <mat-form-field appearance="fill" class="w-100 mb-3">
        <mat-label>Water Type</mat-label>
        <mat-select formControlName="can_type">
          <mat-option value="Cool can">Cool can</mat-option>
          <mat-option value="Normal can">Normal can</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="fill" class="w-100 mb-3">
        <mat-label>Quantity</mat-label>
        <mat-select formControlName="quantity">
          <mat-option value="1">1</mat-option>
          <mat-option value="2">2</mat-option>
          <mat-option value="3">3+</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="fill" class="w-100 mb-3">
        <mat-label>Choose a date</mat-label>
        <input matInput [matDatepicker]="picker" (dateChange)="onDateChange($event)" formControlName="delivery_date" />
        <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
        <mat-datepicker #picker></mat-datepicker>
      </mat-form-field>

      <p *ngIf="formattedDate">Selected Date: {{ formattedDate }}</p>

      <div class="d-flex justify-content-end gap-2 mt-4">
        <button mat-button type="button" (click)="dialogRef.close()">Cancel</button>
        <button mat-raised-button color="primary" type="submit">Submit</button>
      </div>
    </form>
  `
})
export class WaterOrderDialog {
  orderForm: FormGroup;
  formattedDate = '';
  isBrowser = false;

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    public dialogRef: MatDialogRef<WaterOrderDialog>,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.orderForm = this.fb.group({
      can_type: ['', Validators.required],
      quantity: ['', Validators.required],
      delivery_date: ['', Validators.required],
    });
  }

  onDateChange(event: any) {
    const date = event.value;
    if (date) {
      this.formattedDate = formatDate(date, 'yyyy-MM-dd', 'en-US');
    }
  }

  async submit() {
    if (!this.isBrowser || this.orderForm.invalid) return;

    const orderValues = this.orderForm.value;
    const user = await this.supabaseService.getUser();
    const profile_id = user?.id;

    const profileString = localStorage.getItem('pendingProfile');
    if (!profileString) {
      console.warn('No pending profile in localStorage');
      return;
    }

    const profileFields = JSON.parse(profileString);
    const combinedData = { profile_id, ...profileFields, ...orderValues };

    try {
      const { data, error } = await this.supabaseService.updateDeliveryData(combinedData);
      if (error) {
        console.error('Delivery update failed:', error.message);
        return;
      }

      this.dialogRef.close(combinedData);
    } catch (err) {
      console.error('Unexpected error during delivery update:', err);
    }
  }
}
