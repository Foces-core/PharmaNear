import { useState } from "react";
import { FaCapsules, FaSearch, FaSortNumericUp } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./first_page.css";

function FindMedicine() {
  const [medicine, setMedicine] = useState("");
  const [dosage, setDosage] = useState("");
  const [quantity, setQuantity] = useState("");
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`${latitude}, ${longitude}`);
          setError("");
        },
        (error) => {
          setError("Error: " + error.message);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  const handleSearch = async () => {
    if (!medicine) {
      setError("Please enter a medicine name");
      return;
    }
    try {
      if (!location) {
        getLocation();
      }
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/drugs?name=${encodeURIComponent(medicine)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      navigate("/mappage", {
        state: {
          medicineData: data,
          medicine: medicine,
          dosage: dosage,
          quantity: quantity,
          userLocation: location,
        },
      });
    } catch (error) {
      console.error("Error fetching medicine data:", error);
      setError("Failed to fetch medicine data. Please try again.");
    }
  };

  return (
    <div className="find-medicine-page">
      {/* Header */}
      <header className="fm-header">
        <h1 className="fm-text">PharmaNear</h1>
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
            style={{ width: "800px", maxWidth: "100%" }}
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

        <button className="fp-search-btn" onClick={handleSearch}>
          Search Nearby
        </button>
        <div className="fm-register">
          <span>Register medicine?</span>
          <Link to="/login">Login</Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="fp-footer">
        <div className="fp-footer-links">
          <a href="/">About Us</a>
          <a href="/">Services</a>
          <a href="/">Contact</a>
          <a href="/">Privacy Policy</a>
          <a href="/">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
}

export default FindMedicine;
