import { Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Doctors from "./pages/Doctors";
import Appointments from "./pages/Appointments";
import Admissions from "./pages/Admissions";
import Billing from "./pages/Billing";
import Laboratory from "./pages/Laboratory";
import Inventory from "./pages/Inventory";
import MedicalRecords from "./pages/MedicalRecords";
import Prescriptions from "./pages/Prescriptions";
import InsuranceClaims from "./pages/InsuranceClaims";
import CombinedReports from "./pages/CombinedReports";

import "./App.css";

function App() {
  return (
    <div className="app">
      <Sidebar />

      <div className="main-content">
        <Navbar />

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/admissions" element={<Admissions />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/laboratory" element={<Laboratory />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/medical-records" element={<MedicalRecords />} />
          <Route path="/prescriptions" element={<Prescriptions />} />
          <Route path="/insurance-claims" element={<InsuranceClaims />} />
          <Route path="/combined-reports"element={<CombinedReports />}/>
        </Routes>
      </div>
    </div>
  );
}

export default App;