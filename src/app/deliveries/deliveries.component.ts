import {AfterViewInit, Component,Inject,PLATFORM_ID,ViewChild} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
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
export interface companyInterface {
  companyId: number,
  companyLogo:string;
  companyName: string;
  companyPhone: string;
  companyEmail: string;
  companyLocation: string;
  Ratings:string;
  companyManager: string;
  Contact:string;
  Action:string;
  Status:string;
}
@Component({
  selector: 'app-deliveries',
  imports: [MatFormFieldModule,RouterModule, MatTableModule, CommonModule, MatMenuModule,  MatIconModule, MatButtonModule, MatPaginatorModule, MatSelectModule, MatChipsModule, MatInputModule],
  templateUrl: './deliveries.component.html',
  styleUrl: './deliveries.component.css'
})
export class DeliveriesComponent {
  displayedColumns: any[] = ['name','phone','delivery_date','status', 'email','address','customer_type','category'];
  dataSource = new MatTableDataSource<any>([]);  // ✅ Material table data source
  @ViewChild(MatPaginator)
  paginator!: MatPaginator | null;
  @ViewChild(MatSort)
  sort!: MatSort;
  router = new Router;
  isBrowser: boolean;

  constructor( private supabase:SupabaseService, @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
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
    if (!this.isBrowser) return;
    const customers = await this.supabase.getDeliveriesData();
    this.dataSource.data = customers;  // ✅ Now the table gets real data
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
}
}
