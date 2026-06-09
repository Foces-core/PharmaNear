# AI Agent Instructions for PharmaNear

You are an AI assistant helping to maintain and develop PharmaNear, a full-stack web application.

## 💻 Tech Stack
- **Frontend:** React (Vite), React Router, Leaflet (for maps), standard CSS.
- **Backend:** Node.js, Express, JWT Authentication, bcrypt.
- **Database:** MongoDB (via Mongoose).
- **Package Manager:** `pnpm` (ALWAYS use `pnpm` for installing dependencies, running scripts, etc. Do not use `npm`).

## 🏗️ Architecture & Coding Standards
1. **Current State:** The backend is currently a monolith (`server.js`). 
2. **Goal:** We are actively planning to refactor the backend into an MVC pattern (`routes/`, `controllers/`, `middleware/`). If writing new backend features, suggest or use the MVC approach where possible.
3. **Database:** 
   - `Medicine`: A reference dictionary of drugs.
   - `Pharmacy`: Holds user accounts and location data.
   - `Stock`: Links a `Pharmacy` to `Medicine`s with `quantity` and `price`.
4. **Style:** Write clean, modern ES6+ JavaScript. Use `async/await` for asynchronous operations. Handle errors gracefully using standard Express error handling.

## 🛑 Critical Rules
- Do not remove or break the `backend/medicine.js` seeder script unless explicitly instructed.
- Always protect sensitive endpoints by verifying JWT tokens using the `AuthMiddleware`.
- Never expose environment variables like `JWT_SECRET` or `MONGO_URL` in the frontend codebase.
