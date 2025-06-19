// src/app/services/supabase.service.ts
import {  Injectable, Inject, PLATFORM_ID  } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { isPlatformBrowser } from '@angular/common';
import { userInfo } from 'os';
const SUPABASE_URL = 'https://cgcqznprpsllntkvhkpl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnY3F6bnBycHNsbG50a3Zoa3BsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4OTA5NTQsImV4cCI6MjA2MzQ2Njk1NH0.wIDShDa1oo6ydtIC3MQdI7uyHbx-Zgi258-0KGEsBOw';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
      private supabase!: SupabaseClient;
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.supabase = createClient(
        'https://cgcqznprpsllntkvhkpl.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnY3F6bnBycHNsbG50a3Zoa3BsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4OTA5NTQsImV4cCI6MjA2MzQ2Njk1NH0.wIDShDa1oo6ydtIC3MQdI7uyHbx-Zgi258-0KGEsBOw'
      );
    }
  }


  signUp(userData: { email: string; password: string; name: string;address:string, phone: string; role: string }) {
    return this.supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          name: userData.name,
          phone: userData.phone,
          role: userData.role,
        },
      },
    });
  }

  login(formsdata:{email: string; password: string;}) {
    return this.supabase.auth.signInWithPassword({ email: formsdata.email,
      password: formsdata.password, });
  }
updateProfileData(userId: string, combinedData: any) {
  return this.supabase
    .from('profiles')
    .update(combinedData)
    .eq('id', userId)
    .single();
}

async updateDeliveryData(combinedData: any) {
  const { data: insertedData, error } = await this.supabase
    .from('deliveries')
    .insert([combinedData]);  // note: insert returns array of rows

  return { data: insertedData, error };
}
  // insertProfileData(profileData: any) {
  //   return this.supabase.from('profiles').insert([profileData]);
  // }
    async getUser() {
    const { data, error } = await this.supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  }
  getSession(){
   return this.supabase.auth.getSession();
  }
 async getCustomerData() {
  const { data, error } = await this.supabase.from('profiles').select('*');
  if (error) {
    console.error('Error fetching customers:', error.message);
    return [];  // Return empty array if there's an error
  }
  return data;  // ✅ This must be the array of customers
}
 async getDeliveriesData() {
  const { data, error } = await this.supabase.from('deliveries').select('*');
  if (error) {
    console.error('Error fetching customers:', error.message);
    return [];  // Return empty array if there's an error
  }
  return data;  // ✅ This must be the array of customers
}
}