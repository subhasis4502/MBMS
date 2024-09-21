// src/types/index.ts
export interface UserModel {
  _id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  token: string;
  isAdmin?: boolean;
}

export interface CardModel {
  _id: string;
  name: string[];
  type: string;
  totalLimit: number;
  currentLimit: number;
  payments: string[];
  billDate: Date;
  isActive: boolean;
}

export interface OrderModel {
  _id: string;
  deviceName: string;
  platform: string;
  orderId: string;
  card: string;
  cardName: string;
  quantity: number;
  pincode: string;
  amountPaid: number;
  returnAmount: number;
  profit: number;
  doneBy: string;
  doneByUser: string;
  orderDate: string;
  cashBack: number;
  commission: number;
  deliveryDate: string;
  totalProfit: number;
  transfer: boolean;
  delivery: 'Pending' | 'Delivered' | 'Payment Pending' | 'Money Received';
}

export interface PaymentModel {
  _id: string;
  source: string;
  type: 'Credit' | 'Debit';
  amount: number;
  date: string;
  status: 'Pending' | 'Completed' | 'Failed';
}

export interface HisabModel {
  _id: string;
  title: string;
  details: string;
  isActive: boolean;
  paymentReceived: boolean; 
}

export const PLATFORM = [
  "Amazon",
  "Flipkart",
  "JioMart",
  "Oppo Store",
  "Vivo Store",
  "Realme Store",
  "Mi Store",
  "Oneplus Store",
  "Samsung Store",
  "Reliance Digital",
  "Motorola Store",
  "iQOO Store",
  "Myntra"
]

export const CARDS = [
  "Amazon Pay ICICI",
  "ICICI Platinum",
  "ICICI Rupay",
  "Flipkart Axis",
  "Axis Neo",
  "Axis Rupay",
  "SBI Pulse",
]

export const BANKS = [
  "ICICI Savings Account",
]

export const USERS = [
  "Shreyashee Mitra",
]