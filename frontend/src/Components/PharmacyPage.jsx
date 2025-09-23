import React, { useState } from "react";
import { FaCapsules, FaDollarSign, FaPlus, FaSortNumericUp } from "react-icons/fa";
import { Link } from 'react-router-dom';
import "./First.css";

export default function PharmacyPage() {
  const [medicineName, setMedicineName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [stockItems, setStockItems] = useState([]);

  function handleAdd(e) {
    e.preventDefault();
    if (!medicineName || quantity === "" || price === "") return;
    const newItem = {
      id: crypto.randomUUID(),
      name: medicineName.trim(),
      quantity: Number(quantity),
      price: Number(price),
    };
    setStockItems((prev) => [newItem, ...prev]);
    setMedicineName("");
    setQuantity("");
    setPrice("");
  }

  function totalItems() {
    return stockItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  return (
    <div className="find-medicine-page">
      <header className="fm-header">
        <h6 className="fm-text">FindMeds</h6>
        <div className="fm-location">
          <h6>Pharmacy Dashboard</h6>
          <h6>Manage Stock</h6>
        </div>
      </header>

      <main className="fm-main">
        <h2 className="fm-title">Pharmacy Stock</h2>

        <form onSubmit={handleAdd} style={{ width: "100%", maxWidth: 800 }}>
          <div className="flexrow">
            <div className="fm-input-groups relative">
              <FaCapsules className="fm-icon" style={{ color: "#14967f" }} />
              <input
                type="text"
                placeholder="Medicine Name"
                value={medicineName}
                onChange={(e) => setMedicineName(e.target.value)}
                className="fm-input with-icon"
                required
              />
            </div>

            <div className="fm-input-groups relative">
              <FaSortNumericUp className="fm-icon" style={{ color: "#14967f" }} />
              <input
                type="number"
                placeholder="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="fm-input with-icon"
                min="0"
                required
              />
            </div>

            <div className="fm-input-groups relative">
              <FaDollarSign className="fm-icon" style={{ color: "#14967f" }} />
              <input
                type="number"
                step="0.01"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="fm-input with-icon"
                min="0"
                required
              />
            </div>
          </div>

          <button className="fm-search-btn" type="submit">
            <FaPlus style={{ marginRight: 8 }} /> Add To Stock
          </button>
        </form>

        <div style={{ width: "100%", maxWidth: 800, marginTop: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <strong>Items: {stockItems.length}</strong>
            <strong>Total Quantity: {totalItems()}</strong>
          </div>
          <div style={{ background: "#fff", borderRadius: 8, overflow: "hidden", border: "1px solid #e2e8f0" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", padding: "12px 16px", background: "#f7fafc", fontWeight: 600 }}>
              <div>Medicine</div>
              <div>Quantity</div>
              <div>Price</div>
            </div>
            {stockItems.length === 0 ? (
              <div style={{ padding: 16, textAlign: "center", color: "#718096" }}>No items yet. Add medicines to your stock.</div>
            ) : (
              stockItems.map((item) => (
                <div key={item.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", padding: "12px 16px", borderTop: "1px solid #edf2f7" }}>
                  <div>{item.name}</div>
                  <div>{item.quantity}</div>
                  <div>₹ {item.price.toFixed(2)}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <footer className="fm-footer">
        <a href="/">About Us</a>
        <a href="/">Services</a>
        <a href="/">Contact</a>
        <a href="/">Privacy Policy</a>
        <a href="/">Terms of Service</a>
        <div style={{ marginLeft: 'auto' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>← Back to Home</Link>
        </div>
      </footer>
    </div>
  );
}


