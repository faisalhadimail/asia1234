-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create AdminUser table
CREATE TABLE IF NOT EXISTS AdminUser (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  role TEXT DEFAULT 'admin',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Visitor (Leads) table
CREATE TABLE IF NOT EXISTS Visitor (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE DEFAULT CURRENT_DATE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  type TEXT,
  building TEXT,
  location TEXT,
  dp TEXT,
  promo TEXT,
  status TEXT DEFAULT 'Baru',
  notes TEXT,
  interest TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user
INSERT INTO AdminUser (username, password, name, email, role)
VALUES ('admin', 'admin123', 'Super Admin', 'admin@example.com', 'superadmin')
ON CONFLICT (username) DO NOTHING;

-- Insert sample visitors
INSERT INTO Visitor (name, phone, email, type, building, location, status, notes, interest)
VALUES
  ('Budi Santoso', '081234567890', 'budi@email.com', 'Rumah', '90m²', 'Jakarta Selatan', 'Baru', 'Lead dari website', 'Rumah Minimalis'),
  ('Siti Rahayu', '081234567891', 'siti@email.com', 'Apartemen', '2BR', 'Jakarta Pusat', 'Follow Up', 'Ingin info unit 2BR', 'Apartemen Mewah'),
  ('Andi Wijaya', '081234567892', 'andi@email.com', 'Rumah', '120m²', 'Bogor', 'Hot Lead', 'Siap KPR, survey minggu depan', 'Cluster Family'),
  ('Dewi Lestari', '081234567893', 'dewi@email.com', 'Ruko', '2 Lantai', 'Bandung', 'Closing', 'Booking fee sudah dibayarkan', 'Ruko Komersial'),
  ('Eko Pratama', '081234567894', 'eko@email.com', 'Tanah', '200m²', 'Bekasi', 'Baru', 'Cari lokasi strategis dekat tol', 'Tanah Kavling')
ON CONFLICT DO NOTHING;