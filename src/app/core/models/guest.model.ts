export interface Guest {
  guest_id: string;
  full_name: string;
  email?: string;
  phone: string;
  id_type?: 'Passport' | 'ID_Card' | 'Driver_License';
  id_number?: string;
  nationality?: string;
  date_of_birth?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateGuestRequest {
  full_name: string;
  email?: string;
  phone: string;
  id_type?: string;
  id_number?: string;
  nationality?: string;
  date_of_birth?: string;
}

export interface GuestListResponse {
  guests: Guest[];
  total: number;
  page: number;
  limit: number;
}
