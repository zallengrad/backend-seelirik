# 📘 Dokumentasi API SeeLirik v1

Dokumentasi ini menjelaskan semua endpoint REST API yang tersedia untuk sistem monitoring SeeLirik. Setiap endpoint dijelaskan dengan method, path, body (jika ada), dan contoh respons.

---

## 🧑‍💼 Authentication

### 🔐 POST `/register`
**Deskripsi**: Mendaftarkan user baru.

**Body**:
```json
{
  "username": "ale",
  "email": "ale@mail.com",
  "password": "rahasia123",
  "storeName": "Toko Ale",
  "storeLocation": "Bandung",
  "storeDescription": "Toko perangkat keamanan"
}
```

**Response**:
```json
{
  "status": "success",
  "message": "User berhasil didaftarkan",
  "data": { "userId": "u123" }
}
```

---

### 🔐 POST `/login`
**Deskripsi**: Melakukan login dan mendapatkan token autentikasi.

**Body**:
```json
{
  "email": "ale@mail.com",
  "password": "rahasia123"
}
```

**Response**:
```json
{
  "status": "success",
  "message": "Login berhasil",
  "data": { "token": "<JWT>" }
}
```

---

### 🔐 GET `/me`
**Deskripsi**: Mendapatkan informasi user yang sedang login.  
**Header**:
```
Authorization: Bearer <token>
```

**Response**:
```json
{
  "status": "success",
  "data": {
    "userId": "u123",
    "username": "ale",
    "email": "ale@mail.com",
    "storeName": "Toko Ale",
    "storeLocation": "Bandung",
    "storeDescription": "Toko perangkat keamanan"
  }
}
```

---

## 📷 Riwayat Aktivitas

### 📥 POST `/riwayat`
**Deskripsi**: Menyimpan hasil deteksi aktivitas mencurigakan dari sistem ML.

**Body**:
```json
{
  "kameraId": "cam01",
  "kategori": "Pencurian",
  "image": "/uploads/img.jpg",
  "video": "/uploads/vid.mp4",
  "deskripsi": "Mengambil barang tanpa membayar"
}
```

**Response**:
```json
{
  "status": "success",
  "message": "Riwayat aktivitas berhasil disimpan",
  "data": { "riwayatId": "rxyz" }
}
```

---

### 📤 GET `/riwayat`
**Deskripsi**: Mengambil semua riwayat aktivitas milik user.  
**Header**:
```
Authorization: Bearer <token>
```

**Response**:
```json
{
  "status": "success",
  "data": [
    {
      "id": "r123",
      "kameraId": "cam01",
      "kategori": "Pencurian",
      "image": "/uploads/img.jpg",
      "video": "/uploads/vid.mp4",
      "timestamp": "2025-05-25T13:00:00Z",
      "deskripsi": "Mengambil barang tanpa membayar"
    }
  ]
}
```

---

> Semua endpoint membutuhkan token JWT kecuali `/register` dan `/login`. Token dikirim lewat header: `Authorization: Bearer <token>`
