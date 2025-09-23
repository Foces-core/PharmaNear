import L from "leaflet";
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import "./MapPage.css";

const pharmacies = [
    { id: 1, name: "Charuka Drug House", address: "Railway Station Rd", closing: "10:30pm", phone: "094187299399", lat: 10.003, lng: 76.321, stock: "in-stock" },
    { id: 2, name: "Sarva Medicine & Vaccine", address: "Opp. 45/23 Secvone office Kozhikode", closing: "9:30pm", phone: "04182965789", lat: 10.005, lng: 76.323, stock: "in-stock" },
    { id: 3, name: "Pakson Medicals", address: "Mavelikara Kozhencherry Rd", closing: "9:30pm", phone: "8718432338072", lat: 10.002, lng: 76.318, stock: "in-stock" },
    { id: 4, name: "Cure Well Medicals", address: "Government Hospital Jn", closing: "9:00pm", phone: "982435720736", lat: 10.004, lng: 76.325, stock: "in-stock" },
    { id: 5, name: "Pakson Medicals", address: "Mavelikara Kozhencherry Rd", closing: "9:30pm", phone: "8718432338072", lat: 10.006, lng: 76.320, stock: "out-of-stock" },
    { id: 6, name: "Pakson Medicals", address: "Mavelikara Kozhencherry Rd", closing: "9:30pm", phone: "8718432338072", lat: 10.001, lng: 76.324, stock: "out-of-stock" },
];

// Reliable marker icons hosted on jsDelivr (color markers)
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
                <h6 className="fm-text">PharmaNear</h6>
                <div className="search-bar-container">
                    <input type="text" placeholder="Search for medicines & health products" className="search-input" />
                </div>
                <div className="sort-container">
                    <span className="sort-text">Sort By</span>
                    <select className="sort-select">
                        <option>Location</option>
                        <option>Distance</option>
                    </select>
                </div>
                <div className="fm-location">
                    <div className="location-info">
                        <h6>Current address</h6>
                        <h6>Select location</h6>
                    </div>
                    {/* Inline location pin icon */}
                    <svg className="location-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path fill="#fff" d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
                    </svg>
                </div>
            </header>
            <main className="fm-main">
                <div className="content-wrapper">
                    <div className="left-panel">
                        <div className="pharmacy-list">
                            {visiblePharmacies.map((pharmacy) => (
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
                                    <div className="direction-icon" title="Directions">
                                        {/* Inline direction arrow icon */}
                                        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                            <path fill="#fff" d="M21.71 11.29l-9-9a1.003 1.003 0 00-1.42 0l-9 9c-.63.63-.18 1.71.71 1.71H7v6c0 .55.45 1 1 1h8c.55 0 1-.45 1-1v-6h3.99c.9 0 1.34-1.08.72-1.71zM13 19h-2v-6H8.41L12 9.41 15.59 13H13v6z"/>
                                        </svg>
                                    </div>
                                </div>
                            ))}
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

