import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FindMedicine from "./Components/FirstPage";
import MapPage from "./Components/MapPage"; // ✅ make sure path is correct

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FindMedicine />} />
        <Route path="/mappage" element={<MapPage />} />
      </Routes>
    </Router>
  );
}

export default App;
