export interface Service {
  id: string;
  service_name: string;
  category: string;
  description: string | null;
  price: number | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  customer_name: string;
  phone: string;
  address: string;
  selected_service: string;
  preferred_date: string;
  preferred_time: string;
  emergency_status: boolean;
  booking_status: 'pending' | 'accepted' | 'rejected' | 'completed';
  created_at: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface Review {
  id: string;
  patient_name: string;
  location: string;
  service_received: string;
  rating: number;
  review_message: string;
  status: 'pending' | 'approved' | 'rejected';
  review_type: 'real' | 'demo';
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}
