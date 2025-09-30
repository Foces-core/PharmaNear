import { useEffect, useState } from "react";
import { FaCapsules, FaDollarSign, FaEdit, FaPlus, FaSave, FaSortNumericUp, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import "./pharmacy_page.css";

export default function PharmacyPage() {
  const navigate = useNavigate();
  const [medicineName, setMedicineName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [strength, setStrength] = useState("");
  const [stockItems, setStockItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [showAddMedicineForm, setShowAddMedicineForm] = useState(false);
  const [newMedicineName, setNewMedicineName] = useState("");
  const [newMedicineStrength, setNewMedicineStrength] = useState("");
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
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const [error, setError] = useState("");

  async function handleAdd(e) {
    e.preventDefault();
    if (!medicineName || quantity === "" || price === "") return;
    const newItem = {
      id: crypto.randomUUID(),
      name: medicineName.trim(),
      quantity: Number(quantity),
      price: Number(price),
    };

    try {
      const token = localStorage.getItem('pharmacy_token');
      if (!token) {
        throw new Error('No token provided');
      }
      
      const response = await fetch('http://localhost:3001/api/pharmacy/stock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          pharmacy_id: localStorage.getItem('pharmacy_id'),
          medicine_name: newItem.name,
          quantity: newItem.quantity,
          price: newItem.price,
          strength: strength
        }),
      })

      if (!response.ok) {
        const errorData = await response.json();
        
        // Check if medicine not found and show add medicine form
        if (errorData.medicineNotFound) {
          setError(`Medicine "${errorData.medicineName}" not found. Please add it first.`);
          setNewMedicineName(errorData.medicineName);
          setShowAddMedicineForm(true);
          return;
        }
        
        throw new Error(errorData.message || 'Add medicine failed');
      }

      const data = await response.json()
      console.log(data)
      setStockItems((prev) => [newItem, ...prev]);
      setMedicineName("");
      setQuantity("");
      setPrice("");
      setStrength("");
      setError("");
    } catch (error) {
      setError(error.message)
      console.error('Add medicine error:', error)
      // If no token, redirect to login
      if (error.message === 'No token provided') {
        alert('You must be logged in to add medicines');
        navigate('/login');
      }
    }
  }

  function startEditing(item) {
    setEditingItem({ ...item });
    
  }

  function cancelEditing() {
    setEditingItem(null);
  }

  async function saveEditing() {
    try {
      const token = localStorage.getItem('pharmacy_token');
      if (!token) {
        throw new Error('No token provided');
      }
      
      const response = await fetch('http://localhost:3001/api/pharmacy/stock', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          pharmacy_id: localStorage.getItem('pharmacy_id'),
          medicine_name: editingItem.name,
          quantity: editingItem.quantity,
          price: editingItem.price,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Update medicine failed';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json()
      console.log('Update success:', data)
      
      // Update local state with the latest data
      const updatedStock = stockItems.map(item => 
        item.name === editingItem.name ? { ...item, quantity: editingItem.quantity, price: editingItem.price } : item
      );
      setStockItems(updatedStock);
      setEditingItem(null);
      alert('Medicine updated successfully');
    } catch (error) {
      setError(error.message)
      console.error('Update medicine error:', error)
      // If no token, redirect to login
      if (error.message === 'No token provided') {
        alert('You must be logged in to update medicines');
        navigate('/login');
      } else {
        alert(`Failed to update medicine: ${error.message}`);
      }
    }
  }

  async function deleteItem(id) {
    if (window.confirm('Are you sure you want to remove this medicine from stock?')) {
      try {
        const item = stockItems.find(item => item.id === id);
        if (!item) {
          throw new Error('Medicine not found');
        }
        
        const token = localStorage.getItem('pharmacy_token');
        if (!token) {
          throw new Error('No token provided');
          navigate('/login');
          return;
        }
        
        const response = await fetch('http://localhost:3001/api/pharmacy/stock', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            pharmacy_id: localStorage.getItem('pharmacy_id'),
            medicine_name: item.name,
          }),
        })

        if (!response.ok) {
          const errorText = await response.text();
          let errorMessage = 'Delete medicine failed';
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            errorMessage = errorText || errorMessage;
          }
          throw new Error(errorMessage);
        }

        const data = await response.json()
        console.log('Delete success:', data)
        
        // Update local state
        const updatedStock = stockItems.filter(item => item.id !== id);
        setStockItems(updatedStock);
        alert('Medicine removed from stock successfully');
      } catch (error) {
        setError(error.message)
        console.error('Delete medicine error:', error)
        // If no token, redirect to login
        if (error.message === 'No token provided') {
          alert('You must be logged in to delete medicines');
          navigate('/login');
        } else {
          alert(`Failed to remove medicine: ${error.message}`);
        }
      }
    }
  }

  function totalItems() {
    return stockItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  function goToAdmin() {
    navigate('/pharmacy/admin');
  }

  function handleLogout() {
    localStorage.clear();
    navigate('/login');
  }

  useEffect(() => {
    // Handle responsive design
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    
    const userName = localStorage.getItem('pharmacy_user_name') || '';
    const token = localStorage.getItem('pharmacy_token') || '';
    const pharmacyId = localStorage.getItem('pharmacy_id') || '';
    
    if (!userName || !token || !pharmacyId) {
      navigate('/login');
      return;
    }
    
    setProfile((p) => ({ ...p, user_name: userName }));
    const controller = new AbortController();
    
    // Fetch profile data
    async function fetchProfile() {
      try {
        setLoadingProfile(true);
        const res = await fetch(`http://localhost:3001/api/pharmacy/profile?user_name=${encodeURIComponent(userName)}`, {
          signal: controller.signal,
          headers: {
            'Authorization': `Bearer ${token}`,
          },
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
        // Ignore AbortError which happens when component unmounts
        if (e.name !== 'AbortError') {
          console.error('Failed to load profile:', e);
          // If unauthorized, redirect to login
          if (e.message.includes('401') || e.message.includes('403')) {
            localStorage.clear();
            navigate('/login');
          }
        }
      } finally {
        setLoadingProfile(false);
      }
    }
    
    // Fetch stock data
    async function fetchStock() {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:3001/api/pharmacy/stock?pharmacy_id=${encodeURIComponent(pharmacyId)}`,
        {
            method: 'GET',
            signal: controller.signal,
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to load stock data');
        }
        const data = await res.json();
        
        // Format the stock data to match the frontend expectations
        if (data.medications && Array.isArray(data.medications)) {
          const formattedStockItems = data.medications.map((med, index) => ({
            id: `med-${index}-${Date.now()}`,
            name: med.medicine_id && med.medicine_id.name ? med.medicine_id.name : 'Unknown Medicine',
            quantity: med.quantity,
            price: med.price,
          }));
          setStockItems(formattedStockItems);
        }
      } catch (e) {
        // Ignore AbortError which happens when component unmounts
        if (e.name !== 'AbortError') {
          console.error('Failed to load stock:', e);
          setError(e.message || 'Failed to load stock data');
          // If unauthorized, redirect to login
          if (e.message.includes('401') || e.message.includes('403')) {
            localStorage.clear();
            navigate('/login');
          }
        }
      } finally {
        setLoading(false);
      }
    }
    
    // Run both fetches in parallel
    Promise.all([fetchProfile(), fetchStock()]);
    
    return () => {
      controller.abort();
      window.removeEventListener('resize', handleResize);
    };
  }, [navigate]);

  

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
    <div className="medicine-page">
      <header className="fm-header">
        <h6 className="fm-text">FindMeds</h6>
        <div className="fm-location" style={{ marginLeft: 'auto' }}>
          <h6>Welcome, {profile.user_name}</h6>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button type="button" className="back-btn" onClick={goToAdmin}>
            Go to Admin Panel
          </button>
          <button type="button" className="back-btn" onClick={handleLogout} style={{ backgroundColor: '#dc3545' }}>
            Logout
          </button>
        </div>
      </header>

      <main className="fm-main">
        <h2 className="fm-title">Pharmacy Stock</h2>
        
        {/* Error message display */}
        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            border: '1px solid #fca5a5',
            borderRadius: '6px',
            padding: '12px 16px',
            marginBottom: '20px',
            color: '#dc2626',
            maxWidth: '800px'
          }}>
            {error}
          </div>
        )}

        {/* Forms container - responsive side by side layout */}
        <div style={{ 
          display: "flex", 
          flexDirection: isMobile ? "column" : "row", 
          gap: "20px", 
          width: "100%", 
          maxWidth: "1200px",
          flexWrap: "wrap"
        }}>
          {/* Add New Medicine Form */}
          {showAddMedicineForm && (
            <div style={{ 
              flex: "1",
              minWidth: "350px",
              padding: "20px", 
              backgroundColor: "#f0f9ff", 
              borderRadius: "8px", 
              border: "1px solid #bae6fd",
              height: "fit-content"
            }}>
              <h3 style={{ marginTop: 0, color: "#0369a1", marginBottom: "15px" }}>Add New Medicine</h3>
              <form onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const token = localStorage.getItem('pharmacy_token');
                  if (!token) {
                    throw new Error('No token provided');
                  }
                  
                  const response = await fetch('http://localhost:3001/api/medicines', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                      name: newMedicineName,
                      strength: newMedicineStrength
                    }),
                  });
                  
                  if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to add new medicine');
                  }
                  
                  const data = await response.json();
                  setError("");
                  setShowAddMedicineForm(false);
                  alert('Medicine added successfully! You can now add it to your stock.');
                  
                  // Keep the medicine name in the main form
                  setMedicineName(newMedicineName);
                  setStrength(newMedicineStrength);
                  
                  // Reset new medicine form
                  setNewMedicineName("");
                  setNewMedicineStrength("");
                } catch (error) {
                  setError(error.message);
                  console.error('Add new medicine error:', error);
                }
              }} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <div className="fm-input-groups relative">
                  <FaCapsules className="fm-icon" style={{ color: "#0369a1" }} />
                  <input
                    type="text"
                    placeholder="Medicine Name"
                    value={newMedicineName}
                    onChange={(e) => setNewMedicineName(e.target.value)}
                    className="fm-input with-icon"
                    required
                  />
                </div>
                
                <div className="fm-input-groups relative">
                  <FaCapsules className="fm-icon" style={{ color: "#0369a1" }} />
                  <input
                    type="text"
                    placeholder="Strength (e.g., 500mg, 10mg/ml)"
                    value={newMedicineStrength}
                    onChange={(e) => setNewMedicineStrength(e.target.value)}
                    className="fm-input with-icon"
                  />
                </div>
                
                <div style={{ display: "flex", gap: "10px" }}>
                  <button className="fm-search-btn" type="submit" style={{ backgroundColor: "#0369a1", flex: 1 }}>
                    <FaPlus style={{ marginRight: 8 }} /> Add Medicine
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowAddMedicineForm(false);
                      setError("");
                    }}
                    style={{ 
                      padding: "10px 20px", 
                      borderRadius: "4px", 
                      border: "1px solid #cbd5e1",
                      backgroundColor: "#f8fafc",
                      cursor: "pointer",
                      flex: 1
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Add To Stock Form */}
          <div style={{ 
            flex: showAddMedicineForm ? "1" : "auto",
            minWidth: "350px",
            padding: "20px",
            backgroundColor: "#f0fff4",
            borderRadius: "8px",
            border: "1px solid #c6f6d5",
            height: "fit-content",
            marginTop: "100px"
          }}>
            <h3 style={{ marginTop: 0, color: "#14967f", marginBottom: "15px" }}>Add To Stock</h3>
            <form onSubmit={handleAdd} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
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

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <div className="fm-input-groups relative" style={{ flex: 1, minWidth: "120px" }}>
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

                <div className="fm-input-groups relative" style={{ flex: 1, minWidth: "120px" }}>
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
              
              <div className="fm-input-groups relative">
                <FaCapsules className="fm-icon" style={{ color: "#14967f" }} />
                <input
                  type="text"
                  placeholder="Strength (optional, e.g., 500mg)"
                  value={strength}
                  onChange={(e) => setStrength(e.target.value)}
                  className="fm-input with-icon"
                />
              </div>

              <button className="fm-search-btn" type="submit" style={{ width: "100%" }}>
                <FaPlus style={{ marginRight: 8 }} /> Add To Stock
              </button>
            </form>
          </div>
        </div>

        {/* Enhanced Stock Items Section */}
        <div style={{ 
          width: "100%", 
          maxWidth: "1200px", 
          marginTop: "30px"
        }}>
          {/* Stock Summary Cards */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
            gap: "20px", 
            marginBottom: "25px" 
          }}>
            <div style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              padding: "20px",
              borderRadius: "12px",
              textAlign: "center",
              boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)"
            }}>
              <div style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "5px" }}>
                {stockItems.length}
              </div>
              <div style={{ fontSize: "0.9rem", opacity: 0.9 }}>
                Total Medicines
              </div>
            </div>
            
            <div style={{
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              color: "white",
              padding: "20px",
              borderRadius: "12px",
              textAlign: "center",
              boxShadow: "0 4px 15px rgba(240, 147, 251, 0.3)"
            }}>
              <div style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "5px" }}>
                {totalItems()}
              </div>
              <div style={{ fontSize: "0.9rem", opacity: 0.9 }}>
                Total Quantity
              </div>
            </div>
            
            <div style={{
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              color: "white",
              padding: "20px",
              borderRadius: "12px",
              textAlign: "center",
              boxShadow: "0 4px 15px rgba(79, 172, 254, 0.3)"
            }}>
              <div style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "5px" }}>
                ₹{stockItems.reduce((sum, item) => sum + (item.quantity * item.price), 0).toFixed(2)}
              </div>
              <div style={{ fontSize: "0.9rem", opacity: 0.9 }}>
                Total Value
              </div>
            </div>
          </div>

          {/* Stock Items Table */}
          <div style={{ 
            background: "#fff", 
            borderRadius: "12px", 
            overflow: "hidden", 
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
            marginBottom: "200px"

          }}>
            {/* Table Header */}
            <div style={{ 
              display: isMobile ? "none" : "grid", 
              gridTemplateColumns: "2fr 1fr 1fr 1fr", 
              padding: "16px 20px", 
              background: "linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)",
              fontWeight: 600,
              fontSize: "0.9rem",
              color: "#4a5568",
              borderBottom: "2px solid #e2e8f0"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <FaCapsules style={{ color: "#667eea" }} />
                Medicine Name
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <FaSortNumericUp style={{ color: "#f093fb" }} />
                Quantity
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <FaDollarSign style={{ color: "#4facfe" }} />
                Price (₹)
              </div>
              <div style={{ textAlign: 'right' }}>Actions</div>
            </div>

            {/* Table Body */}
            {loading ? (
              <div style={{ 
                padding: "40px", 
                textAlign: "center", 
                color: "#718096",
                fontSize: "1.1rem"
              }}>
                <div style={{ 
                  display: "inline-block", 
                  width: "24px", 
                  height: "24px", 
                  border: "3px solid #e2e8f0",
                  borderTop: "3px solid #667eea",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                  marginBottom: "10px"
                }}></div>
                <div>Loading stock data...</div>
              </div>
            ) : stockItems.length === 0 ? (
              <div style={{ 
                padding: "40px", 
                textAlign: "center", 
                color: "#718096",
                fontSize: "1.1rem"
              }}>
                <FaCapsules style={{ fontSize: "2rem", marginBottom: "10px", opacity: 0.5 }} />
                <div>No medicines in stock yet.</div>
                <div style={{ fontSize: "0.9rem", marginTop: "5px", opacity: 0.8 }}>
                  Add medicines using the form above to get started.
                </div>
              </div>
            ) : (
              stockItems.map((item, index) => (
                <div key={item.id} style={{ 
                  display: isMobile ? "block" : "grid", 
                  gridTemplateColumns: isMobile ? "none" : "2fr 1fr 1fr 1fr", 
                  padding: isMobile ? "16px" : "16px 20px", 
                  borderTop: index > 0 ? "1px solid #f1f5f9" : "none",
                  backgroundColor: editingItem?.id === item.id ? '#f0fdf4' : (index % 2 === 0 ? '#fafbfc' : 'white'),
                  transition: "all 0.2s ease",
                  alignItems: "center",
                  marginBottom: isMobile ? "8px" : "0"
                }}>
                  {editingItem?.id === item.id ? (
                    // Editing mode
                    <>
                      <div style={{ gridColumn: '1' }}>
                      <input
                        type="text"
                        className="fm-input"
                        value={editingItem.name}
                        onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                          style={{ 
                            margin: 0, 
                            fontSize: "0.9rem",
                            border: "2px solid #10b981",
                            boxShadow: "0 0 0 3px rgba(16, 185, 129, 0.1)"
                          }}
                        />
                      </div>
                      <div style={{ gridColumn: '2' }}>
                      <input
                        type="number"
                        className="fm-input"
                        value={editingItem.quantity}
                        onChange={(e) => setEditingItem({ ...editingItem, quantity: parseInt(e.target.value, 10) })}
                          style={{ 
                            margin: 0, 
                            fontSize: "0.9rem",
                            border: "2px solid #10b981",
                            boxShadow: "0 0 0 3px rgba(16, 185, 129, 0.1)"
                          }}
                        min="1"
                      />
                      </div>
                      <div style={{ gridColumn: '3' }}>
                      <input
                        type="number"
                        className="fm-input"
                        value={editingItem.price}
                        onChange={(e) => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) })}
                          style={{ 
                            margin: 0, 
                            fontSize: "0.9rem",
                            border: "2px solid #10b981",
                            boxShadow: "0 0 0 3px rgba(16, 185, 129, 0.1)"
                          }}
                        min="0"
                        step="0.01"
                      />
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        gap: '10px', 
                        justifyContent: 'flex-end', 
                        alignItems: 'center', 
                        gridColumn: '4' 
                      }}>
                        <button 
                          type="button" 
                          className="fm-search-btn" 
                          onClick={saveEditing}
                          style={{ 
                            padding: "8px 16px",
                            fontSize: "0.8rem",
                            backgroundColor: '#10b981',
                            minHeight: "auto"
                          }}
                        >
                          <FaSave size={14} />
                          Save
                        </button>
                        <button 
                          type="button" 
                          onClick={cancelEditing}
                          style={{ 
                            padding: "8px 16px",
                            fontSize: "0.8rem",
                            backgroundColor: "#f8fafc",
                            color: "#6b7280",
                            border: "1px solid #d1d5db",
                            borderRadius: "6px",
                            cursor: "pointer"
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    // View mode
                    <>
                      {isMobile ? (
                        // Mobile layout - card style
                        <div>
                          <div style={{ 
                            fontWeight: "600", 
                            color: "#1f2937",
                            fontSize: "1rem",
                            marginBottom: "8px",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px"
                          }}>
                            <FaCapsules style={{ color: "#667eea" }} />
                            {item.name}
                          </div>
                          <div style={{ 
                            display: "flex", 
                            justifyContent: "space-between", 
                            alignItems: "center",
                            marginBottom: "12px"
                          }}>
                            <div style={{ 
                              color: "#f093fb", 
                              fontWeight: "600",
                              fontSize: "0.9rem",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px"
                            }}>
                              <FaSortNumericUp size={12} />
                              {item.quantity} units
                            </div>
                            <div style={{ 
                              color: "#4facfe", 
                              fontWeight: "600",
                              fontSize: "0.9rem",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px"
                            }}>
                              <FaDollarSign size={12} />
                              ₹{item.price.toFixed(2)}
                            </div>
                          </div>
                          <div style={{ 
                            display: 'flex', 
                            gap: '8px', 
                            justifyContent: 'flex-end' 
                          }}>
                            <button 
                              type="button" 
                              onClick={() => startEditing(item)}
                              style={{ 
                                padding: "8px 12px",
                                backgroundColor: "#dbeafe",
                                color: "#1d4ed8",
                                border: "1px solid #bfdbfe",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontSize: "0.8rem",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                transition: "all 0.2s ease"
                              }}
                            >
                              <FaEdit size={12} />
                              Edit
                            </button>
                            <button 
                              type="button" 
                              onClick={() => deleteItem(item.id)}
                              style={{ 
                                padding: "8px 12px",
                                backgroundColor: "#fee2e2",
                                color: "#dc2626",
                                border: "1px solid #fecaca",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontSize: "0.8rem",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                transition: "all 0.2s ease"
                              }}
                            >
                              <FaTrash size={12} />
                              Delete
                            </button>
                          </div>
                        </div>
                      ) : (
                        // Desktop layout - grid style
                        <>
                          <div style={{ 
                            fontWeight: "500", 
                            color: "#1f2937",
                            fontSize: "0.95rem",
                            wordBreak: "break-word"
                          }}>
                            {item.name}
                          </div>
                          <div style={{ 
                            color: "#f093fb", 
                            fontWeight: "600",
                            fontSize: "0.95rem"
                          }}>
                            {item.quantity} units
                          </div>
                          <div style={{ 
                            color: "#4facfe", 
                            fontWeight: "600",
                            fontSize: "0.95rem"
                          }}>
                            ₹{item.price.toFixed(2)}
                          </div>
                          <div style={{ 
                            display: 'flex', 
                            gap: '8px', 
                            justifyContent: 'flex-end' 
                          }}>
                            <button 
                              type="button" 
                              onClick={() => startEditing(item)}
                              style={{ 
                                padding: "8px 12px",
                                backgroundColor: "#dbeafe",
                                color: "#1d4ed8",
                                border: "1px solid #bfdbfe",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontSize: "0.8rem",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                transition: "all 0.2s ease"
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.backgroundColor = "#bfdbfe";
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.backgroundColor = "#dbeafe";
                              }}
                            >
                              <FaEdit size={12} />
                              Edit
                            </button>
                            <button 
                              type="button" 
                              onClick={() => deleteItem(item.id)}
                              style={{ 
                                padding: "8px 12px",
                                backgroundColor: "#fee2e2",
                                color: "#dc2626",
                                border: "1px solid #fecaca",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontSize: "0.8rem",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                transition: "all 0.2s ease"
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.backgroundColor = "#fecaca";
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.backgroundColor = "#fee2e2";
                              }}
                            >
                              <FaTrash size={12} />
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Add CSS animation for loading spinner */}
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
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


