import { useState, useEffect } from 'react';
import { FaArrowLeft, FaMapPin } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./First.css";
import "./login_page.css";

export default function PharmacyAdmin() {
  const navigate = useNavigate();
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

  // Stock management states
  const [stockItems, setStockItems] = useState([]);
  const [loadingStock, setLoadingStock] = useState(false);
  const [addingStock, setAddingStock] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: "",
    price: "",
  });

  // Loading states
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    const userName = localStorage.getItem("pharmacy_user_name") || "";
    if (!userName) return;
    setProfile((p) => ({ ...p, user_name: userName }));
    fetchProfile();
    fetchStockItems();
  }, []);

  async function fetchProfile() {
    const controller = new AbortController();
    try {
      setLoadingProfile(true);
      const userName = localStorage.getItem("pharmacy_user_name") || "";
      const res = await fetch(
        `/api/pharmacy/profile?user_name=${encodeURIComponent(userName)}`,
        { signal: controller.signal }
      );
      if (!res.ok) throw new Error("Failed to load profile");
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
      console.error("Failed to load profile:", e);
    } finally {
      setLoadingProfile(false);
    }
    return () => controller.abort();
  }

  async function fetchStockItems() {
    try {
      setLoadingStock(true);
      const userName = localStorage.getItem("pharmacy_user_name") || "";
      const res = await fetch(
        `/api/pharmacy/stock?user_name=${encodeURIComponent(userName)}`
      );
      if (!res.ok) throw new Error("Failed to load stock");
      const data = await res.json();
      setStockItems(data.stock || []);
    } catch (e) {
      console.error("Failed to load stock:", e);
      // Fallback demo data
      setStockItems([
        { id: 1, name: "Paracetamol 500mg", quantity: 100, price: 10.5 },
        { id: 2, name: "Amoxicillin 250mg", quantity: 50, price: 35.75 },
        { id: 3, name: "Ibuprofen 400mg", quantity: 75, price: 18.25 },
      ]);
    } finally {
      setLoadingStock(false);
    }
  }

  async function saveProfile() {
    try {
      setSavingProfile(true);
      const payload = {
        ...profile,
        latitude:
          profile.latitude === "" ? undefined : Number(profile.latitude),
        longitude:
          profile.longitude === "" ? undefined : Number(profile.longitude),
      };
      const res = await fetch("/api/pharmacy/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save");
      const data = await res.json();
      setProfile((p) => ({
        ...p,
        ...data.pharmacy,
        latitude: data.pharmacy.latitude ?? "",
        longitude: data.pharmacy.longitude ?? "",
      }));
      alert("Profile saved");
    } catch (e) {
      alert("Unable to save profile");
    } finally {
      setSavingProfile(false);
    }
  }

  function fetchCurrentLocation() {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setProfile((p) => ({ ...p, latitude, longitude }));
      },
      () => {
        alert("Unable to fetch location");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  return (
    <div className="find-medicine-page">
      {/* Header */}
      <header className="fm-header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        padding: '10px 20px',
        minHeight: '10vh',
        height: 'auto'
      }}>
        <div className="fm-text" style={{ minWidth: '200px' }}>Pharmacy Admin Panel</div>
        <div className="fm-location" style={{ order: 3, width: '100%', textAlign: 'center', padding: '5px 0', margin: '5px 0' }}>
          <h6>Welcome, {profile.user_name}</h6>
        </div>
        <button
          type="button"
          className="fm-search-btn back-btn"
          onClick={() => navigate("/pharmacy")}
          style={{ minWidth: '150px', maxWidth: '200px' }}
        >
          <FaArrowLeft style={{ marginRight: '8px' }} /> Back to Dashboard
        </button>
      </header>

      {/* Main Content */}
      <main className="fm-main" style={{
        paddingTop: '50px',
        paddingBottom: '100px',
        marginLeft: 'auto',
        marginRight: 'auto'
      }}>
        <h2 className="fm-title">Pharmacy Management</h2>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%'
        }}>
          {/* Profile Settings Section */}
          <div className="admin-section">
            <h3 style={{ marginBottom: '16px', fontSize: '1.3rem', color: '#333' }}>Pharmacy Profile</h3>
            <div className="admin-card" style={{ minWidth: '300px', width: '100%', maxWidth: '600px' }}>
              <form
                className="profile-form"
                autoComplete="on"
                onSubmit={(e) => {
                  e.preventDefault();
                  saveProfile();
                }}
                style={{ padding: '16px', width: '100%' }}
              >
                <div className="fm-input-groups">
                  <input
                    type="text"
                    className="fm-input"
                    placeholder="License Number"
                    value={profile.license_number}
                    onChange={(e) =>
                      setProfile((p) => ({
                        ...p,
                        license_number: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="fm-input-groups">
                  <input
                    type="text"
                    className="fm-input"
                    placeholder="Address"
                    value={profile.address}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, address: e.target.value }))
                    }
                  />
                </div>

                <div className="flexrow">
                  <div className="fm-input-groups">
                    <input
                      type="text"
                      className="fm-input"
                      placeholder="City"
                      value={profile.city}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, city: e.target.value }))
                      }
                    />
                  </div>
                  <div className="fm-input-groups">
                    <input
                      type="text"
                      className="fm-input"
                      placeholder="State"
                      value={profile.state}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, state: e.target.value }))
                      }
                    />
                  </div>
                </div>

                <div className="flexrow">
                  <div className="fm-input-groups">
                    <input
                      type="text"
                      className="fm-input"
                      placeholder="Pincode"
                      value={profile.pincode}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, pincode: e.target.value }))
                      }
                    />
                  </div>
                </div>

                <div className="flexrow">
                  <div className="fm-input-groups">
                    <input
                      type="number"
                      className="fm-input"
                      placeholder="Latitude"
                      value={profile.latitude}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, latitude: e.target.value }))
                      }
                    />
                  </div>
                  <div className="fm-input-groups">
                    <input
                      type="number"
                      className="fm-input"
                      placeholder="Longitude"
                      value={profile.longitude}
                      onChange={(e) =>
                        setProfile((p) => ({
                          ...p,
                          longitude: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <button
                  className="fm-search-btn"
                  type="submit"
                  disabled={savingProfile}
                >
                  {savingProfile ? "Saving..." : "Save Profile"}
                </button>

                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: '16px',
                  marginBottom: '8px'
                }}>
                  <button
                    type="button"
                    className="fm-search-btn"
                    onClick={fetchCurrentLocation}
                    style={{ maxWidth: '250px' }}
                  >
                    <FaMapPin style={{ marginRight: '8px' }} /> Use current location
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
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
