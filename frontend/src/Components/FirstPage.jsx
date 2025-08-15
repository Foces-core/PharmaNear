import React, { useState } from "react";
import { FaSearch, FaCapsules, FaSortNumericUp } from "react-icons/fa"; // added icons
import "./First.css";

function FindMedicine() {
  const [medicine, setMedicine] = useState("");
  const [dosage, setDosage] = useState("");
  const [quantity, setQuantity] = useState("");

  return (
    <div className="find-medicine-page">
      
      <header className="fm-header">
        <h6 className="fm-text">FindMeds</h6>
        <div className="fm-location">
          <h6>Current address</h6>
          <h6>Select location </h6>
        </div>
      </header>

      
      <main className="fm-main">
        <h2 className="fm-title">Find Your Medicine</h2>

        <div className="fm-input-group relative">
          <FaSearch className="fm-icon" />
          <input
            type="text"
            placeholder="Search for medicines & health products"
            value={medicine}
            onChange={(e) => setMedicine(e.target.value)}
            className="fm-input with-icon"
          />
        </div>

        <div className="flexrow">
          <div className="fm-input-groups relative">
            <FaCapsules className="fm-icon" />
            <input
              type="text"
              placeholder="Dosage/Strength"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              className="fm-input with-icon"
            />
          </div>

          <div className="fm-input-groups relative">
            <FaSortNumericUp className="fm-icon" />
            <input
              type="text"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="fm-input with-icon"
            />
          </div>
        </div>

        <button className="fm-search-btn" disabled>
          Search Nearby
        </button>
      </main>

      
      <footer className="fm-footer">
        <a href="/">About Us</a>
        <a href="/">Services</a>
        <a href="/">Contact</a>
        <a href="/">Privacy Policy</a>
        <a href="/">Terms of Service</a>
      </footer>
    </div>
  );
}

export default FindMedicine;

