# Shelfly – Book Library Management System

A simple full-stack (MERN) library app. Users sign up, log in and manage book records through a React frontend connected to an Express REST API that stores data in MongoDB with Mongoose.

```
BookLibraryManagementSystem/
├── backend/        Express + Mongoose REST API   → deploy on Render
├── frontend/       React (Vite) UI               → deploy on Netlify
├── netlify.toml    Netlify build settings (base: frontend)
└── render.yaml     Render blueprint (rootDir: backend)
```

## Features

- Sign up and log in (passwords hashed with bcrypt, sessions use a JWT)
- Add books with **title, author, category and availability status**, plus an optional ISBN (shows the real cover from the Open Library Covers API) and who the book is issued to
- List all books and **search by title or author** (done by the API)
- Filter by status and category; separate **Available** and **Issued** views
- **Edit** and **delete** books (delete asks for confirmation)
- One-click **Issue** / **Return** to mark books Issued or Available
- Dashboard with totals, a books-by-category chart, recently added covers and an availability bar
- Responsive layout with a slide-out menu on small screens

## Run locally

Requires Node 20+ and (ideally) MongoDB running on `mongodb://127.0.0.1:27017`.

```bash
# 1. API
cd backend
cp .env.example .env      # then set JWT_SECRET to any long random string
npm install
npm run dev               # http://localhost:5050

# 2. Frontend (new terminal)
cd frontend
npm install
npm run dev               # http://localhost:5174
```

Open http://localhost:5174 and create an account. When the library is empty, 12 sample books are added on server start (turn this off with `SEED_SAMPLE_BOOKS=false`).

### If MongoDB isn't available

If the API can't connect to MongoDB within about 4 seconds, it logs a warning and uses a **temporary local JSON file** (`backend/data/local-db.json`), so the app still works. The frontend shows a **Temporary storage** badge in the top bar while this is active. Set `ALLOW_FILE_FALLBACK=false` to make the server fail instead. It's `false` in `render.yaml`, because Render's disk is wiped on every deploy.

## API

Base URL: `http://localhost:5050/api`. Book routes need an `Authorization: Bearer <token>` header.

| Method | Route | Body / query | Description |
|---|---|---|---|
| GET | `/health` | | Status and storage mode (`mongodb` or `file`) |
| POST | `/auth/signup` | `{ name, email, password }` | Create account → `{ token, user }` |
| POST | `/auth/login` | `{ email, password }` | Log in → `{ token, user }` |
| GET | `/auth/me` | | Current user |
| GET | `/books` | `?search=&status=&category=` | List books (search matches title or author) |
| GET | `/books/:id` | | One book |
| POST | `/books` | `{ title, author, category, status, isbn?, issuedTo? }` | Add a book |
| PUT | `/books/:id` | any of the fields above | Update a book, e.g. `{ "status": "Issued" }` |
| DELETE | `/books/:id` | | Delete a book |

Categories: Fiction, Technology, Science, History, Biography, Self-Help, Others. Status: Available or Issued.
Errors return `{ message, errors? }` with a 400, 401, 404 or 409 status code.

## Environment variables

**backend/.env**

| Variable | Default | Notes |
|---|---|---|
| `PORT` | `5050` | Render sets this automatically |
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/book_library` | Use your MongoDB Atlas string in production |
| `JWT_SECRET` | *(required in production)* | Long random string |
| `JWT_EXPIRES_IN` | `7d` | |
| `CLIENT_ORIGIN` | `http://localhost:5174,http://127.0.0.1:5174` | Comma-separated frontend URLs allowed by CORS |
| `ALLOW_FILE_FALLBACK` | `true` | Use a local JSON file if MongoDB is down |
| `FILE_DB_PATH` | `data/local-db.json` | |
| `SEED_SAMPLE_BOOKS` | `true` | Add sample books when the library is empty |

**frontend/.env.development** (and Netlify environment variables)

| Variable | Example |
|---|---|
| `VITE_API_URL` | `http://localhost:5050/api` locally, `https://<your-api>.onrender.com/api` on Netlify |

## Deploy

1. **MongoDB Atlas**: create a free cluster, add a database user, allow network access from anywhere (`0.0.0.0/0`) and copy the connection string.
2. **Push** the project to GitHub.
3. **Render (backend)**: New → Web Service (or Blueprint, which uses `render.yaml`). Set Root Directory to `backend`, Build Command to `npm install` and Start Command to `npm start`. Add the environment variables `MONGODB_URI`, `JWT_SECRET`, `NODE_ENV=production` and `ALLOW_FILE_FALLBACK=false`. Copy the service URL once it's live.
4. **Netlify (frontend)**: Import the repository. `netlify.toml` sets the base directory to `frontend`, the build command to `npm run build` and the publish directory to `dist`. Add the environment variable `VITE_API_URL=https://<your-render-service>.onrender.com/api` and deploy.
5. **CORS**: in Render, set `CLIENT_ORIGIN=https://<your-site>.netlify.app` and redeploy the API.
6. On the live site, test signup, login, add, edit, search, status update and delete.

Render's free tier sleeps when idle, so the first request after a break can take around 30–50 seconds.
