import L from "leaflet";
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import { Link, useLocation } from "react-router-dom";
import "./MapPage.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

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
function Routing({ userLocation, selectedPharmacy }) {
  const map = useMapEvents({});

  useEffect(() => {
    if (!map || !selectedPharmacy) return;

    // Remove old route
    map.eachLayer((layer) => {
      if (layer instanceof L.Routing.Control) {
        map.removeControl(layer);
      }
    });

    // Add new route
    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(userLocation.lat, userLocation.lng),
        L.latLng(selectedPharmacy.lat, selectedPharmacy.lng),
      ],
      routeWhileDragging: true,
      showAlternatives: false,
      lineOptions: {
        styles: [{ color: "blue", weight: 5 }],
      },
      createMarker: () => null, // hide duplicate markers
    }).addTo(map);

    return () => {
      map.removeControl(routingControl);
    };
  }, [map, userLocation, selectedPharmacy]);

  return null;
}


// ---------------------
// Main Component
// ---------------------
export default function MapPage() {
    const location = useLocation();
    const [selectedPharmacy, setSelectedPharmacy] = useState(null);

    
    const locationState = location.state || {};
    const storedData = JSON.parse(sessionStorage.getItem('mapPageData') || '{}');
    const medicineData = locationState.medicineData || storedData.medicineData;
    const medicine = locationState.medicine || storedData.medicine;
    const dosage = locationState.dosage || storedData.dosage;
    const passedLocation = locationState.userLocation || storedData.userLocation;
    
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

    const initialLocation = passedLocation
        ? {
            lat: parseFloat(passedLocation.split(',')[0]) || 10.001,
            lng: parseFloat(passedLocation.split(',')[1]) || 76.320
        }
        : { lat: 10.001, lng: 76.320 };

    const [userLocation, setUserLocation] = useState(initialLocation);
    const [pharmacies, setPharmacies] = useState([]);
    const [visiblePharmacies, setVisiblePharmacies] = useState([]);

    useEffect(() => {
        if (medicineData?.stocks?.length > 0) {
            const fetchPharmacyDetails = async () => {
                try {
                    const pharmacyList = await Promise.all(
                        medicineData.stocks.map(async (item) => {
                            try {
                                const response = await fetch(
                                    `${BACKEND_URL}/api/pharmacy/details?pharmacy_id=${item.pharmacy_id}`
                                );
                                const pharmacy = await response.json();
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
                                    location_url: pharmacy?.location_url || null,
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
      {medicine && (
        <h3 className="medicine-title">
          Showing results for: {medicine} {dosage && `(${dosage})`}
        </h3>
      )}

      {/* Scrollable container for pharmacy cards */}
      <div className="pharmacy-list-scroll">
        {visiblePharmacies.length > 0 ? (
          visiblePharmacies.map((pharmacy) => (
            <div key={pharmacy.id} className="pharmacy-card">
              <div className="pharmacy-info">
                <h3>{pharmacy.name}</h3>
                <p>Address: {pharmacy.address}</p>
                <p>Closes: {pharmacy.closing}</p>
                <p>Phone: {pharmacy.phone}</p>
                {pharmacy.price > 0 && <p>Price: ₹{pharmacy.price}</p>}

                <button
                  className="google-maps-btn"
                  onClick={() => {
                    const mapsUrl = pharmacy.location_url 
                      ? pharmacy.location_url 
                      : `https://www.google.com/maps?q=${pharmacy.lat},${pharmacy.lng}`;
                    window.open(mapsUrl, '_blank');
                  }}
                  title="Open in Google Maps"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M350-510q0 61 41 106.5t89 83.5q48-38 89-83.5T610-510q0-54-38-92t-92-38q-54 0-92 38t-38 92Zm130 30q-17 0-28.5-11.5T440-520q0-17 11.5-28.5T480-560q17 0 28.5 11.5T520-520q0 17-11.5 28.5T480-480ZM320-200q-117 0-198.5-81.5T40-480q0-117 81.5-198.5T320-760h320q117 0 198.5 81.5T920-480q0 117-81.5 198.5T640-200H320Zm0-80h320q83 0 141.5-58.5T840-480q0-83-58.5-141.5T640-680H320q-83 0-141.5 58.5T120-480q0 83 58.5 141.5T320-280Zm160-200Z"/></svg>
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
    </div>


                    {/* Right Panel - Map */}
                    <div className="right-panel">
                        <MapContainer
                            center={[userLocation.lat, userLocation.lng]}
                            zoom={15}
                            scrollWheelZoom={true}
                            style={{ height: "100%", width: "100%", borderRadius: "10px" }}
                            >
                            {/* ✅ OpenStreetMap Tiles */}
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />

                            {/* ✅ User Location Marker */}
                            <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                                <Popup>Your Location</Popup>
                            </Marker>

                            {/* ✅ Pharmacy Markers */}
                            {pharmacies.map((p) => (
                                <Marker key={p.id} position={[p.lat, p.lng]} icon={pharmacyIcon}>
                                <Popup>
                                    <b>{p.name}</b>
                                    <br />
                                    {p.address}
                                    <br />
                                    <span
                                    className={p.stock === "in-stock" ? "in-stock-text" : "out-of-stock-text"}
                                    >
                                    {p.stock === "in-stock" ? "In Stock" : "Out of Stock"}
                                    </span>
                                    {p.price > 0 && (
                                    <>
                                        <br />
                                        Price: ₹{p.price}
                                    </>
                                    )}
                                    <br />
                                    
                                </Popup>
                                </Marker>
                            ))}

                            {/* ✅ Pharmacy Filter */}
                            <PharmacyFilter pharmacies={pharmacies} setVisiblePharmacies={setVisiblePharmacies} />

                            {/* ✅ Routing Component */}
                            <Routing userLocation={userLocation} selectedPharmacy={selectedPharmacy} />
                        </MapContainer>

                    </div>
                </div>
            </main>

      <footer className="fm-footer">
        <div className="fm-footer-links">
          <Link to="/">About Us</Link>
          <Link to="/">Services</Link>
          <Link to="/">Contact</Link>
          <Link to="/">Privacy Policy</Link>
          <Link to="/">Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
}
