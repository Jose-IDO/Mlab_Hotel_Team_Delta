export type PaymentStatus = 'pending' | 'success' | 'failed' | 'refunded' | 'cancelled';

export interface Payment {
  id: string;
  bookingId: string;
  userId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod?: string;
  paymentReference?: string;
  gatewayResponse?: any;
  paymentDate?: string;
  failureReason?: string;
  refundAmount?: number;
  refundDate?: string;
  refundReference?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentDTO {
  bookingId: string;
  userId: string;
  amount: number;
  currency?: string;
  paymentMethod?: string;
  paymentReference?: string;
}

export interface UpdatePaymentDTO {
  status?: PaymentStatus;
  paymentDate?: string;
  failureReason?: string;
  gatewayResponse?: any;
}
