import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-myorders',
  imports: [MatFormFieldModule,RouterModule, MatTableModule, CommonModule, MatMenuModule,  MatIconModule, MatButtonModule, MatPaginatorModule, MatSelectModule, MatChipsModule, MatInputModule],
  templateUrl: './myorders.component.html',
  styleUrl: './myorders.component.css'
})
export class MyordersComponent {
 displayedColumns: any[] = ['name','phone','delivery_date','status', 'email','address','customer_type','category'];
  dataSource = new MatTableDataSource<any>([]);  // ✅ Material table data source
  @ViewChild(MatPaginator)
  paginator!: MatPaginator | null;
  @ViewChild(MatSort)
  sort!: MatSort;
  router = new Router;

  constructor( private supabase:SupabaseService ) {
    // Assign the data to the data source for the table to render
    // this.dataSource = new MatTableDataSource(allCompanies);
  }
  ngOnInit(): void {
    this.loaddeliveries()
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  // getCompanyData(company: any) {
  //     const editCompany  = this.dataSource.filteredData.find(list => list.companyId === company.companyId);
  //     this.router.navigate(['/editcompany'], { queryParams: { companyId: company.companyId } });
  //     console.log(editCompany);
  // }

  async loaddeliveries() {
    const customers = await this.supabase.getDeliveriesData();
    this.dataSource.data = customers;  // ✅ Now the table gets real data
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
}}
