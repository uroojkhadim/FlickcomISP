/**
 * Seed Data Generator
 * Generates realistic mock data for ISP Admin Panel
 */

import { Customer } from '@/types/customer';
import { Package } from '@/types/package';
import { Bill } from '@/types/billing';
import { Ticket } from '@/types/ticket';
import { User } from '@/types/auth';

const STORAGE_KEYS = {
  customers: 'isp_customers',
  packages: 'isp_packages',
  bills: 'isp_bills',
  tickets: 'isp_tickets',
  users: 'isp_users',
};

// First names for generating mock data
const firstNames = [
  'James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda',
  'David', 'Elizabeth', 'William', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
  'Thomas', 'Sarah', 'Christopher', 'Karen', 'Charles', 'Lisa', 'Daniel', 'Nancy',
  'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley',
  'Steven', 'Dorothy', 'Paul', 'Kimberly', 'Andrew', 'Emily', 'Joshua', 'Donna',
  'Kenneth', 'Michelle', 'Kevin', 'Carol', 'Brian', 'Amanda', 'George', 'Melissa',
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
];

const cities = [
  'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia',
  'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville',
];

const streets = [
  'Main St', 'Oak Ave', 'Maple Dr', 'Cedar Ln', 'Pine St', 'Elm Ave',
  'Washington Blvd', 'Lake Dr', 'Hill St', 'Park Ave', 'River Rd', 'Forest Ln',
];

/**
 * Generate random item from array
 */
function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Generate random number in range
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate random date in past
 */
function randomDate(daysBack: number): string {
  const date = new Date();
  date.setDate(date.getDate() - randomInt(0, daysBack));
  return date.toISOString();
}

/**
 * Generate random future date
 */
function randomFutureDate(daysForward: number): string {
  const date = new Date();
  date.setDate(date.getDate() + randomInt(0, daysForward));
  return date.toISOString();
}

/**
 * Generate packages
 */
function generatePackages(): Package[] {
  return [
    {
      id: 'pkg_1',
      name: 'Basic Internet',
      description: 'Perfect for browsing and email',
      speed: { download: 25, upload: 5 },
      price: 29.99,
      billingCycle: 'monthly',
      features: ['25 Mbps Download', '5 Mbps Upload', 'Free Installation', 'Email Support'],
      status: 'active',
      createdAt: randomDate(365),
      updatedAt: randomDate(30),
    },
    {
      id: 'pkg_2',
      name: 'Standard Internet',
      description: 'Great for streaming and work from home',
      speed: { download: 50, upload: 10 },
      price: 49.99,
      billingCycle: 'monthly',
      features: ['50 Mbps Download', '10 Mbps Upload', 'Free Installation', '24/7 Support', 'Free Router'],
      status: 'active',
      createdAt: randomDate(365),
      updatedAt: randomDate(30),
    },
    {
      id: 'pkg_3',
      name: 'Premium Internet',
      description: 'Ideal for gaming and 4K streaming',
      speed: { download: 100, upload: 20 },
      price: 69.99,
      billingCycle: 'monthly',
      features: ['100 Mbps Download', '20 Mbps Upload', 'Free Installation', 'Priority Support', 'Free Router', 'Static IP'],
      status: 'active',
      createdAt: randomDate(365),
      updatedAt: randomDate(30),
    },
    {
      id: 'pkg_4',
      name: 'Ultra Fast Internet',
      description: 'Maximum speed for power users',
      speed: { download: 200, upload: 50 },
      price: 99.99,
      billingCycle: 'monthly',
      features: ['200 Mbps Download', '50 Mbps Upload', 'Free Installation', 'Priority Support', 'Premium Router', 'Static IP', 'No Data Cap'],
      status: 'active',
      createdAt: randomDate(365),
      updatedAt: randomDate(30),
    },
    {
      id: 'pkg_5',
      name: 'Business Basic',
      description: 'Reliable connection for small businesses',
      speed: { download: 100, upload: 50 },
      price: 149.99,
      billingCycle: 'monthly',
      features: ['100 Mbps Download', '50 Mbps Upload', 'Business Support', 'Static IP', 'SLA Guarantee'],
      status: 'active',
      createdAt: randomDate(365),
      updatedAt: randomDate(30),
    },
    {
      id: 'pkg_6',
      name: 'Business Pro',
      description: 'High-speed business internet',
      speed: { download: 500, upload: 100 },
      price: 299.99,
      billingCycle: 'monthly',
      features: ['500 Mbps Download', '100 Mbps Upload', 'Premium Business Support', 'Multiple Static IPs', '99.9% SLA', 'Dedicated Line'],
      status: 'active',
      createdAt: randomDate(365),
      updatedAt: randomDate(30),
    },
    {
      id: 'pkg_7',
      name: 'Student Plan',
      description: 'Affordable internet for students',
      speed: { download: 25, upload: 5 },
      price: 19.99,
      billingCycle: 'monthly',
      features: ['25 Mbps Download', '5 Mbps Upload', 'Student Discount', 'Email Support'],
      status: 'active',
      createdAt: randomDate(365),
      updatedAt: randomDate(30),
    },
    {
      id: 'pkg_8',
      name: 'Senior Plan',
      description: 'Simple and affordable for seniors',
      speed: { download: 15, upload: 3 },
      price: 24.99,
      billingCycle: 'monthly',
      features: ['15 Mbps Download', '3 Mbps Upload', 'Senior Discount', 'Phone Support'],
      status: 'active',
      createdAt: randomDate(365),
      updatedAt: randomDate(30),
    },
    {
      id: 'pkg_9',
      name: 'Gamer Package',
      description: 'Low latency for online gaming',
      speed: { download: 150, upload: 30 },
      price: 79.99,
      billingCycle: 'monthly',
      features: ['150 Mbps Download', '30 Mbps Upload', 'Low Latency', 'Gaming Router', 'Priority Support'],
      status: 'active',
      createdAt: randomDate(365),
      updatedAt: randomDate(30),
    },
    {
      id: 'pkg_10',
      name: 'Legacy Plan',
      description: 'Older package (discontinued)',
      speed: { download: 10, upload: 2 },
      price: 39.99,
      billingCycle: 'monthly',
      features: ['10 Mbps Download', '2 Mbps Upload', 'Basic Support'],
      status: 'inactive',
      createdAt: randomDate(730),
      updatedAt: randomDate(180),
    },
  ];
}

