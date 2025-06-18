import { Routes } from '@angular/router';
import { SidetopbarComponent } from './sidetopbar/sidetopbar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OrderwaterComponent } from './orderwater/orderwater.component';
import { MembershipComponent } from './membership/membership.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { CustomersComponent } from './customers/customers.component';
import {DeliveriesComponent}  from './deliveries/deliveries.component';
import { MyordersComponent } from './myorders/myorders.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
    {path:'sidetopbar',component:SidetopbarComponent},
        {path:'dashboard',component:DashboardComponent,canActivate:[AuthGuard]},
        {path:'orderpage',component:OrderwaterComponent,canActivate:[AuthGuard]},
        {path:'membership',component:MembershipComponent},
        {path:'customerpage',component:CustomersComponent},
        {path:'orders',component:DeliveriesComponent},
        {path:'myorders',component:MyordersComponent},
        {path:'signup',component:SignupComponent},
        {path:'login',component:LoginComponent},
    ];
