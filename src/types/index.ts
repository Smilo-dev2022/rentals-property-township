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
  type: 'room' | 'flat' | 'house' | 'plot' | 'backroom';
  category: 'rent' | 'sale';
  images: string[];
  region: {
    id: string;
    name: string;
    township: string;
    city: string;
    province: string;
  };
  owner: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  amenities: string[];
  contactInfo?: {
    phone?: string;
    whatsapp?: string;
    email?: string;
  };
  deposit?: number;
  isAvailable: boolean;
  isBoosted?: boolean;
  isVerified?: boolean;
  createdAt: string;
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