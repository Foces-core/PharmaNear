import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "./MapPage.css";
import "leaflet/dist/leaflet.css";

const pharmacies = [
    { id: 1, name: "Charuka Drug House", address: "Railway Station Rd", closing: "10:30pm", phone: "094187299399", lat: 10.003, lng: 76.321, stock: "in-stock" },
    { id: 2, name: "Sarva Medicine & Vaccine", address: "Opp. 45/23 Secvone office Kozhikode", closing: "9:30pm", phone: "04182965789", lat: 10.005, lng: 76.323, stock: "in-stock" },
    { id: 3, name: "Pakson Medicals", address: "Mavelikara Kozhencherry Rd", closing: "9:30pm", phone: "8718432338072", lat: 10.002, lng: 76.318, stock: "in-stock" },
    { id: 4, name: "Cure Well Medicals", address: "Government Hospital Jn", closing: "9:00pm", phone: "982435720736", lat: 10.004, lng: 76.325, stock: "in-stock" },
    { id: 5, name: "Pakson Medicals", address: "Mavelikara Kozhencherry Rd", closing: "9:30pm", phone: "8718432338072", lat: 10.006, lng: 76.320, stock: "out-of-stock" },
    { id: 6, name: "Pakson Medicals", address: "Mavelikara Kozhencherry Rd", closing: "9:30pm", phone: "8718432338072", lat: 10.001, lng: 76.324, stock: "out-of-stock" },
];

const userIcon = new L.Icon({
    iconUrl: "https://chart.googleapis.com/chart?chst=d_map_pin_icon&chld=home|FF0000",
    iconSize: [30, 42],
    iconAnchor: [15, 42],
});

const pharmacyIcon = new L.Icon({
    iconUrl: "https://chart.googleapis.com/chart?chst=d_map_pin_icon&chld=plus|008000",
    iconSize: [30, 42],
    iconAnchor: [15, 42],
});

function PharmacyFilter({ setVisiblePharmacies }) {
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

export default function MapPage() {
    const [userLocation, setUserLocation] = useState({ lat: 10.001, lng: 76.320 });
    const [visiblePharmacies, setVisiblePharmacies] = useState(pharmacies);

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
            <header className="fm-header">
                <h6 className="fm-text">FindMeds</h6>
            <div className="header-leftmost">
                <div className="location-icon">
                    <img src="https://api.iconify.design/material-symbols/location-on.svg" alt="Location Pin" className="location-icon" />
                </div>
                <div className="fm-location">
                    
                    <div className="location-info">
                        <h6>Current address</h6>
                        <h6>Select location</h6>
                    </div>
                </div>
            </div>
            </header>

            
            <div className="search-sort-container">
                <input
                    type="text"
                    placeholder="Search for medicines & health products"
                    className="search-input"
                />
            <div className="sort-wrapper">
                    <select className="sort-select">
                            <option value="" disabled selected>Sort by</option>
                            <option value="name">Name</option>
                            <option value="rating">Rating</option>
                            <option value="distance">Distance</option>
                    </select>
                </div>
            </div>

            <main className="fm-main">
                <div className="content-wrapper">
                    <div className="left-panel">
                        <div className="pharmacy-list">
                            {/* Conditional Rendering starts here */}
                            {visiblePharmacies.length > 0 ? (
                                visiblePharmacies.map((pharmacy) => (
                                    <div key={pharmacy.id} className="pharmacy-card">
                                        <div className="pharmacy-info">
                                            <h3>{pharmacy.name}</h3>
                                            <p>{pharmacy.address}</p>
                                            <p>Closes: {pharmacy.closing}</p>
                                            <p>{pharmacy.phone}</p>
                                        </div>
                                        <div className={`stock ${pharmacy.stock}`}>
                                            {pharmacy.stock === "in-stock" ? "In Stock" : "Out of Stock"}
                                        </div>
                                        <div className="direction-icon">
                                            <img src="https://api.iconify.design/material-symbols/directions-outline.svg" alt="Direction" />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="no-pharmacies-message">
                                    No pharmacies available in this area.
                                </div>
                            )}
                            {/* Conditional Rendering ends here */}
                        </div>
                    </div>
                    <div className="right-panel">
                        <MapContainer
                            center={[userLocation.lat, userLocation.lng]}
                            zoom={15}
                            scrollWheelZoom={true}
                            style={{ height: "100%", width: "100%", borderRadius: "10px" }}
                        >
                            <TileLayer
                                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors &copy; <a href='https://carto.com/attributions'>CARTO</a>"
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
                                    </Popup>
                                </Marker>
                            ))}
                            <PharmacyFilter setVisiblePharmacies={setVisiblePharmacies} />
                        </MapContainer>
                    </div>
                </div>
            </main>
            <footer className="fm-footer">
                <div className="fm-footer-content">
                    <a href="/">About Us</a>
                    <a href="/">Services</a>
                    <a href="/">Contact</a>
                    <a href="/">Privacy Policy</a>
                    <a href="/">Terms of Service</a>
                </div>
                <div className="fm-footer-text">© 2025 Innovate Solutions Inc. All rights reserved.</div>
            </footer>
        </div>
    );
}