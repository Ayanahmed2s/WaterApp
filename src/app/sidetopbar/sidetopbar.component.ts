import { Component,OnInit} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import { Router ,NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';
import bootstrap from '../../main.server';
import { MatSlideToggle } from '@angular/material/slide-toggle';
@Component({
  selector: 'app-sidetopbar',
  imports: [MatIconModule, RouterModule, CommonModule],
  templateUrl: './sidetopbar.component.html',
  styleUrl: './sidetopbar.component.css'
})
export class SidetopbarComponent {
  userRole: 'admin' | undefined ;
 isCollapsed:boolean = false;
 togglesidebar(){
  this.isCollapsed=!this.isCollapsed;
 }
sidebarState: any;

  // constrouctor (private cookieService:CookieService,private router:Router){}
  // ngOnInit() {
  //   if (typeof window !== 'undefined') {
  //     this.userRole = localStorage.getItem('userRole');
  //   } 
  //   if (this.savedState) {
  //     this.sidebarState = JSON.parse(this.savedState);
  //   }
    
  //  }
 
 
}
