# Claude System Context - PharmaNear

Hello Claude! When working on this project, please adhere to the following context and guidelines:

- **Project Core:** PharmaNear is a full-stack application connecting patients with nearby pharmacies to check stock for specific medications.
- **Tech Stack:** React (Vite) on the frontend, Node.js/Express on the backend, and MongoDB (Mongoose) for the database.
- **Package Manager Preference:** You MUST use `pnpm` for any package installation or script execution. Do not suggest or use `npm`.
- **Architectural Roadmap:** The backend is currently a single monolithic `server.js` file. We are actively migrating to a strict MVC architecture. Keep this in mind when suggesting architectural changes or adding new routes.

For deeper context on the database schema and exact routing flows, please refer to the `memory.md` file in this directory. For strict coding rules, see `agent.md`.
