# 💊 PharmaNear: Medicine Location & Inventory Management System

**PharmaNear** is a full-stack web application designed to bridge the gap between users searching for specific medicines and nearby pharmacies that stock them. It offers an intuitive search experience for users and a secure admin dashboard for pharmacy owners to manage inventory and profile details efficiently.

🌐 **Live Demo:** [https://pharmanear-frontend.onrender.com](https://pharmanear-frontend.onrender.com)

---

## ✨ Features

### 👤 For Users
- 🔍 **Smart Medicine Search:** Search for medicines by name, dosage, and quantity.
- 🗺️ **Interactive Map:** View nearby pharmacies on a real-time map powered by Leaflet, showing stock status, prices, and availability.
- ⚡ **Instant Results:** Get real-time updates on medicine availability, pricing, and pharmacy details.

### 🏪 For Pharmacy Owners
- 🔐 **Secure Authentication:** Dedicated login and signup for pharmacy accounts with JWT-based security.
- 📦 **Inventory Management:** Easily add, edit, or remove medicines, including stock quantities and pricing.
- 🏠 **Profile Management:** Update pharmacy information such as address, city, state, license number, and GPS coordinates for accurate location mapping.

---

## 💻 Tech Stack

| Layer       | Technology              | Key Libraries/Tools |
|-------------|-------------------------|---------------------|
| **Frontend**| React (Vite)           | React Router, Leaflet, React Icons |
| **Backend** | Node.js + Express      | MongoDB, Mongoose, JWT, CORS |
| **Database**| MongoDB                 | Mongoose ODM (Models: Medicine, Pharmacy, Stock) |
| **Styling** | CSS                    | Modular, component-based styles |
| **Deployment** | Render                 | Full-stack deployment with static file serving |

---

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (local or cloud instance) - [MongoDB Atlas](https://www.mongodb.com/atlas) for cloud setup
- **Git** - [Download here](https://git-scm.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/pharmanear.git
cd pharmanear
```

### 2. Environment Configuration

Create `.env` files in both `frontend/` and `backend/` directories.

#### Frontend (.env in `frontend/`)
```bash
VITE_BACKEND_URL=http://localhost:5000
```

#### Backend (.env in `backend/`)
```bash
PORT=5000
MONGO_URL=mongodb://localhost:27017/pharmanear
JWT_SECRET=your_super_secure_jwt_secret_key_here
CORS_ORIGIN=http://localhost:5173
```

> **Note:** Replace `your_super_secure_jwt_secret_key_here` with a strong, unique secret. For production, use environment variables provided by Render.

### 3. Backend Setup
```bash
cd backend
npm install
npm start  # or node server.js
```
The backend will run on [http://localhost:5000](http://localhost:5000).

### 4. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
The frontend will run on [http://localhost:5173](http://localhost:5173).

### 5. Access the Application
- Open [http://localhost:5173](http://localhost:5173) in your browser.
- For pharmacy admin features, sign up or log in as a pharmacy owner.

---

## 📖 Usage

1. **User Search:** Enter medicine details on the home page and click "Search Nearby" to view pharmacies on the map.
2. **Pharmacy Management:** Log in as a pharmacy owner to add medicines, update stock, and edit profile details.
3. **Map Interaction:** Click on map markers to view pharmacy details, including contact info and stock status.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature-name`.
3. Commit your changes: `git commit -m "Add your feature"`.
4. Push to the branch: `git push origin feature/your-feature-name`.
5. Open a Pull Request.

Please ensure your code follows the project's style guidelines and includes tests where applicable.

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📬 Contact

- **Project Link:** [https://github.com/your-username/pharmanear](https://github.com/your-username/pharmanear)
- **Live Demo:** [https://pharmanear-frontend.onrender.com](https://pharmanear-frontend.onrender.com)
- **Issues:** Open an issue on GitHub for bugs or feature requests.

---

