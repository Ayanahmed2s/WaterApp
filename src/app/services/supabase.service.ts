// src/app/services/supabase.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { isPlatformBrowser } from '@angular/common';

const SUPABASE_URL = 'https://cgcqznprpsllntkvhkpl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnY3F6bnBycHNsbG50a3Zoa3BsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4OTA5NTQsImV4cCI6MjA2MzQ2Njk1NH0.wIDShDa1oo6ydtIC3MQdI7uyHbx-Zgi258-0KGEsBOw';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
  }

  private get client(): SupabaseClient {
    if (!this.supabase) {
      throw new Error('Supabase client is not initialized.');
    }
    return this.supabase;
  }

  signUp(userData: {
    email: string;
    password: string;
    name: string;
    address: string;
    phone: string;
    role: string;
  }) {
    return this.client.auth.signUp({
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

  login(formData: { email: string; password: string }) {
    return this.client.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });
  }

  async getUser() {
    const { data, error } = await this.client.auth.getUser();
    if (error) throw error;
    return data.user;
  }

  getSession() {
    return this.client.auth.getSession();
  }

  updateProfileData(userId: string, combinedData: any) {
    return this.client.from('profiles').update(combinedData).eq('id', userId).single();
  }

  async updateDeliveryData(combinedData: any) {
    const { data, error } = await this.client.from('deliveries').insert([combinedData]);
    return { data, error };
  }

  async getCustomerData() {
    const { data, error } = await this.client.from('profiles').select('*');
    if (error) {
      console.error('Error fetching customers:', error.message);
      return [];
    }
    return data;
  }

  async getDeliveriesData() {
    const { data, error } = await this.client.from('deliveries').select('*');
    if (error) {
      console.error('Error fetching deliveries:', error.message);
      return [];
    }
    return data;
  }
}
