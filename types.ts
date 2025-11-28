export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // In real app, this is hashed
  mobile: string;
  role: 'user' | 'admin';
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string; // URL
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'completed' | 'shipped';
  date: string;
}

export interface TryOnSession {
  id: string;
  userImage: string; // Base64
  productImage: string; // URL or Base64
  resultImage?: string; // URL or Base64
  status: 'idle' | 'processing' | 'completed' | 'failed';
}
