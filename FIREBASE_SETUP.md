# 🔥 Firebase Integration Guide

## Setup Firebase untuk PropertiHub

### 1. Firebase Configuration

Firebase sudah dikonfigurasi dengan:
- **Project ID:** `kprasia-f50c2`
- **App ID:** `1:28449741969:web:f54bd399840da763467330`

### 2. Setup Firestore Security Rules

Agar aplikasi bisa membaca dan menulis data ke Firebase, Anda perlu setup Firestore Security Rules:

1. Buka [Firebase Console](https://console.firebase.google.com/project/kprasia-f50c2/firestore/rules)
2. Klik "Edit rules" atau "Publish rules"
3. Ganti dengan rules berikut:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

4. Klik "Publish" untuk menyimpan rules

**Catatan:** Rules ini mengizinkan read/write untuk semua user. Untuk production, Anda harus menambahkan authentication check.

### 3. Seed Data ke Firebase

Ada dua cara untuk mengisi data ke Firebase:

#### Opsi A: Melalui Web Interface (Rekomendasi)

1. Buka aplikasi di browser:
   ```
   http://localhost:3000/seed-firebase.html
   ```

2. Klik tombol "📝 Seed Data to Firebase"

3. Tunggu hingga proses selesai

4. Data akan diisi:
   - 4 Property Types
   - 3 Locations (Bandung, Bogor, Bekasi)
   - 3 Promos
   - 2 Agents
   - 5 Properties
   - 2 Visitors
   - 1 Admin User (admin/admin123)
   - 2 Articles
   - 3 Reviews
   - Agency settings
   - SEO settings

#### Opsi B: Manual di Firebase Console

1. Buka [Firebase Console Firestore](https://console.firebase.google.com/project/kprasia-f50c2/firestore/data)
2. Klik "Start collection" untuk membuat setiap collection
3. Copy data dari `public/seed-firebase.html` ke setiap collection

### 4. Collections yang Dibuat

| Collection | Deskripsi | Jumlah Data |
|-----------|-----------|-------------|
| `propertyTypes` | Jenis properti (Rumah, Apartemen, dll) | 4 |
| `locations` | Lokasi (Kabupaten & Kecamatan) | 3 |
| `promos` | Promo aktif | 3 |
| `agents` | Agen properti | 2 |
| `properties` | Listing properti | 5 |
| `visitors` | Leads dari visitor | 2 |
| `adminUsers` | User admin | 1 |
| `articles` | Artikel blog | 2 |
| `reviews` | Testimoni pelanggan | 3 |
| `agency` | Settings agensi | 1 |
| `seo` | SEO settings | 1 |

### 5. Update Aplikasi untuk Menggunakan Firebase

Setelah data di-seed, aplikasi sudah siap menggunakan Firebase. Berikut API endpoint yang tersedia:

#### Firebase Data Endpoint
- **GET** `/api/firebase-data` - Ambil semua data dari Firebase

### 6. Cek Status Firebase

Setelah seeding, cek data di Firebase Console:

[https://console.firebase.google.com/project/kprasia-f50c2/firestore/data](https://console.firebase.google.com/project/kprasia-f50c2/firestore/data)

### 7. Login Admin

```
Username: admin
Password: admin123
```

---

## 📝 Notes

- Firebase menggunakan **Real-time Database/Firestore** sebagai backend
- Data bisa diakses dari mana saja dengan koneksi internet
- Sinkronisasi real-time akan memperbarui data secara otomatis
- Untuk production, perlu setup:
  - Authentication (Firebase Auth)
  - Security Rules yang lebih ketat
  - Indexing untuk query yang lebih efisien

---

## 🚨 Troubleshooting

### Error: "PERMISSION_DENIED"
Pastikan Firestore Security Rules sudah dipublish dengan rules yang benar.

### Data tidak muncul
1. Cek Firebase Console apakah data sudah ter-seed
2. Cek browser console untuk error
3. Pastikan Firebase configuration benar

### Seeding gagal
1. Pastikan sudah mengubah Firestore Security Rules
2. Cek Firebase Console di tab "Rules"
3. Pastikan rules sudah dipublish

---

## 📚 Firebase Documentation

- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Security Rules](https://firebase.google.com/docs/firestore/security/rules)
- [Firebase Web SDK](https://firebase.google.com/docs/web/setup)