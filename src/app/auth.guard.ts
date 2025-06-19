import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from './services/supabase.service';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

export const AuthGuard: CanActivateFn = async () => {
  const supabaseService = inject(SupabaseService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // ✅ Skip check during SSR
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  try {
    const { data } = await supabaseService.getSession();
    const session = data?.session;

    if (!session) {
      router.navigate(['/login']);
      return false;
    }

    return true;
  } catch (error) {
    console.error('AuthGuard error:', error);
    router.navigate(['/login']);
    return false;
  }
};
