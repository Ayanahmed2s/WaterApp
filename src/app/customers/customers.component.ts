import {AfterViewInit, Component,ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatPaginatorModule,MatPaginator} from '@angular/material/paginator';
import {MatSelectModule} from '@angular/material/select';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { RouterModule } from '@angular/router';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatMenuTrigger} from '@angular/material/menu';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';
//import session ends here,import session help importing modules,methods,files,datasets etc

@Component({
  selector: 'app-customers',
  imports: [MatFormFieldModule,RouterModule, MatTableModule, CommonModule, MatMenuModule,  MatIconModule, MatButtonModule, MatPaginatorModule, MatSelectModule, MatChipsModule, MatInputModule], templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent {
  displayedColumns: any[] = ['name','phone', 'email','address','customer_type','category'];
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
    this.loadcustomers()
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

  async loadcustomers() {
    const customers = await this.supabase.getCustomerData();
    this.dataSource.data = customers;  // ✅ Now the table gets real data
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
}}
