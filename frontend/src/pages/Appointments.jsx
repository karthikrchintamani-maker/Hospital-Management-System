import { useEffect, useState } from "react";
import API from "../api/axios";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    patient_id: "",
    doctor_id: "",
    appointment_date: "",
    status: "",
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    const result = appointments.filter((item) =>
      String(item.patient_id).includes(search)
    );

    setFilteredAppointments(result);
  }, [search, appointments]);

  const fetchAppointments = async () => {
    try {
      const response = await API.get("/appointments/");
      setAppointments(response.data);
      setFilteredAppointments(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setEditingId(null);

    setFormData({
      patient_id: "",
      doctor_id: "",
      appointment_date: "",
      status: "",
    });
  };

  const saveAppointment = async () => {
    try {
      if (editingId === null) {
        await API.post("/appointments/", {
          ...formData,
          patient_id: Number(formData.patient_id),
          doctor_id: Number(formData.doctor_id),
        });

        alert("Appointment added successfully!");
      } else {
        await API.put(`/appointments/${editingId}`, {
          ...formData,
          patient_id: Number(formData.patient_id),
          doctor_id: Number(formData.doctor_id),
        });

        alert("Appointment updated successfully!");
      }

      setShowModal(false);
      resetForm();
      fetchAppointments();
    } catch (error) {
      console.log(error);
      alert("Operation failed!");
    }
  };

  const deleteAppointment = async (id) => {
    if (!window.confirm("Delete this appointment?")) return;

    try {
      await API.delete(`/appointments/${id}`);
      fetchAppointments();
      alert("Deleted successfully!");
    } catch (error) {
      console.log(error);
      alert("Delete failed!");
    }
  };

  const editAppointment = (item) => {
    setEditingId(item.appointment_id);

    setFormData({
      patient_id: item.patient_id,
      doctor_id: item.doctor_id,
      appointment_date: item.appointment_date,
      status: item.status,
    });

    setShowModal(true);
  };

  return (
    <div className="container-fluid">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Appointments Management</h2>

        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          + Add Appointment
        </button>
      </div>

      <div className="row mb-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Patient ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <table className="table table-bordered table-hover">

        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Patient ID</th>
            <th>Doctor ID</th>
            <th>Date</th>
            <th>Status</th>
            <th width="180">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredAppointments.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                No Appointments Found
              </td>
            </tr>
          ) : (
            filteredAppointments.map((item) => (
              <tr key={item.appointment_id}>
                <td>{item.appointment_id}</td>
                <td>{item.patient_id}</td>
                <td>{item.doctor_id}</td>
                <td>{item.appointment_date}</td>
                <td>{item.status}</td>

                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => editAppointment(item)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() =>
                      deleteAppointment(item.appointment_id)
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>

      </table>

      {showModal && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">
                  {editingId === null
                    ? "Add Appointment"
                    : "Edit Appointment"}
                </h5>

                <button
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                ></button>
              </div>

              <div className="modal-body">

                <input
                  className="form-control mb-3"
                  placeholder="Patient ID"
                  name="patient_id"
                  value={formData.patient_id}
                  onChange={handleChange}
                />

                <input
                  className="form-control mb-3"
                  placeholder="Doctor ID"
                  name="doctor_id"
                  value={formData.doctor_id}
                  onChange={handleChange}
                />

                <input
                  type="date"
                  className="form-control mb-3"
                  name="appointment_date"
                  value={formData.appointment_date}
                  onChange={handleChange}
                />

                <input
                  className="form-control"
                  placeholder="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                />

              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-success"
                  onClick={saveAppointment}
                >
                  {editingId === null
                    ? "Add Appointment"
                    : "Update Appointment"}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Appointments;