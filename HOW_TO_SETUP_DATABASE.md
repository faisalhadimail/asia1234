# Cara Setup Database Supabase

## 🚨 PENTING: Database Belum Terhubung

Untuk menghubungkan aplikasi ke database, Anda PERLU menjalankan SQL script di Supabase SQL Editor.

---

## 📋 Langkah-Langkah Setup

### Step 1: Buka Supabase SQL Editor

Buka URL ini di browser:
```
https://supabase.com/dashboard/project/cdornopbukdwgysgpvrf/sql/new
```

### Step 2: Copy & Paste SQL Script

SQL script tersedia di file:
```
/home/z/my-project/supabase-setup.sql
```

Atau copy script berikut langsung ke SQL Editor:

```sql
-- Drop existing tables (FRESH START)
DROP TABLE IF EXISTS Visitor CASCADE;
DROP TABLE IF EXISTS AdminUser CASCADE;

-- Create AdminUser table
CREATE TABLE AdminUser (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT DEFAULT '',
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  email TEXT,
  role TEXT DEFAULT 'admin',
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Visitor (Leads) table
CREATE TABLE Visitor (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  date TEXT DEFAULT '',
  name TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  email TEXT,
  type TEXT DEFAULT '',
  building TEXT DEFAULT '',
  location TEXT DEFAULT '',
  dp TEXT DEFAULT '',
  promo TEXT DEFAULT '',
  status TEXT DEFAULT 'Baru',
  notes TEXT,
  interest TEXT,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_visitor_created_at ON Visitor(createdAt DESC);
CREATE INDEX idx_visitor_status ON Visitor(status);
CREATE INDEX idx_adminuser_username ON AdminUser(username);

-- Insert admin users
INSERT INTO AdminUser (username, password, name, email, role)
VALUES
  ('admin', 'admin123', 'Super Admin', 'admin@example.com', 'superadmin'),
  ('marketing', 'marketing123', 'Marketing Team', 'marketing@example.com', 'admin'),
  ('sales', 'sales123', 'Sales Team', 'sales@example.com', 'admin');

-- Insert visitors/leads
INSERT INTO Visitor (name, phone, email, type, building, location, status, notes, interest)
VALUES
  ('Budi Santoso', '081234567890', 'budi@email.com', 'Rumah', '90m²', 'Jakarta Selatan', 'Baru', 'Lead dari website', 'Rumah Minimalis'),
  ('Siti Rahayu', '081234567891', 'siti@email.com', 'Apartemen', '2BR', 'Jakarta Pusat', 'Follow Up', 'Ingin info unit 2BR', 'Apartemen Mewah'),
  ('Andi Wijaya', '081234567892', 'andi@email.com', 'Rumah', '120m²', 'Bogor', 'Hot Lead', 'Siap KPR, survey minggu depan', 'Cluster Family'),
  ('Dewi Lestari', '081234567893', 'dewi@email.com', 'Ruko', '2 Lantai', 'Bandung', 'Closing', 'Booking fee sudah dibayarkan', 'Ruko Komersial'),
  ('Eko Pratama', '081234567894', 'eko@email.com', 'Tanah', '200m²', 'Bekasi', 'Baru', 'Cari lokasi strategis dekat tol', 'Tanah Kavling');

-- Verification
SELECT 'Database Setup Complete!' as message;

-- Count records
SELECT 'AdminUser' as table_name, COUNT(*) as count FROM AdminUser
UNION ALL
SELECT 'Visitor', COUNT(*) FROM Visitor;
```

### Step 3: Klik "Run"

Klik tombol **"Run"** di SQL Editor untuk mengeksekusi script.

### Step 4: Verify

Setelah selesai, Anda harus melihat output seperti:
```
Database Setup Complete!
table_name | count
-----------|------
AdminUser  | 3
Visitor    | 5
```

---

## 🔐 Login Credentials

Setelah setup selesai, login ke aplikasi dengan:

**Username:** `admin`
**Password:** `admin123`

Admin users tambahan:
- **marketing** / **marketing123**
- **sales** / **sales123**

---

## ✅ Checklist Setup

- [ ] Buka Supabase SQL Editor
- [ ] Copy SQL script
- [ ] Paste ke SQL Editor
- [ ] Klik "Run"
- [ ] Verify output (AdminUser: 3, Visitor: 5)
- [ ] Refresh Preview Panel
- [ ] Login ke aplikasi

---

## ❓ Mengapa Tidak Bisa Auto-Setup?

Supabase memiliki security restrictions yang tidak mengizinkan pembuatan tabel via API client secara langsung. SQL Script perlu dijalankan secara manual di Supabase SQL Editor untuk keamanan.

---

## 📝 File Referensi

- SQL Script: `/home/z/my-project/supabase-setup.sql`
- Database URL: `postgresql://postgres:%24umateraP11@db.cdornopbukdwgysgpvrf.supabase.co:5432/postgres`
- Supabase Dashboard: https://supabase.com/dashboard/project/cdornopbukdwgysgpvrf