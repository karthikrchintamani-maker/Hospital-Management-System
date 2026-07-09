import "./Sidebar.css";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="sidebar">

      <h2>HMS</h2>

      <Link to="/">
        Dashboard
      </Link>

      <Link to="/patients">
        Patients
      </Link>

      <Link to="/doctors">
        Doctors
      </Link>

      <Link to="/appointments">
        Appointments
      </Link>

      <Link to="/admissions">
        Admissions
      </Link>

      <Link to="/billing">
        Billing
      </Link>

      <Link to="/laboratory">
        Laboratory
      </Link>

      <Link to="/inventory">
        Inventory
      </Link>

      <Link to="/medical-records">
        Medical Records
      </Link>

      <Link to="/prescriptions">
        Prescriptions
      </Link>

      <Link to="/insurance-claims">
        Insurance Claims
      </Link>

      <Link to="/combined-reports">
        Combined Reports
      </Link>

    </div>
  );
}

export default Sidebar;