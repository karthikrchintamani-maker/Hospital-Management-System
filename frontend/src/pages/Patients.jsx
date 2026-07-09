import { useEffect, useState } from "react";
import API from "../api/axios";

function Patients() {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    disease: "",
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    const result = patients.filter((patient) =>
      patient.name.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredPatients(result);
  }, [search, patients]);

  const fetchPatients = async () => {
    try {
      const response = await API.get("/patients/");
      setPatients(response.data);
      setFilteredPatients(response.data);
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
      name: "",
      age: "",
      gender: "",
      phone: "",
      disease: "",
    });
  };

  const savePatient = async () => {
    try {
      if (editingId === null) {
        await API.post("/patients/", {
          ...formData,
          age: Number(formData.age),
        });

        alert("Patient added successfully!");
      } else {
        await API.put(`/patients/${editingId}`, {
          ...formData,
          age: Number(formData.age),
        });

        alert("Patient updated successfully!");
      }

      setShowModal(false);
      resetForm();
      fetchPatients();
    } catch (error) {
      console.log(error);
      alert("Operation failed!");
    }
  };

  const deletePatient = async (id) => {
    if (!window.confirm("Delete this patient?")) return;

    try {
      await API.delete(`/patients/${id}`);
      alert("Patient deleted successfully!");
      fetchPatients();
    } catch (error) {
      console.log(error);
      alert("Delete failed!");
    }
  };

  const editPatient = (patient) => {
    setEditingId(patient.patient_id);

    setFormData({
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      phone: patient.phone,
      disease: patient.disease,
    });

    setShowModal(true);
  };

  return (
    <div className="container-fluid">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Patients Management</h2>

        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          + Add Patient
        </button>
      </div>

      <div className="row mb-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search patient..."
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
            <th>Age</th>
            <th>Gender</th>
            <th>Phone</th>
            <th>Disease</th>
            <th width="180">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredPatients.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center">
                No Patients Found
              </td>
            </tr>
          ) : (
            filteredPatients.map((patient) => (
              <tr key={patient.patient_id}>
                <td>{patient.patient_id}</td>
                <td>{patient.name}</td>
                <td>{patient.age}</td>
                <td>{patient.gender}</td>
                <td>{patient.phone}</td>
                <td>{patient.disease}</td>

                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => editPatient(patient)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deletePatient(patient.patient_id)}
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
                  {editingId === null ? "Add Patient" : "Edit Patient"}
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
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Age</label>
                  <input
                    type="number"
                    className="form-control"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Gender</label>

                  <select
                    className="form-select"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Disease</label>
                  <input
                    type="text"
                    className="form-control"
                    name="disease"
                    value={formData.disease}
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
                  onClick={savePatient}
                >
                  {editingId === null
                    ? "Add Patient"
                    : "Update Patient"}
                </button>

              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default Patients;