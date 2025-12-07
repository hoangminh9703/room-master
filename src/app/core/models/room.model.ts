export interface Room {
  room_id: string;
  room_number: string;
  room_type_id: string;
  floor: number;
  capacity: number;
  status: RoomStatus;
  features?: Record<string, boolean>;
  price_per_night: number;
  created_at: string;
  updated_at: string;
}

export interface RoomType {
  room_type_id: string;
  name: string;
  description?: string;
  base_price: number;
  max_capacity: number;
  created_at: string;
  updated_at: string;
}

export type RoomStatus = 'Available' | 'Occupied' | 'Cleaning' | 'Maintenance';

export interface RoomAvailability {
  roomId: string;
  roomNumber: string;
  roomType: string;
  available: boolean;
  datesBooked: string[];
}

export interface RoomListResponse {
  rooms: Room[];
  total: number;
  page: number;
  limit: number;
}