/**
 * Generate customers
 */
function generateCustomers(packages: Package[]): Customer[] {
  const customers: Customer[] = [];
  const statuses: ('active' | 'inactive' | 'suspended')[] = ['active', 'active', 'active', 'active', 'inactive', 'suspended'];
  
  for (let i = 0; i < 50; i++) {
    const firstName = randomItem(firstNames);
    const lastName = randomItem(lastNames);
    const pkg = randomItem(packages.filter(p => p.status === 'active'));
    const status = randomItem(statuses);
    const connectionDate = randomDate(365);
    const balance = status === 'active' ? 0 : randomInt(0, 200);
    
    customers.push({
      id: `cust_${i + 1}`,
      customerId: `ISP${String(i + 1).padStart(5, '0')}`,
      fullName: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
      phone: `+1${randomInt(2000000000, 9999999999)}`,
      address: `${randomInt(100, 9999)} ${randomItem(streets)}`,
      city: randomItem(cities),
      state: randomItem(['CA', 'NY', 'TX', 'FL', 'IL', 'PA', 'OH', 'GA']),
      zipCode: String(randomInt(10000, 99999)),
      packageId: pkg.id,
      packageName: pkg.name,
      status,
      connectionDate,
      expiryDate: randomFutureDate(365),
      ipAddress: `192.168.${randomInt(1, 255)}.${randomInt(1, 255)}`,
      macAddress: `00:1B:44:11:3A:${randomInt(10, 99)}`,
      balance,
      createdAt: connectionDate,
      updatedAt: randomDate(30),
    });
  }
  
  return customers;
}

/**
 * Generate bills
 */
