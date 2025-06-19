import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Component, inject, Inject } from '@angular/core';
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
import { error } from 'console';


@Component({
    selector: 'app-orderwater',
  imports: [MatButtonModule,MatIconModule,MatNativeDateModule,MatDatepickerModule,MatCardModule,FormsModule,RouterModule,MatCardModule,MatSelectModule,MatInputModule,MatFormFieldModule,ReactiveFormsModule],
  templateUrl: './orderwater.component.html',
  styleUrl: './orderwater.component.css'
})
export class OrderwaterComponent {
  constructor(private dialog: MatDialog) {}

  openDialog() {
    const dialogRef = this.dialog.open(WaterOrderDialog, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Water Order Submitted:', result);
        // You can send this result to a backend here
      }
    });
  }
}

// Dialog Component — No external .html file needed
@Component({
  selector: 'water-order-dialog',
  imports:[MatButtonModule,MatIconModule,MatCardModule,MatDialogTitle,MatNativeDateModule,MatDatepickerModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,FormsModule,RouterModule,MatSelectModule,MatInputModule,ReactiveFormsModule],
  template: `
    <h2 mat-dialog-title>Order Water</h2>
    <form [formGroup]="orderForm" (ngSubmit)="submit()" class="p-4">
      <!-- <mat-form-field appearance="fill" class="w-100 mb-3">
        <mat-label>Name</mat-label>
        <input matInput formControlName="name" required />
      </mat-form-field>

      <mat-form-field appearance="fill" class="w-100 mb-3">
        <mat-label>Address</mat-label>
        <textarea matInput formControlName="address" required></textarea>
      </mat-form-field> -->

      <mat-form-field appearance="fill" class="w-100 mb-3">
        <mat-label> Water 
          Type</mat-label>
        <mat-select  type="text" formControlName="can_type" >
          <mat-option value="Cool can">Cool can</mat-option>
        <mat-option value="Normal can">Normal Can</mat-option>
      </mat-select>
      </mat-form-field>

      <mat-form-field appearance="fill" class="w-100 mb-3">
        <mat-label>Quantity</mat-label>
        <mat-select  type="text" formControlName="quantity" >
          <mat-option value="1" >1</mat-option>
        <mat-option value="2">2</mat-option>
      <mat-option value="3">3+</mat-option>
    </mat-select>
      </mat-form-field>

      <mat-form-field appearance="fill">
  <mat-label>Choose a date</mat-label>
  <input matInput [matDatepicker]="picker" [value]="formattedDate" (dateChange)="onDateChange($event)" formControlName="delivery_date"/>
  <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
  <mat-datepicker #picker></mat-datepicker>
</mat-form-field>

<p>Selected Date (yyyy-MM-dd): {{ formattedDate }}</p>


      <div class="d-flex justify-content-end gap-2 mt-4">
        <button mat-button type="button" (click)="dialogRef.close()">Cancel</button>
        <button mat-raised-button color="primary" type="submit">Submit</button>
      </div>
    </form>
  `
})
export class WaterOrderDialog {
  orderForm: FormGroup;
    formattedDate: string = '';

  onDateChange(event: any) {
    const date = event.value;
    if (date) {
      this.formattedDate = formatDate(date, 'yyyy-MM-dd', 'en-US');
    }
  }
    constructor(
    private fb: FormBuilder,
    private supabaseService : SupabaseService,
    public dialogRef: MatDialogRef<WaterOrderDialog>
  ) {
    this.orderForm = this.fb.group({
      // name: ['', Validators.required],
      // address: ['', Validators.required],
      can_type: ['', [Validators.required, Validators.min(1)]],
      quantity: ['', [Validators.required, Validators.min(1)]],
      delivery_date:['', Validators.required],
    });
  }



 async submit() {
  if (!this.orderForm.valid) return;
  
  const orderValues = this.orderForm.value;
const user = await this.supabaseService.getUser();
const profile_id = user?.id;
  // Don’t close the dialog yet — wait until everything is successful
  const profileString = localStorage.getItem('pendingProfile');

  if (profileString) {
    const profileFields = JSON.parse(profileString);
    const combinedData = {
      profile_id,
      ...profileFields,
      ...orderValues
    };

    try {
      const {
        data,
        error: updateError
      } = await this.supabaseService.updateDeliveryData(combinedData);

      if (updateError) {
        console.error('Delivery update failed:', error);
      } else {
        console.log('Delivery data saved:', data);
        // ✅ Optional: clean up pending profile
        // localStorage.removeItem('pendingProfile');
        this.dialogRef.close(combinedData); // now close the dialog
      }
    } catch (err) {
      console.error('Unexpected error during delivery update:', err);
    }
  } else {
    console.warn('No pending profile in localStorage');
  }
}

}
