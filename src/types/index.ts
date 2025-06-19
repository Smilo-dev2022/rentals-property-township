export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'tenant' | 'landlord' | 'admin';
  avatar?: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  type: 'room' | 'flat' | 'house' | 'plot';
  listingType: 'rent' | 'sale';
  township: string;
  region: string;
  street: string;
  amenities: string[];
  images: string[];
  landlordId: string;
  landlordName: string;
  landlordPhone: string;
  deposit?: number;
  term: 'short' | 'long';
  createdAt: Date;
  isBoosted?: boolean;
  isVerified?: boolean;
}

export interface Filter {
  priceMin?: number;
  priceMax?: number;
  type?: string;
  township?: string;
  amenities?: string[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  listingId: string;
  message: string;
  timestamp: Date;
}