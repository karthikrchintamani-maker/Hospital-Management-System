import { useEffect, useState } from "react";
import API from "../api/axios";

function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    patient_id: "",
    doctor_id: "",
    medicine: "",
    dosage: "",
    prescription_date: "",
  });

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  useEffect(() => {
    const result = prescriptions.filter((item) =>
      item.medicine.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredPrescriptions(result);
  }, [search, prescriptions]);

  const fetchPrescriptions = async () => {
    try {
      const response = await API.get("/prescriptions/");
      setPrescriptions(response.data);
      setFilteredPrescriptions(response.data);
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
      medicine: "",
      dosage: "",
      prescription_date: "",
    });
  };

  const savePrescription = async () => {
    try {
      if (editingId === null) {
        await API.post("/prescriptions/", {
          ...formData,
          patient_id: Number(formData.patient_id),
          doctor_id: Number(formData.doctor_id),
        });

        alert("Prescription added successfully!");
      } else {
        await API.put(`/prescriptions/${editingId}`, {
          ...formData,
          patient_id: Number(formData.patient_id),
          doctor_id: Number(formData.doctor_id),
        });

        alert("Prescription updated successfully!");
      }

      setShowModal(false);
      resetForm();
      fetchPrescriptions();
    } catch (error) {
      console.log(error);
      alert("Operation failed!");
    }
  };

  const deletePrescription = async (id) => {
    if (!window.confirm("Delete this prescription?")) return;

    try {
      await API.delete(`/prescriptions/${id}`);
      fetchPrescriptions();
      alert("Deleted successfully!");
    } catch (error) {
      console.log(error);
      alert("Delete failed!");
    }
  };

  const editPrescription = (item) => {
    setEditingId(item.prescription_id);

    setFormData({
      patient_id: item.patient_id,
      doctor_id: item.doctor_id,
      medicine: item.medicine,
      dosage: item.dosage,
      prescription_date: item.prescription_date,
    });

    setShowModal(true);
  };

  return (
    <div className="container-fluid">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Prescriptions Management</h2>

        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          + Add Prescription
        </button>
      </div>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search Medicine..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table className="table table-bordered table-hover">

        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Patient ID</th>
            <th>Doctor ID</th>
            <th>Medicine</th>
            <th>Dosage</th>
            <th>Date</th>
            <th width="180">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredPrescriptions.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center">
                No Prescriptions Found
              </td>
            </tr>
          ) : (
            filteredPrescriptions.map((item) => (
              <tr key={item.prescription_id}>
                <td>{item.prescription_id}</td>
                <td>{item.patient_id}</td>
                <td>{item.doctor_id}</td>
                <td>{item.medicine}</td>
                <td>{item.dosage}</td>
                <td>{item.prescription_date}</td>

                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => editPrescription(item)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() =>
                      deletePrescription(item.prescription_id)
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
    </div>
  );
}

export default Prescriptions;