function generateBills(customers: Customer[], packages: Package[]): Bill[] {
  const bills: Bill[] = [];
  const statuses: ('paid' | 'pending' | 'overdue')[] = ['paid', 'paid', 'paid', 'pending', 'overdue'];
  
  customers.forEach((customer, idx) => {
    const numBills = randomInt(2, 5);
    
    for (let i = 0; i < numBills; i++) {
      const pkg = packages.find(p => p.id === customer.packageId);
      const status = randomItem(statuses);
      const dueDate = randomDate(90);
      
      bills.push({
        id: `bill_${idx}_${i}`,
        customerId: customer.id,
        customerName: customer.fullName,
        packageId: customer.packageId,
        packageName: customer.packageName || 'Unknown',
        amount: pkg?.price || 0,
        dueDate,
        paidDate: status === 'paid' ? randomDate(30) : undefined,
        status,
        invoiceNumber: `INV-${String(bills.length + 1).padStart(6, '0')}`,
        billingPeriod: `${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
        createdAt: randomDate(120),
      });
    }
  });
  
  return bills;
}

/**
 * Generate tickets
 */
function generateTickets(customers: Customer[]): Ticket[] {
  const tickets: Ticket[] = [];
  const priorities: ('low' | 'medium' | 'high' | 'critical')[] = ['low', 'medium', 'medium', 'high', 'critical'];
  const statuses: ('open' | 'in_progress' | 'resolved' | 'closed')[] = ['open', 'open', 'in_progress', 'resolved', 'closed'];
  const subjects = [
    'Internet connection slow',
    'Unable to connect to WiFi',
    'Billing inquiry',
    'Request to upgrade package',
    'Router not working',
    'Frequent disconnections',
    'Payment issue',
    'New connection request',
    'Speed test results not matching',
    'Need technical support',
  ];
  const descriptions = [
    'Customer reports slow internet speeds during peak hours',
    'WiFi connection drops frequently throughout the day',
    'Customer has questions about recent bill charges',
    'Customer wants to upgrade to a higher speed package',
    'Router appears to be malfunctioning, needs replacement',
    'Internet connection drops every few hours',
    'Payment was made but still showing as pending',
    'Customer wants to install new connection at different address',
    'Speed test shows lower speeds than subscribed package',
    'Customer needs help with network configuration',
  ];
  
  for (let i = 0; i < 30; i++) {
    const customer = randomItem(customers);
    const subjectIdx = randomInt(0, subjects.length - 1);
    const status = randomItem(statuses);
    
    tickets.push({
      id: `ticket_${i + 1}`,
      ticketNumber: `TKT-${String(i + 1).padStart(5, '0')}`,
      customerId: customer.id,
      customerName: customer.fullName,
      subject: subjects[subjectIdx],
      description: descriptions[subjectIdx],
      priority: randomItem(priorities),
      status,
      assignedTo: status !== 'open' ? `user_${randomInt(1, 3)}` : undefined,
      assignedToName: status !== 'open' ? randomItem(['John Smith', 'Sarah Johnson', 'Mike Davis']) : undefined,
      createdAt: randomDate(60),
      updatedAt: randomDate(10),
    });
  }
  
  return tickets;
}

/**
 * Generate users
 */
function generateUsers(): User[] {
  return [
    {
      id: 'user_1',
      name: 'Admin User',
      email: 'admin@admin.com',
      phone: '+1234567890',
      role: 'admin',
      status: 'active',
      createdAt: randomDate(365),
      updatedAt: randomDate(30),
    },
    {
      id: 'user_2',
      name: 'John Smith',
      email: 'john.smith@isp.com',
      phone: '+1234567891',
      role: 'staff',
      status: 'active',
      createdAt: randomDate(300),
      updatedAt: randomDate(20),
    },
    {
      id: 'user_3',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@isp.com',
      phone: '+1234567892',
      role: 'staff',
      status: 'active',
      createdAt: randomDate(250),
      updatedAt: randomDate(15),
    },
    {
      id: 'user_4',
      name: 'Mike Davis',
      email: 'mike.davis@isp.com',
      phone: '+1234567893',
      role: 'technician',
      status: 'active',
      createdAt: randomDate(200),
      updatedAt: randomDate(10),
    },
    {
      id: 'user_5',
      name: 'Emily Wilson',
      email: 'emily.wilson@isp.com',
      phone: '+1234567894',
      role: 'staff',
      status: 'active',
      createdAt: randomDate(150),
      updatedAt: randomDate(5),
    },
  ];
}

/**
 * Check if data needs to be seeded
 */
function needsSeeding(): boolean {
  return !localStorage.getItem(STORAGE_KEYS.packages);
}

/**
 * Seed all data
 */
export function seedAllData(): void {
  if (!needsSeeding()) {
    console.log('Data already exists, skipping seed');
    return;
  }
  
  console.log('Seeding mock data...');
  
  const packages = generatePackages();
  const customers = generateCustomers(packages);
  const bills = generateBills(customers, packages);
  const tickets = generateTickets(customers);
  const users = generateUsers();
  
  localStorage.setItem(STORAGE_KEYS.packages, JSON.stringify(packages));
  localStorage.setItem(STORAGE_KEYS.customers, JSON.stringify(customers));
  localStorage.setItem(STORAGE_KEYS.bills, JSON.stringify(bills));
  localStorage.setItem(STORAGE_KEYS.tickets, JSON.stringify(tickets));
  localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
  
  console.log('Mock data seeded successfully!');
}

/**
 * Reset all data (clear and re-seed)
 */
export function resetAllData(): void {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
  
  seedAllData();
  console.log('Data reset successfully!');
}
