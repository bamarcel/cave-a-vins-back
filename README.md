# Cave à Vins — Back-end

REST API for managing a personal wine collection, built with Node.js, Express and PostgreSQL.

## Live

API base URL: `https://cave-a-vins-back-production.up.railway.app`

## Stack

- **Node.js / Express** — REST API
- **PostgreSQL** (Railway) — relational database
- **Supabase Storage** — photo storage
- **JWT + bcrypt** — authentication
- **Multer** — file upload middleware
- **Deployed on Railway**

## Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/auth/register` | ✗ | Create an account |
| POST | `/auth/login` | ✗ | Login and receive a JWT |
| GET | `/bouteilles` | ✓ | List bottles (filters: cépage, région, note_min) |
| POST | `/bouteilles` | ✓ | Add a bottle |
| GET | `/bouteilles/:id` | ✓ | Get a bottle by id |
| PUT | `/bouteilles/:id` | ✓ | Update a bottle |
| DELETE | `/bouteilles/:id` | ✓ | Delete a bottle |
| POST | `/bouteilles/:id/photo` | ✓ | Upload a photo |

## Project structure

```
src/
├── config/
│   ├── database.js       # PostgreSQL connection pool
│   └── supabase.js       # Supabase Storage client
├── middlewares/
│   ├── auth.middleware.js    # JWT verification
│   └── upload.middleware.js  # Multer file parsing
├── modules/
│   ├── auth/             # register, login
│   └── bouteilles/       # CRUD + photo upload
└── app.js
```

## Local setup

```bash
git clone https://github.com/bamarcel/cave-a-vins-back
cd cave-a-vins-back
npm install
cp .env.example .env   # fill in your values
npm run dev
```

**Required environment variables:**

```
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=7d
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
```
