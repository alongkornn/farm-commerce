export type UserRole = "buyer" | "seller" | "admin";

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  userType: UserRole;
  verified: boolean;
  status: string;
};

export type AuthResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
};

export type ProductImage = {
  id: string;
  productId: string;
  url: string;
  position: number;
};

export type Product = {
  id: string;
  sellerId: string;
  sku: string;
  name: string;
  category: string;
  priceSatang: number;
  size: string;
  stock: number;
  description: string;
  active: boolean;
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
};

export type SellerProfile = {
  id: string;
  userId: string;
  farmName: string;
  description: string;
  address: string;
  status: "pending" | "approved" | "rejected" | "suspended";
  reviewNote?: string;
};

export type VisitSlot = {
  id: string;
  sellerId: string;
  startAt: string;
  endAt: string;
  capacity: number;
  active: boolean;
};

export type Booking = {
  id: string;
  slotId: string;
  sellerId: string;
  buyerId: string;
  visitorCount: number;
  vehicle: string;
  bookerName: string;
  status: string;
  checkInCode?: string;
  slot: VisitSlot;
  createdAt: string;
};

export type OrderItem = {
  id: string;
  productId: string;
  productName: string;
  unitPriceSatang: number;
  quantity: number;
  subtotalSatang: number;
};

export type Order = {
  id: string;
  buyerId: string;
  sellerId: string;
  status: string;
  totalSatang: number;
  shippingFeeSatang: number;
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;
  shippingProvider?: string;
  trackingNumber?: string;
  items: OrderItem[];
  createdAt: string;
};

export type ApiEnvelope<T> = {
  data: T;
  message?: string;
};

export type ProductPage = {
  items: Product[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type CartItem = {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
};

export type Address = {
  id: string;
  label: string;
  recipient: string;
  phone: string;
  line1: string;
  line2?: string;
  subdistrict: string;
  district: string;
  province: string;
  postalCode: string;
  isDefault: boolean;
};

export type Notification = {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
};
