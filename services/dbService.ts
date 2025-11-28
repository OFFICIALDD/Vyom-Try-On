import { User, Product, Order } from '../types';

const USERS_KEY = 'vyom_users';
const PRODUCTS_KEY = 'vyom_products';
const ORDERS_KEY = 'vyom_orders';

// Initial Mock Data
const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Classic White Tee',
    category: 'T-shirts',
    price: 499,
    description: '100% Cotton, comfortable fit.',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=80',
    stock: 50,
  },
  {
    id: 'p2',
    name: 'Blue Denim Jacket',
    category: 'Jackets',
    price: 1299,
    description: 'Vintage wash denim jacket.',
    image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=500&q=80',
    stock: 20,
  },
  {
    id: 'p3',
    name: 'Floral Summer Dress',
    category: 'Women',
    price: 1599,
    description: 'Lightweight and airy for summer.',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=500&q=80',
    stock: 15,
  },
  {
    id: 'p4',
    name: 'Urban Hoodie Black',
    category: 'Hoodies',
    price: 899,
    description: 'Warm fleece hoodie.',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=500&q=80',
    stock: 30,
  },
  {
    id: 'p5',
    name: 'Slim Fit Chinos',
    category: 'Men',
    price: 799,
    description: 'Beige chinos, perfect for office.',
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=500&q=80',
    stock: 40,
  }
];

// Helper to initialize DB
const initDB = () => {
  if (!localStorage.getItem(PRODUCTS_KEY)) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
  }
  if (!localStorage.getItem(USERS_KEY)) {
    // Add a default admin
    const admin: User = {
      id: 'admin1',
      name: 'Vyom Admin',
      email: 'admin@vyom.com',
      password: 'admin', // Simple check
      mobile: '0000000000',
      role: 'admin'
    };
    localStorage.setItem(USERS_KEY, JSON.stringify([admin]));
  }
};

initDB();

export const db = {
  getProducts: (): Product[] => {
    return JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');
  },
  getProductById: (id: string): Product | undefined => {
    const products = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');
    return products.find((p: Product) => p.id === id);
  },
  addProduct: (product: Product) => {
    const products = db.getProducts();
    products.push(product);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  },
  getUsers: (): User[] => {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  },
  addUser: (user: User) => {
    const users = db.getUsers();
    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },
  findUser: (email: string): User | undefined => {
    return db.getUsers().find(u => u.email === email);
  },
  saveOrder: (order: Order) => {
    const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    orders.push(order);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  },
  getOrders: (): Order[] => {
    return JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
  }
};
