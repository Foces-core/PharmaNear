import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaCapsules, FaSortNumericUp } from "react-icons/fa";
import "./First.css";

function FindMedicine() {
  const [medicine, setMedicine] = useState("");
  const [dosage, setDosage] = useState("");
  const [quantity, setQuantity] = useState("");

  const navigate = useNavigate();

  const handleSearch = () => {
    // Navigate to the map page
    navigate("/mappage");
  };

  return (
    <div className="find-medicine-page">
      {/* Header */}
      <header className="fm-header">
        <h6 className="fm-text">FindMeds</h6>
        <div className="fm-location">
          <h6>Current address</h6>
          <h6>Select location <span className="dropdown-arrow">▼</span></h6>
        </div>
      </header>

      {/* Main Content */}
      <main className="fm-main">
        <h2 className="fm-title">Find Your Medicine</h2>

        <div className="fm-input-group relative">
          <FaSearch className="fm-icon" style={{ color: "#14967f" }}/>
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
            <FaCapsules className="fm-icon" style={{ color: "#14967f" }}/>
            <input
              type="text"
              placeholder="Dosage/Strength"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              className="fm-input with-icon"
            />
          </div>

          <div className="fm-input-groups relative">
            <FaSortNumericUp className="fm-icon" style={{ color: "#14967f" }}/>
            <input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="fm-input with-icon"
            />
          </div>
        </div>

        <button className="fm-search-btn" onClick={handleSearch}>
          Search Nearby
        </button>
      </main>

      {/* Footer */}
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
