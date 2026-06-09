# PharmaNear - Project Memory & Context

## 📖 What is PharmaNear?
PharmaNear connects patients searching for specific medications with nearby pharmacies that have them in stock. It features a map interface for users and a secure admin dashboard for pharmacy owners to manage their inventory and profile.

## 🗄️ Database Models Overview
1. **Medicine:** A static reference dictionary of drugs fetched from the NIH RxTerms API.
   - Core Fields: `name`, `strengths`, `routes`.
2. **Pharmacy:** The user account for a pharmacy owner.
   - Core Fields: `user_name`, `password` (hashed with bcrypt), `latitude`, `longitude`, `address`, `phone_number`.
3. **Stock:** The inventory mapping that glues Pharmacies to Medicines.
   - Core Fields: `pharmacy_id` (refers to a Pharmacy), `medications` (an array of objects containing a `medicine_id`, `quantity`, and `price`).

## 🗺️ Key Workflows
- **Login/Signup:** Managed in `frontend/src/components/SignupPage.jsx` and `LoginPage.jsx`. It talks to the `/api/pharmacy/signup` or `/login` routes on the backend. A successful login generates a JWT token.
- **Stock Management:** A pharmacy logs in, navigates to `PharmacyDashboard.jsx`, and adds stock. The backend checks if the drug exists in `Medicine` (adding it if not), then updates the `Stock` model for that specific pharmacy.
- **User Search:** A user enters a drug name. The backend finds the drug's Object ID in `Medicine`, searches the `Stock` collection for all pharmacies holding that ID, and the frontend plots them on a Leaflet map.
