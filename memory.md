# Project Memory & Context
This document records all important architectural decisions and their reasoning for future developers and AI agents.

## 📖 Overview
Connects patients with nearby pharmacies to check medication stock. Features user map and pharmacy admin dashboard.

## 🗄️ Database Models
1. **Medicine:** Static drug dictionary (from NIH RxTerms API).
2. **Pharmacy:** Owner account (bcrypt password, location).
3. **Stock:** Maps Pharmacy to Medicine (quantity, price).

## 🗺️ Workflows
- **Auth:** `SignupPage.jsx`/`LoginPage.jsx` -> `/api/pharmacy/*`. Returns JWT.
- **Stock:** Pharmacy logs in -> adds stock. Backend adds to `Medicine` if missing, updates `Stock`.
- **Search:** User searches drug -> Backend finds `Medicine` ID -> queries `Stock` -> Frontend plots on Leaflet map.

**RECORD ANY AND ALL FUTURE ARCHITECTURAL OR IMPORTANT DETAILS IN THIS DOCUMENT.**

## 🌿 Branching Strategy
- We currently use a single-branch workflow. All active development and pull requests target the `main` branch directly. The CI pipeline runs tests against PRs to `main` to keep everything simple and fast.