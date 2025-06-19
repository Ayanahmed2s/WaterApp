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
  MatFormField,
  MatInputModule,
} from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  MatPaginatorModule,
  MatPaginator,
} from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import {
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatFormField,
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
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css',
})
export class CustomersComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'name',
    'phone',
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
      this.loadCustomers();
    }
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  async loadCustomers() {
    try {
      const customers = await this.supabase.getCustomerData();
      this.dataSource.data = customers ?? [];
    } catch (err) {
      console.error('Failed to load customer data:', err);
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
