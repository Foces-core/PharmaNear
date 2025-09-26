import React, { useEffect, useState } from "react";
import { FaCapsules, FaDollarSign, FaPlus, FaSortNumericUp, FaEdit, FaTrash, FaSave } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import "./First.css";

export default function PharmacyPage() {
  const navigate = useNavigate();
  const [medicineName, setMedicineName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [stockItems, setStockItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [profile, setProfile] = useState({
    user_name: "",
    license_number: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    latitude: "",
    longitude: "",
  });
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

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

  function startEditing(item) {
    setEditingItem({ ...item });
  }

  function cancelEditing() {
    setEditingItem(null);
  }

  function saveEditing() {
    try {
      const updatedStock = stockItems.map(item => 
        item.id === editingItem.id ? editingItem : item
      );
      setStockItems(updatedStock);
      setEditingItem(null);
      alert('Medicine updated');
    } catch (e) {
      alert('Failed to update medicine');
    }
  }

  function deleteItem(id) {
    if (window.confirm('Are you sure you want to remove this medicine from stock?')) {
      try {
        const updatedStock = stockItems.filter(item => item.id !== id);
        setStockItems(updatedStock);
        alert('Medicine removed from stock');
      } catch (e) {
        alert('Failed to remove medicine');
      }
    }
  }

  function totalItems() {
    return stockItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  function goToAdmin() {
    navigate('/pharmacy/admin');
  }

  useEffect(() => {
    const userName = localStorage.getItem('pharmacy_user_name') || '';
    if (!userName) return;
    setProfile((p) => ({ ...p, user_name: userName }));
    const controller = new AbortController();
    async function fetchProfile() {
      try {
        setLoadingProfile(true);
        const res = await fetch(`/api/pharmacy/profile?user_name=${encodeURIComponent(userName)}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error('Failed to load profile');
        const data = await res.json();
        setProfile((p) => ({
          ...p,
          user_name: data.user_name || userName,
          license_number: data.license_number || "",
          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
          pincode: data.pincode || "",
          latitude: data.latitude ?? "",
          longitude: data.longitude ?? "",
        }));
      } catch (e) {
        // ignore for now
      } finally {
        setLoadingProfile(false);
      }
    }
    fetchProfile();
    return () => controller.abort();
  }, []);

  async function saveProfile() {
    try {
      setSavingProfile(true);
      const payload = {
        ...profile,
        latitude: profile.latitude === "" ? undefined : Number(profile.latitude),
        longitude: profile.longitude === "" ? undefined : Number(profile.longitude),
      };
      const res = await fetch('/api/pharmacy/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to save');
      const data = await res.json();
      setProfile((p) => ({
        ...p,
        ...data.pharmacy,
        latitude: data.pharmacy.latitude ?? "",
        longitude: data.pharmacy.longitude ?? "",
      }));
      // eslint-disable-next-line no-alert
      alert('Profile saved');
    } catch (e) {
      // eslint-disable-next-line no-alert
      alert('Unable to save profile');
    } finally {
      setSavingProfile(false);
    }
  }

  function fetchCurrentLocation() {
    if (!navigator.geolocation) {
      // eslint-disable-next-line no-alert
      alert('Geolocation is not supported');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setProfile((p) => ({ ...p, latitude, longitude }));
      },
      () => {
        // eslint-disable-next-line no-alert
        alert('Unable to fetch location');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  return (
    <div className="find-medicine-page">
      <header className="fm-header">
        <h6 className="fm-text">FindMeds</h6>
        <div className="fm-location">
          <h6>Pharmacy Dashboard</h6>
          <h6>Manage Stock</h6>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <button type="button" className="fm-search-btn" onClick={goToAdmin}>
            Go to Admin Panel
          </button>
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
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", padding: "12px 16px", background: "#f7fafc", fontWeight: 600 }}>
              <div>Medicine</div>
              <div>Quantity</div>
              <div>Price</div>
              <div style={{ textAlign: 'right' }}>Actions</div>
            </div>
            {stockItems.length === 0 ? (
              <div style={{ padding: 16, textAlign: "center", color: "#718096" }}>No items yet. Add medicines to your stock.</div>
            ) : (
              stockItems.map((item) => (
                <div key={item.id} style={{ 
                  display: "grid", 
                  gridTemplateColumns: "2fr 1fr 1fr 1fr", 
                  padding: "12px 16px", 
                  borderTop: "1px solid #edf2f7",
                  backgroundColor: editingItem?.id === item.id ? '#f0fdf4' : 'white'
                }}>
                  {editingItem?.id === item.id ? (
                    // Editing mode
                    <>
                      <input
                        type="text"
                        className="fm-input"
                        value={editingItem.name}
                        onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                        style={{ gridColumn: '1' }}
                      />
                      <input
                        type="number"
                        className="fm-input"
                        value={editingItem.quantity}
                        onChange={(e) => setEditingItem({ ...editingItem, quantity: parseInt(e.target.value, 10) })}
                        style={{ gridColumn: '2' }}
                        min="1"
                      />
                      <input
                        type="number"
                        className="fm-input"
                        value={editingItem.price}
                        onChange={(e) => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) })}
                        style={{ gridColumn: '3' }}
                        min="0"
                        step="0.01"
                      />
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center', gridColumn: '4' }}>
                        <button 
                          type="button" 
                          className="link-btn" 
                          onClick={saveEditing}
                          style={{ color: '#10b981', fontWeight: 'bold' }}
                        >
                          <FaSave size={16} />
                        </button>
                        <button 
                          type="button" 
                          className="link-btn" 
                          onClick={cancelEditing}
                          style={{ color: '#6b7280' }}
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    // View mode
                    <>
                      <div>{item.name}</div>
                      <div>{item.quantity}</div>
                      <div>₹ {item.price.toFixed(2)}</div>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button 
                          type="button" 
                          className="link-btn" 
                          onClick={() => startEditing(item)}
                          style={{ color: '#0ea5e9' }}
                        >
                          <FaEdit size={16} />
                        </button>
                        <button 
                          type="button" 
                          className="link-btn" 
                          onClick={() => deleteItem(item.id)}
                          style={{ color: '#ef4444' }}
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </>
                  )}
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


