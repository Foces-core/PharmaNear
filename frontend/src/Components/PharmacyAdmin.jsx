import { useEffect, useState } from "react";
import { FaArrowLeft, FaMapPin } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./PharmacyAdmin.css";

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
  
  // Prevent mouse wheel from changing input values
  useEffect(() => {
    const handleWheel = (e) => {
      if (e.target.tagName === 'INPUT') {
        e.preventDefault();
      }
    };
    
    // Add event listeners to prevent wheel on all inputs
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
      input.classList.add('no-wheel-input');
      input.addEventListener('wheel', handleWheel, { passive: false });
    });
    
    // Clean up event listeners on component unmount
    return () => {
      inputs.forEach(input => {
        input.removeEventListener('wheel', handleWheel);
      });
    };
  }, []);


  // Loading states
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    const userName = localStorage.getItem("pharmacy_user_name") || "";
    const token = localStorage.getItem("pharmacy_token") || "";
    
    if (!userName || !token) {
      navigate('/login');
      return;
    }
    
    setProfile((p) => ({ ...p, user_name: userName }));
    fetchProfile();
  }, [navigate]);

  async function fetchProfile() {
    const controller = new AbortController();
    try {
      setLoadingProfile(true);
      const userName = localStorage.getItem("pharmacy_user_name") || "";
      const token = localStorage.getItem("pharmacy_token") || "";
      const res = await fetch(
        `http://localhost:5000/api/pharmacy/profile?user_name=${encodeURIComponent(userName)}`,
        { 
          signal: controller.signal,
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
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
      if (e.message.includes('401') || e.message.includes('403')) {
        localStorage.clear();
        navigate('/login');
      }
    } finally {
      setLoadingProfile(false);
    }
    return () => controller.abort();
  }

  

  async function saveProfile() {
    try {
      setSavingProfile(true);
      const token = localStorage.getItem("pharmacy_token") || "";
      const payload = {
        ...profile,
        latitude:
          profile.latitude === "" ? undefined : Number(profile.latitude),
        longitude:
          profile.longitude === "" ? undefined : Number(profile.longitude),
      };
      const res = await fetch("http://localhost:5000/api/pharmacy/profile", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
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
      <header className="fm-header">
        <div className="fm-text">Pharmacy Admin Panel</div>
        <div className="fm-location">
          <h6>Welcome, {profile.user_name}</h6>
        </div>
        <button
          type="button"
          className="fm-search-btn back-btn"
          onClick={() => navigate("/pharmacy")}
        >
          <FaArrowLeft /> Back to Dashboard
        </button>
      </header>

      {/* Main Content */}
      <main className="fm-main">
        <h2 className="fm-title">Pharmacy Management</h2>

        <div className="fm-grid">
          {/* Left Column - Profile Settings */}
          <div className="fm-col">
            <div className="admin-section">
              <h3>Pharmacy Profile</h3>
              <div className="admin-card">
                <form
                  className="profile-form"
                  autoComplete="on"
                  onSubmit={(e) => {
                    e.preventDefault();
                    saveProfile();
                  }}
                >
                  <div className="fm-input-groups">
                    <label htmlFor="license_number">License Number *</label>
                    <input
                      id="license_number"
                      type="text"
                      className="fm-input"
                      placeholder="Enter your pharmacy license number"
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
                    <label htmlFor="address">Address</label>
                    <input
                      id="address"
                      type="text"
                      className="fm-input"
                      placeholder="Enter full address"
                      value={profile.address}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, address: e.target.value }))
                      }
                    />
                  </div>

                  <div className="flexrow">
                    <div className="fm-input-groups">
                      <label htmlFor="city">City</label>
                      <input
                        id="city"
                        type="text"
                        className="fm-input"
                        placeholder="Enter city"
                        value={profile.city}
                        onChange={(e) =>
                          setProfile((p) => ({ ...p, city: e.target.value }))
                        }
                      />
                    </div>
                    <div className="fm-input-groups">
                      <label htmlFor="state">State</label>
                      <input
                        id="state"
                        type="text"
                        className="fm-input"
                        placeholder="Enter state"
                        value={profile.state}
                        onChange={(e) =>
                          setProfile((p) => ({ ...p, state: e.target.value }))
                        }
                      />
                    </div>
                    <div className="fm-input-groups">
                      <label htmlFor="pincode">Pincode</label>
                      <input
                        id="pincode"
                        type="text"
                        className="fm-input"
                        placeholder="Enter postal code"
                        value={profile.pincode}
                        onChange={(e) =>
                          setProfile((p) => ({ ...p, pincode: e.target.value }))
                        }
                      />
                    </div>
                  </div>

                  <div className="flexrow">
                    <div className="fm-input-groups">
                      <label htmlFor="latitude">Latitude</label>
                      <input
                        id="latitude"
                        type="number"
                        step="0.000001"
                        className="fm-input"
                        placeholder="GPS latitude"
                        value={profile.latitude}
                        onChange={(e) =>
                          setProfile((p) => ({ ...p, latitude: e.target.value }))
                        }
                      />
                    </div>
                    <div className="fm-input-groups">
                      <label htmlFor="longitude">Longitude</label>
                      <input
                        id="longitude"
                        type="number"
                        step="0.000001"
                        className="fm-input"
                        placeholder="GPS longitude"
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

                  <div className="location-btn-wrapper">
                    <button
                      type="button"
                      className="fm-search-btn"
                      onClick={fetchCurrentLocation}
                    >
                      <FaMapPin /> Use current location
                    </button>
                  </div>
                </form>
              </div>
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
