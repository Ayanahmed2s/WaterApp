import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-sidetopbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './sidetopbar.component.html',
  styleUrl: './sidetopbar.component.css'
})
export class SidetopbarComponent implements OnInit {
  isBrowser = false;
  isCollapsed = false;
  userName: string | null = null;
  userRole: 'admin' | undefined;

  constructor(
    private supabase: SupabaseService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;
    this.userName = localStorage.getItem('name');
  }

  togglesidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  logout(): void {
    this.supabase.logout().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
