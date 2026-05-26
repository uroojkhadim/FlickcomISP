-- ==============================================================================
-- ISP SERVICE PLATFORM — SUPABASE SCHEMA v1.0
-- ==============================================================================

-- 1. Users Table (Customers, Admins, Resellers)
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(20) UNIQUE NOT NULL, -- e.g., CUST00001
  name VARCHAR(100) NOT NULL,
  cnic VARCHAR(15) UNIQUE,
  address TEXT,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'superadmin', 'reseller')),
  status VARCHAR(20) DEFAULT 'pending_approval' CHECK (status IN ('active', 'suspended', 'pending_approval')),
  customer_type VARCHAR(20) DEFAULT 'new' CHECK (customer_type IN ('new', 'old')),
  
  -- Security / Auth
  login_attempt_count INT DEFAULT 0,
  account_locked BOOLEAN DEFAULT FALSE,
  locked_until TIMESTAMP WITH TIME ZONE,
  last_login TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Packages Table
CREATE TABLE public.packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL,
  description TEXT,
  mb_limit INT NOT NULL,
  validity_days INT NOT NULL,
  price_pkr DECIMAL(10,2) NOT NULL,
  old_customer_price_pkr DECIMAL(10,2),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Subscriptions (Active Packages for Users)
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  package_id UUID REFERENCES public.packages(id) ON DELETE RESTRICT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Bills Table
CREATE TABLE public.bills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  package_id UUID REFERENCES public.packages(id) ON DELETE SET NULL,
  bill_number VARCHAR(50) UNIQUE NOT NULL,
  amount_pkr DECIMAL(10,2) NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(20) DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'paid', 'partially_paid', 'overdue')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Payments Table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  bill_id UUID REFERENCES public.bills(id) ON DELETE SET NULL,
  transaction_id VARCHAR(100) UNIQUE NOT NULL,
  method VARCHAR(50) NOT NULL, -- jazzcash, easypaisa, bank
  amount_pkr DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Complaints Table
CREATE TABLE public.complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES public.users(id) ON DELETE SET NULL, -- Admin ID
  ticket_number VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed', 'escalated')),
  resolution_notes TEXT,
  resolved_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Notifications Table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL, -- system, billing, payment_success, etc.
  target_id TEXT, -- ID of related complaint/user/bill
  is_read BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_user_id ON public.users(user_id);
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_bills_user_id ON public.bills(user_id);
CREATE INDEX idx_bills_status ON public.bills(status);
CREATE INDEX idx_complaints_user_id ON public.complaints(user_id);
CREATE INDEX idx_complaints_status ON public.complaints(status);
CREATE INDEX idx_notifications_user_id_read ON public.notifications(user_id, is_read);

-- 8. Admin Profiles
CREATE TABLE IF NOT EXISTS public.admin_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Chat Messages Table
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE, -- The customer's ID (room identifier)
  sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE, -- Who sent the message
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for chat rooms
CREATE INDEX idx_chat_user_id ON public.chat_messages(user_id);
CREATE INDEX idx_chat_created_at ON public.chat_messages(created_at);
