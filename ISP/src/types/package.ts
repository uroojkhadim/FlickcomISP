export interface Package {
  id: string;
  name: string;
  description: string;
  speed: {
    download: number;
    upload: number;
  };
  price: number;
  billingCycle: 'monthly' | 'quarterly' | 'semi-annual' | 'annual';
  features: string[];
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface PackageFormData {
  name: string;
  description: string;
  downloadSpeed: number;
  uploadSpeed: number;
  price: number;
  billingCycle: 'monthly' | 'quarterly' | 'semi-annual' | 'annual';
  features: string[];
}
