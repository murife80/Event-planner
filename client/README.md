# 🗓️ Event Planner App

A full‑stack web application built with **Flask (Python)** and **React (JavaScript)** that lets users create, manage, and RSVP to events. It showcases RESTful APIs, relational data modelling, modern form handling with Formik + Yup, and client‑side routing with a persistent navbar.

> **Live Demo:** *Add URL once deployed*

---

## 📋 Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Architecture](#architecture)
4. [Getting Started](#getting-started)
5. [Environment Variables](#environment-variables)
6. [Scripts](#scripts)
7. [API Reference](#api-reference)
8. [Folder Structure](#folder-structure)
9. [Screenshots](#screenshots)
10. [Roadmap](#roadmap)
11. [Rubric Checklist](#rubric-checklist)
12. [Contributing](#contributing)
13. [License](#license)

---

## ✨ Features

* **Event CRUD** – Create, read, update, and delete events from the UI.
* **RSVP System** – Users can RSVP with a custom status (`Going`, `Maybe`, `Not Going`).
* **Persistent Navbar** – Quick navigation between *Home*, *Create Event*, and *My Events* routes using **React Router**.
* **Formik + Yup Validation** – Robust, client‑side form validation with clear error messages.
* **Responsive UI** – Clean layout that adapts to desktop and mobile.
* **RESTful Flask API** – JSON endpoints with proper status codes and error handling.
* **Database Migrations** – Managed by **Flask‑Migrate**.

> **Stretch Goals**: Authentication via JWT, event categories & filtering, image uploads, calendar view, email/SMS notifications.

---

## 🛠️ Tech Stack

### Backend

* Python 3.11
* Flask & Flask‑RESTful
* SQLAlchemy ORM
* Flask‑Migrate
* Marshmallow (serialization)

### Frontend

* React 19
* React Router DOM 7
* Formik & Yup
* Axios / Fetch API
* Vite (build tool)

### DevOps

* Docker (optional)
* Render (Flask) & Netlify (React) for deployment

---

## 🏗️ Architecture

```text
client/         # React SPA
 ├─ src/
 │   ├─ components/  # Navbar, EventCard, etc.
 │   ├─ pages/       # HomePage, CreateEventPage, MyEventsPage
 │   └─ api/         # axios wrappers
server/         # Flask API
 ├─ app.py
 ├─ models.py
 ├─ routes/
 └─ migrations/
```

A good separation of concerns ensures maintainability and scalability.

---

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/<your‑username>/event-planner.git
cd event-planner
```

### 2. Backend Setup

```bash
cd server
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
flask db upgrade  # apply migrations
flask run         # starts on http://127.0.0.1:5000
```

### 3. Frontend Setup

```bash
cd ../client
npm install
npm run dev       # starts on http://localhost:5173
```

> Both servers must run concurrently in separate terminals during development.

---

## 🔐 Environment Variables

Create a `.env` file in `server/`:

```
FLASK_ENV=development
DATABASE_URL=sqlite:///instance/dev.db   # or postgres URL
SECRET_KEY=supersecret
```

Create a `.env` in `client/` (if needed):

```
VITE_API_BASE_URL=http://127.0.0.1:5000
```

---

## 🧩 Scripts

| Command                     | Location  | Purpose                |
| --------------------------- | --------- | ---------------------- |
| `npm run dev`               | `client/` | Start React dev server |
| `npm run build`             | `client/` | Production build       |
| `flask run`                 | `server/` | Start Flask API        |
| `flask db migrate -m "msg"` | `server/` | Create migration       |
| `flask db upgrade`          | `server/` | Apply migrations       |

---

## 📑 API Reference

| Method | Endpoint       | Description            |
| ------ | -------------- | ---------------------- |
| GET    | `/events`      | List all events        |
| GET    | `/events/<id>` | Retrieve event details |
| POST   | `/events`      | Create a new event     |
| PATCH  | `/events/<id>` | Update an event        |
| DELETE | `/events/<id>` | Delete an event        |
| POST   | `/rsvps`       | RSVP to an event       |
| GET    | `/rsvps`       | List all RSVPs         |
| DELETE | `/rsvps/<id>`  | Cancel RSVP            |

---

## 🗂️ Folder Structure (Client)

```text
src/
 ├─ components/
 │   ├─ Navbar.js
 │   ├─ EventCard.js
 │   └─ ...
 ├─ pages/
 │   ├─ HomePage.js
 │   ├─ CreateEventPage.js
 │   └─ MyEventsPage.js
 ├─ api/
 │   └─ events.js
 ├─ App.js
 └─ main.jsx
```

---

## 📸 Screenshots

Add GIFs or images of:

1. Home page listing events
2. Create Event form with validation errors
3. Event Details with RSVP list
4. Mobile view with hamburger menu (if implemented)

---

## 🛣️ Roadmap

* [ ] Deploy backend to Render
* [ ] Deploy frontend to Netlify
* [ ] Add authentication via JWT
* [ ] Event image uploads (Cloudinary)
* [ ] Calendar view with FullCalendar

---

## 📑 Rubric Checklist

### Backend (Flask) – 5 Marks

* [x] ≥3 models
* [x] 2 one‑to‑many relationships
* [x] 1 many‑to‑many relationship with extra attribute
* [x] CRUD routes
* [x] Validation & errors

### Frontend (React) – 5 Marks

* [x] Data fetching & display
* [x] React Router ≥3 routes
* [x] Navbar navigation
* [x] CRUD interactions
* [x] State management (hooks)

### Forms (Formik + Yup) – 5 Marks

* [x] All create/update forms use Formik
* [x] Type & format validation
* [x] Error feedback

### Code Quality – 3 Marks

* [x] Clean folder layout
* [x] Meaningful names
* [x] DRY & reusable components

### Docs & Deployment – 2 Marks

* [x] Comprehensive README
* [ ] Live deployment

**Total:** /20

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 🙋‍♂️ Author

**Melvin Muchoi**
[GitHub](https://github.com/your-username) • [LinkedIn](https://linkedin.com/in/your-profile)
