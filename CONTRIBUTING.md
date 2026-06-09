# Contributing to PharmaNear

First off, thank you for considering contributing to PharmaNear! It's people like you that make open-source a great community.

## 🛠️ Local Development Setup

We use `pnpm` as our package manager. Please ensure you have Node.js and `pnpm` installed.

1. **Clone the repo**
   ```bash
   git clone https://github.com/Foces-core/pharmanear.git
   cd pharmanear
   ```

2. **Install Dependencies**
   Open two terminals, one for the frontend and one for the backend.
   ```bash
   # Terminal 1 (Backend)
   cd backend
   pnpm install

   # Terminal 2 (Frontend)
   cd frontend
   pnpm install
   ```

## 🧪 Testing Your Changes (CRITICAL)

**Before opening a Pull Request, you MUST test your changes locally!** 

We have automated tests set up for both the frontend and backend. Your PR will be blocked by GitHub if these tests fail.

To run all tests across the entire project at once, run the following from the root `PharmaNear` directory:

```bash
pnpm run test
```

If you only want to test a specific area:
- Backend: `cd backend && pnpm test`
- Frontend: `cd frontend && pnpm test`

## 📝 Pull Request Process

1. Create a new branch from `main` (e.g., `git checkout -b feature/awesome-new-button`).
2. Make your changes and commit them with clear, descriptive messages.
3. Run the tests locally using `pnpm run test` and ensure they pass.
4. Push your branch and open a Pull Request.
5. In your PR description, explain what you changed and why.

## 🏛️ Architecture Goals

If you are contributing to the backend, please note that we are actively trying to migrate away from a monolithic `server.js` file toward a strict MVC pattern (`routes/`, `controllers/`, `middleware/`). If your PR helps us move toward that goal, we will love you forever!
