// src/app/services/supabase.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { isPlatformBrowser } from '@angular/common';

const SUPABASE_URL = 'https://cgcqznprpsllntkvhkpl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnY3F6bnBycHNsbG50a3Zoa3BsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4OTA5NTQsImV4cCI6MjA2MzQ2Njk1NH0.wIDShDa1oo6ydtIC3MQdI7uyHbx-Zgi258-0KGEsBOw'; // replace with your real key

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // ✅ Always initialize the Supabase client (safe for both browser + server)
    this.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }

  /**
   * Utility to check if running on the browser
   */
  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  /**
   * Get the current Supabase session (SSR-safe)
   */
  getSession() {
    if (!this.isBrowser()) {
      return Promise.resolve({ data: { session: null }, error: null });
    }
    return this.supabase.auth.getSession();
  }

  /**
   * Get current authenticated user (SSR-safe)
   */
  async getUser() {
    if (!this.isBrowser()) return null;
    const { data, error } = await this.supabase.auth.getUser();
    if (error) {
      console.error('getUser() error:', error.message);
      return null;
    }
    return data.user;
  }

  /**
   * Sign up a new user (SSR-safe)
   */
  signUp(userData: {
    email: string;
    password: string;
    name: string;
    address: string;
    phone: string;
    role: string;
  }) {
    if (!this.isBrowser()) return Promise.reject('Sign up not allowed on server');
    return this.supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          name: userData.name,
          phone: userData.phone,
          role: userData.role,
          address: userData.address,
        },
      },
    });
  }

  /**
   * Login a user (SSR-safe)
   */
  login(form: { email: string; password: string }) {
    if (!this.isBrowser()) return Promise.reject('Login not allowed on server');
    return this.supabase.auth.signInWithPassword(form);
  }

  /**
   * Logout and clear localStorage (SSR-safe)
   */
  logout() {
    if (this.isBrowser()) {
      localStorage.clear(); // ✅ Clears token and any saved data
      return this.supabase.auth.signOut();
    }
    return Promise.resolve(); // No-op on server
  }

  /**
   * Update profile (SSR-safe)
   */
  updateProfileData(userId: string, profileData: any) {
    if (!this.isBrowser()) return Promise.reject('Profile update not allowed on server');
    return this.supabase.from('profiles').update(profileData).eq('id', userId).single();
  }

  /**
   * Insert a delivery (SSR-safe)
   */
 async updateDeliveryData(deliveryData: any): Promise<{ data: any; error: any }> {
  if (!this.isBrowser()) return { data: null, error: null };
  const { data, error } = await this.supabase.from('deliveries').insert([deliveryData]);
  return { data, error };
}


  /**
   * Get all customers from profiles table (SSR-safe)
   */
  async getCustomerData() {
    if (!this.isBrowser()) return [];
    const { data, error } = await this.supabase.from('profiles').select('*');
    if (error) {
      console.error('getCustomerData error:', error.message);
      return [];
    }
    return data;
  }

  /**
   * Get all deliveries from deliveries table (SSR-safe)
   */
  async getDeliveriesData() {
    if (!this.isBrowser()) return [];
    const { data, error } = await this.supabase.from('deliveries').select('*');
    if (error) {
      console.error('getDeliveriesData error:', error.message);
      return [];
    }
    return data;
  }
}
