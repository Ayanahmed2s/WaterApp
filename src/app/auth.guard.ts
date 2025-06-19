import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { SupabaseService } from './services/supabase.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  constructor(
    private supabaseService: SupabaseService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  async canActivate(): Promise<boolean> {
    // ✅ If SSR is rendering the route, skip auth check
    if (!isPlatformBrowser(this.platformId)) {
      return true;
    }

    // ✅ Otherwise, check Supabase session (client only)
    try {
      const sessionResponse = await this.supabaseService.getSession();
      const session = sessionResponse?.data?.session;

      if (!session) {
        this.router.navigate(['/login']);
        return false;
      }

      return true;
    } catch (error) {
      console.error('AuthGuard session error:', error);
      this.router.navigate(['/login']);
      return false;
    }
  }
}
