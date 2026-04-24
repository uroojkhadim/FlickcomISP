export interface Bill {
  id: string;
  customerId: string;
  customerName: string;
  packageId: string;
  packageName: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'paid' | 'pending' | 'overdue';
  invoiceNumber: string;
  billingPeriod: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  billId: string;
  customerId: string;
  customerName: string;
  amount: number;
  paymentMethod: 'cash' | 'card' | 'bank_transfer' | 'online';
  paymentDate: string;
  receiptNumber: string;
  notes?: string;
}

export interface BillFormData {
  customerId: string;
  amount: number;
  dueDate: string;
  billingPeriod: string;
}
