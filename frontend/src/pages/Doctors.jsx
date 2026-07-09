import { useEffect, useState } from "react";
import API from "../services/api";

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    const result = doctors.filter((doctor) =>
      doctor.name.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredDoctors(result);
  }, [search, doctors]);

  const fetchDoctors = async () => {
    try {
      const response = await API.get("/doctors");
      setDoctors(response.data);
      setFilteredDoctors(response.data);
    } catch (error) {
      console.log("Doctor API Error:", error);
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
      name: "",
      specialization: "",
      phone: "",
      email: "",
    });
  };

  const saveDoctor = async () => {
    try {
      if (editingId === null) {
        await API.post("/doctors", formData);

        alert("Doctor added successfully!");
      } else {
        await API.put(`/doctors/${editingId}`, formData);

        alert("Doctor updated successfully!");
      }

      setShowModal(false);
      resetForm();
      fetchDoctors();
    } catch (error) {
      console.log(error);
      alert("Operation failed!");
    }
  };

  const deleteDoctor = async (id) => {
    if (!window.confirm("Delete this doctor?")) return;

    try {
      await API.delete(`/doctors/${id}`);

      alert("Doctor deleted successfully!");
      fetchDoctors();
    } catch (error) {
      console.log(error);
      alert("Delete failed!");
    }
  };

  const editDoctor = (doctor) => {
    setEditingId(doctor.doctor_id);

    setFormData({
      name: doctor.name,
      specialization: doctor.specialization,
      phone: doctor.phone,
      email: doctor.email,
    });

    setShowModal(true);
  };

  return (
    <div className="container-fluid">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Doctors Management</h2>

        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          + Add Doctor
        </button>
      </div>

      <div className="row mb-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search doctor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <table className="table table-bordered table-hover">

        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Specialization</th>
            <th>Phone</th>
            <th>Email</th>
            <th width="180">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredDoctors.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                No Doctors Found
              </td>
            </tr>
          ) : (
            filteredDoctors.map((doctor) => (
              <tr key={doctor.doctor_id}>
                <td>{doctor.doctor_id}</td>
                <td>{doctor.name}</td>
                <td>{doctor.specialization}</td>
                <td>{doctor.phone}</td>
                <td>{doctor.email}</td>

                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => editDoctor(doctor)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteDoctor(doctor.doctor_id)}
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
                  {editingId === null ? "Add Doctor" : "Edit Doctor"}
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

                <div className="mb-3">
                  <label className="form-label">
                    Name
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Specialization
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Phone
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Email
                  </label>

                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

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
                  onClick={saveDoctor}
                >
                  {editingId === null
                    ? "Add Doctor"
                    : "Update Doctor"}
                </button>

              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default Doctors;