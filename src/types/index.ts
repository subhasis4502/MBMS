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
    quantity: number;
    pincode: string;  
    amountPaid: number;
    returnAmount: number;
    doneBy: string;
    delivery: 'Pending' | 'Shipped' | 'Delivered';
  }

export interface PaymentModel {
    _id: string;
    source: string;
    type: 'Credit' | 'Debit';
    amount: number;
    date: string;
    status: 'Pending' | 'Completed' | 'Failed';
  }