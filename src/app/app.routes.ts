import { Routes } from '@angular/router';
import { SidetopbarComponent } from './sidetopbar/sidetopbar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OrderwaterComponent } from './orderwater/orderwater.component';
import { MembershipComponent } from './membership/membership.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { CustomersComponent } from './customers/customers.component';
import { DeliveriesComponent } from './deliveries/deliveries.component';
import { MyordersComponent } from './myorders/myorders.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  // ❗ Avoid putting layout route like sidetopbar as root route
  { path: 'sidetopbar', component: SidetopbarComponent }, // UI shell, no AuthGuard

  // ✅ Protected Routes - behind AuthGuard
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'orderpage', component: OrderwaterComponent, canActivate: [AuthGuard] },
  { path: 'myorders', component: MyordersComponent, canActivate: [AuthGuard] },
  { path: 'customerpage', component: CustomersComponent, canActivate: [AuthGuard] },
  { path: 'orders', component: DeliveriesComponent, canActivate: [AuthGuard] },

  // ✅ Public Routes
  { path: 'membership', component: MembershipComponent }, // Static page
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },

  // ✅ Default route (optional)
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // SSR-safe entry
  { path: '**', redirectTo: '/login' } // wildcard fallback
];
