import L from "leaflet";
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import { useLocation } from "react-router-dom";
import "./MapPage.css";

// ---------------------
// Fallback data
// ---------------------
const fallbackPharmacies = [
  {
    id: "68db6260929396828f54d0f0",
    name: "PharmaDude",
    address: "Mallappally",
    closing: "9 PM",
    phone: "1234567890",
    lat: 9.449826294407545,
    lng: 76.6701444361027,
    stock: "in-stock",
    price: 50,
    quantity: 10,
  },
];

// ---------------------
// Marker Icons
// ---------------------
const shadowUrl = "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-shadow.png";

const userIcon = new L.Icon({
    iconUrl: "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-2x-blue.png",
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const pharmacyIcon = new L.Icon({
    iconUrl: "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-2x-green.png",
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

// ---------------------
// Filter Pharmacies on map bounds
// ---------------------
function PharmacyFilter({ pharmacies, setVisiblePharmacies }) {
    useMapEvents({
        moveend: (e) => {
            const map = e.target;
            const bounds = map.getBounds();
            const visible = pharmacies.filter((p) => bounds.contains([p.lat, p.lng]));
            setVisiblePharmacies(visible);
        },
    });
    return null;
}

// ---------------------
// Main Component
// ---------------------
export default function MapPage() {
    const location = useLocation();
    
    // Try to get data from location state first, then from sessionStorage as fallback
    const locationState = location.state || {};
    const storedData = JSON.parse(sessionStorage.getItem('mapPageData') || '{}');
    
    // Use data from location state or fallback to sessionStorage
    const medicineData = locationState.medicineData || storedData.medicineData;
    const medicine = locationState.medicine || storedData.medicine;
    const dosage = locationState.dosage || storedData.dosage;
    const passedLocation = locationState.userLocation || storedData.userLocation;
    
    // Store data in sessionStorage when it comes from location state
    useEffect(() => {
        if (location.state) {
            sessionStorage.setItem('mapPageData', JSON.stringify({
                medicineData: medicineData,
                medicine: medicine,
                dosage: dosage,
                userLocation: passedLocation
            }));
        }
    }, [location.state, medicineData, medicine, dosage, passedLocation]);

    // Initial coordinates
    const initialLocation = passedLocation
        ? {
            lat: parseFloat(passedLocation.split(',')[0]) || 10.001,
            lng: parseFloat(passedLocation.split(',')[1]) || 76.320
        }
        : { lat: 10.001, lng: 76.320 };

    const [userLocation, setUserLocation] = useState(initialLocation);
    const [pharmacies, setPharmacies] = useState([]);
    const [visiblePharmacies, setVisiblePharmacies] = useState([]);

    // ---------------------
    // Process medicine data
    // ---------------------
    useEffect(() => {
        if (medicineData?.stocks?.length > 0) {
            const fetchPharmacyDetails = async () => {
                try {
                    const pharmacyList = await Promise.all(
                        medicineData.stocks.map(async (item) => {
                            try {
                                const response = await fetch(
                                    `http://localhost:3001/api/pharmacy/details?pharmacy_id=${item.pharmacy_id}`
                                );
                                const pharmacy = await response.json();

                                // Construct address from available fields
                                const addressParts = [];
                                if (pharmacy?.address) addressParts.push(pharmacy.address);
                                if (pharmacy?.city) addressParts.push(pharmacy.city);
                                if (pharmacy?.state) addressParts.push(pharmacy.state);
                                if (pharmacy?.pincode) addressParts.push(pharmacy.pincode);
                                const fullAddress = addressParts.length > 0 ? addressParts.join(', ') : "Address not available";

                                return {
                                    id: pharmacy?._id || `unknown-${Math.random()}`,
                                    name: pharmacy?.user_name || "Unknown Pharmacy",
                                    address: fullAddress,
                                    closing: pharmacy?.closing_hours || "Not specified",
                                    phone: pharmacy?.phone_number || "Not available",
                                    lat: pharmacy?.latitude != null ? pharmacy.latitude : userLocation.lat + Math.random() * 0.01,
                                    lng: pharmacy?.longitude != null ? pharmacy.longitude : userLocation.lng + Math.random() * 0.01,
                                    stock: item?.stock?.quantity > 0 ? "in-stock" : "out-of-stock",
                                    price: item?.stock?.price || 0,
                                    quantity: item?.stock?.quantity || 0,
                                };
                            } catch (error) {
                                console.error("Error fetching pharmacy details:", error);
                                return null;
                            }
                        })
                    );

                    const validPharmacies = pharmacyList.filter(p => p !== null);
                    setPharmacies(validPharmacies.length ? validPharmacies : fallbackPharmacies);
                    setVisiblePharmacies(validPharmacies.length ? validPharmacies : fallbackPharmacies);
                } catch (error) {
                    console.error("Error processing pharmacy data:", error);
                    setPharmacies(fallbackPharmacies);
                    setVisiblePharmacies(fallbackPharmacies);
                }
            };

            fetchPharmacyDetails();
        } else {
            setPharmacies(fallbackPharmacies);
            setVisiblePharmacies(fallbackPharmacies);
        }
    }, [medicineData, userLocation.lat, userLocation.lng]);

    // ---------------------
    // Get user geolocation
    // ---------------------
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                }),
                (err) => console.warn("Geolocation error:", err)
            );
        }
    }, []);

    return (
        <div className="find-medicine-page">
            {/* Header */}
            <header className="fm-header">
                <h6 className="fm-text">PharmaNear</h6>
            </header>

            {/* Main Content */}
            <main className="fm-main">
                <div className="content-wrapper">
                    {/* Left Panel */}
                    <div className="left-panel">
                        {medicine && <h2 className="medicine-title">Showing results for: {medicine} {dosage && `(${dosage})`}</h2>}

                        {visiblePharmacies.length > 0 ? (
                            visiblePharmacies.map((pharmacy) => (
                                <div key={pharmacy.id} className="pharmacy-card">
                                    <div className="pharmacy-info">
                                        <h3>{pharmacy.name}</h3>
                                        <p>{pharmacy.address}</p>
                                        <p>Closes: {pharmacy.closing}</p>
                                        <p>{pharmacy.phone}</p>
                                        {pharmacy.price > 0 && <p>Price: ₹{pharmacy.price}</p>}
                                        {pharmacy.quantity > 0 && <p>Available: {pharmacy.quantity} units</p>}
                                        
                                        {/* Google Maps Button */}
                                        <button 
                                            className="google-maps-btn"
                                            onClick={() => window.open(`https://www.google.com/maps?q=${pharmacy.lat},${pharmacy.lng}`, '_blank')}
                                            title="Open in Google Maps"
                                        >
                                            📍 Open in Google Maps
                                        </button>
                                    </div>
                                    <div className={`stock ${pharmacy.stock}`}>
                                        {pharmacy.stock === "in-stock" ? "In Stock" : "Out of Stock"}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-pharmacies-message">
                                No pharmacies available in this area.
                            </div>
                        )}
                    </div>

                    {/* Right Panel - Map */}
                    <div className="right-panel">
                        <MapContainer
                            center={[userLocation.lat, userLocation.lng]}
                            zoom={15}
                            scrollWheelZoom={true}
                            style={{ height: "100%", width: "100%", borderRadius: "10px" }}
                        >
                            <TileLayer
                                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                attribution="&copy; OpenStreetMap &copy; CARTO"
                            />
                            <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                                <Popup>Your Location</Popup>
                            </Marker>
                            {pharmacies.map((p) => (
                                <Marker key={p.id} position={[p.lat, p.lng]} icon={pharmacyIcon}>
                                    <Popup>
                                        <b>{p.name}</b>
                                        <br />
                                        {p.address}
                                        <br />
                                        <span className={p.stock === 'in-stock' ? 'in-stock-text' : 'out-of-stock-text'}>
                                            {p.stock === "in-stock" ? "In Stock" : "Out of Stock"}
                                        </span>
                                        {p.price > 0 && (
                                            <>
                                                <br />
                                                Price: ₹{p.price}
                                            </>
                                        )}
                                    </Popup>
                                </Marker>
                            ))}
                            <PharmacyFilter pharmacies={pharmacies} setVisiblePharmacies={setVisiblePharmacies} />
                        </MapContainer>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="fm-footer">
                <div className="fm-footer-content">
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
