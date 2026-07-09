import { useEffect, useState } from "react";
import API from "../api/axios";

function CombinedReports() {

  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [search, setSearch] = useState("");


  useEffect(() => {

    fetchAppointments();

  }, []);


  useEffect(() => {

    const result = appointments.filter((item) =>

      item.patient_name
        .toLowerCase()
        .includes(search.toLowerCase())

      ||

      (item.status || "")
        .toLowerCase()
        .includes(search.toLowerCase())

    );

    setFilteredAppointments(result);

  }, [search, appointments]);


  const fetchAppointments = async () => {

    try {

      const response = await API.get(
        "/combine/patient-appointments"
      );

      setAppointments(response.data);
      setFilteredAppointments(response.data);

    }
    catch (error) {

      console.log("Error:", error);

    }

  };


  return (

    <div className="container-fluid">

      <div className="d-flex justify-content-between align-items-center mb-4">

        <h2>
          Patient Appointment Reports
        </h2>

      </div>


      <input

        type="text"

        className="form-control mb-3"

        placeholder="Search Patient Name or Status..."

        value={search}

        onChange={(e) => setSearch(e.target.value)}

      />


      <table className="table table-bordered table-hover">

        <thead className="table-dark">

          <tr>

            <th>Patient ID</th>
            <th>Patient Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Appointment ID</th>
            <th>Appointment Date</th>
            <th>Status</th>

          </tr>

        </thead>


        <tbody>

        {
          filteredAppointments.length === 0 ?

          <tr>

            <td colSpan="7" className="text-center">

              No Records Found

            </td>

          </tr>

          :

          filteredAppointments.map((item) => (

            <tr key={item.patient_id}>

              <td>{item.patient_id}</td>

              <td>{item.patient_name}</td>

              <td>{item.age}</td>

              <td>{item.gender}</td>

              <td>
                {item.appointment_id ?? "N/A"}
              </td>

              <td>
                {item.appointment_date ?? "N/A"}
              </td>

              <td>
                {item.status ?? "No Appointment"}
              </td>

            </tr>

          ))
        }

        </tbody>

      </table>

    </div>

  );

}

export default CombinedReports;