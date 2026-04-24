export interface Customer {
  id: string;
  customerId: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  packageId: string;
  packageName?: string;
  status: 'active' | 'inactive' | 'suspended';
  connectionDate: string;
  expiryDate: string;
  ipAddress?: string;
  macAddress?: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  packageId: string;
  connectionDate: string;
  ipAddress?: string;
  macAddress?: string;
  packageName?: string;
}
