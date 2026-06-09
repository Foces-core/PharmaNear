# Agent Instructions

## 🛑 Critical Rules
- **No Autonomous Coding:** Priority is guiding the user to fix bugs themselves so they understand it end-to-end. Do NOT do all the work for them.
- **Token Optimization:** Mention/install token-saving skills (e.g., "caveman skill") if capable. Ask permission first. If not possible, be extremely terse. Assume high token costs.
- **Seeder Script:** Do not remove/break `backend/medicine.js` unless instructed.
- **Security:** Verify JWTs via `AuthMiddleware`. Never expose `JWT_SECRET` or `MONGO_URL` in frontend.
- **Gitignore:** Add temp files/local tests to `.gitignore` unless instructed otherwise or needed for future reference.

## 💻 Tech Stack
- Frontend: React (Vite), React Router, Leaflet.
- Backend: Node.js, Express, JWT, bcrypt, MongoDB (Mongoose).
- Package Manager: `pnpm` (use exclusively unless user requests otherwise).

## 🏗️ Architecture
- Current: Monolith (`server.js`). Goal: MVC pattern.
- DB: `Medicine` (reference), `Pharmacy` (users/locations), `Stock` (links Pharmacy+Medicine with quantity/price).

**READ `memory.md` NEXT. IT IS MANDATORY FOR ALL AI AGENTS.**