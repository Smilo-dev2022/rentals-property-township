# Cassie Rentals — Township Property Marketplace
Description: Cassie Rentals is a mobile-first property rental and sales platform built for South Africa's township communities. The platform connects landlords and tenants directly and supports listing and searching for rooms, flats, houses, and properties for sale.

# 🏡 Cassie Rentals Backend

**Cassie Rentals** is a township-focused housing marketplace app that connects landlords and tenants directly. This backend system, built with Node.js, Express, and MongoDB, powers all the core functionality for user authentication, listing management, and region-based filtering.

---

## 📌 Key Features

- 🔐 JWT-based authentication for tenants and landlords
- 🏠 CRUD functionality for property listings (rooms, flats, houses, and homes for sale)
- 🗺 Region-based filtering (by township, city, province)
- ⚙️ Admin-only region management endpoints
- 📦 Scalable and modular RESTful API

---

## 🧱 Tech Stack

- Node.js + Express (Server)
- MongoDB + Mongoose (Database)
- JWT (Authentication)
- CORS + dotenv
- Vite + React + Tailwind (Frontend)

---

## 🛠 Local Development

1. Start MongoDB via Docker Compose
```bash
docker compose up -d
```

2. Create backend .env from example
```bash
cp backend/.env.example backend/.env
```

3. Install dependencies (root and backend)
```bash
npm install
cd backend && npm install && cd ..
```

4. Seed sample data
```bash
npm run seed
```

5. Run both frontend and backend
```bash
npm run dev:all
```

Frontend: http://localhost:5173

API: http://localhost:5000/api
