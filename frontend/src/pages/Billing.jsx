import { useEffect, useState } from "react";
import API from "../api/axios";

function Billing() {
  const [bills, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    patient_id: "",
    amount: "",
    payment_status: "",
    bill_date: "",
  });

  useEffect(() => {
    fetchBills();
  }, []);

  useEffect(() => {
    const result = bills.filter((item) =>
      String(item.patient_id).includes(search)
    );

    setFilteredBills(result);
  }, [search, bills]);

  const fetchBills = async () => {
    try {
      const response = await API.get("/billing/");
      setBills(response.data);
      setFilteredBills(response.data);
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
      amount: "",
      payment_status: "",
      bill_date: "",
    });
  };

  const saveBill = async () => {
    try {
      if (editingId === null) {
        await API.post("/billing/", {
          ...formData,
          patient_id: Number(formData.patient_id),
          amount: Number(formData.amount),
        });

        alert("Bill added successfully!");
      } else {
        await API.put(`/billing/${editingId}`, {
          ...formData,
          patient_id: Number(formData.patient_id),
          amount: Number(formData.amount),
        });

        alert("Bill updated successfully!");
      }

      setShowModal(false);
      resetForm();
      fetchBills();
    } catch (error) {
      console.log(error);
      alert("Operation failed!");
    }
  };

  const deleteBill = async (id) => {
    if (!window.confirm("Delete this bill?")) return;

    try {
      await API.delete(`/billing/${id}`);
      fetchBills();
      alert("Deleted successfully!");
    } catch (error) {
      console.log(error);
      alert("Delete failed!");
    }
  };

  const editBill = (item) => {
    setEditingId(item.bill_id);

    setFormData({
      patient_id: item.patient_id,
      amount: item.amount,
      payment_status: item.payment_status,
      bill_date: item.bill_date,
    });

    setShowModal(true);
  };

  return (
    <div className="container-fluid">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Billing Management</h2>

        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          + Add Bill
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
            <th>Amount</th>
            <th>Payment Status</th>
            <th>Bill Date</th>
            <th width="180">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredBills.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                No Bills Found
              </td>
            </tr>
          ) : (
            filteredBills.map((item) => (
              <tr key={item.bill_id}>
                <td>{item.bill_id}</td>
                <td>{item.patient_id}</td>
                <td>{item.amount}</td>
                <td>
                  <span
                    className={
                      item.payment_status === "Paid"
                        ? "badge bg-success"
                        : "badge bg-danger"
                    }
                  >
                    {item.payment_status}
                  </span>
                </td>
                <td>{item.bill_date}</td>

                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => editBill(item)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteBill(item.bill_id)}
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
                  {editingId === null ? "Add Bill" : "Edit Bill"}
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
                  type="number"
                  className="form-control mb-3"
                  placeholder="Amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                />

                <select
                  className="form-select mb-3"
                  name="payment_status"
                  value={formData.payment_status}
                  onChange={handleChange}
                >
                  <option value="">Select Status</option>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                </select>

                <input
                  type="date"
                  className="form-control"
                  name="bill_date"
                  value={formData.bill_date}
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
                  onClick={saveBill}
                >
                  {editingId === null ? "Add Bill" : "Update Bill"}
                </button>

              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Billing;