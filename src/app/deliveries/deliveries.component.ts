import {
  AfterViewInit,
  Component,
  Inject,
  PLATFORM_ID,
  ViewChild,
  OnInit,
} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import {
  MatFormFieldModule
} from '@angular/material/form-field';
import {
  MatInputModule
} from '@angular/material/input';
import {
  MatButtonModule
} from '@angular/material/button';
import {
  MatPaginatorModule,
  MatPaginator,
} from '@angular/material/paginator';
import {
  MatSelectModule
} from '@angular/material/select';
import {
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import {
  MatChipsModule
} from '@angular/material/chips';
import {
  MatIconModule
} from '@angular/material/icon';
import {
  MatMenuModule
} from '@angular/material/menu';
import {
  MatSort,
  MatSortModule
} from '@angular/material/sort';
import { RouterModule } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-deliveries',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatPaginatorModule,
    MatSelectModule,
    MatChipsModule,
    MatTableModule,
    MatIconModule,
    MatMenuModule,
    MatSortModule,
  ],
  templateUrl: './deliveries.component.html',
  styleUrl: './deliveries.component.css',
})
export class DeliveriesComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'name',
    'phone',
    'delivery_date',
    'status',
    'email',
    'address',
    'customer_type',
    'category',
  ];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  isBrowser = false;

  constructor(
    private supabase: SupabaseService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.loadDeliveries();
    }
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  async loadDeliveries() {
    try {
      const deliveries = await this.supabase.getDeliveriesData();
      this.dataSource.data = deliveries ?? [];
    } catch (error) {
      console.error('Error loading deliveries:', error);
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
