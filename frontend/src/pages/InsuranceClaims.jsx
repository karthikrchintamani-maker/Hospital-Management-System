import { useEffect, useState } from "react";
import API from "../api/axios";

function InsuranceClaims() {

  const [claims, setClaims] = useState([]);
  const [filteredClaims, setFilteredClaims] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    patient_id:"",
    insurance_company:"",
    claim_amount:"",
    status:""
  });


  useEffect(()=>{
    fetchClaims();
  },[]);


  useEffect(()=>{

    const result = claims.filter((item)=>
      item.insurance_company
      ?.toLowerCase()
      .includes(search.toLowerCase())
    );

    setFilteredClaims(result);

  },[search,claims]);



  const fetchClaims = async()=>{

    try{

      const response = await API.get("/insurance_claims/");

      setClaims(response.data);
      setFilteredClaims(response.data);

    }
    catch(error){
      console.log(error);
    }

  };



  const handleChange=(e)=>{

    setFormData({
      ...formData,
      [e.target.name]:e.target.value
    });

  };



  const resetForm=()=>{

    setEditingId(null);

    setFormData({
      patient_id:"",
      insurance_company:"",
      claim_amount:"",
      status:""
    });

  };



  const saveClaim=async()=>{

    try{

      const data={
        ...formData,
        patient_id:Number(formData.patient_id),
        claim_amount:Number(formData.claim_amount)
      };


      if(editingId===null){

        await API.post("/insurance_claims/",data);

        alert("Claim Added Successfully");

      }
      else{

        await API.put(
          `/insurance_claims/${editingId}`,
          data
        );

        alert("Claim Updated Successfully");

      }


      setShowModal(false);
      resetForm();
      fetchClaims();


    }
    catch(error){

      console.log(error);
      alert("Operation Failed");

    }

  };



  const deleteClaim=async(id)=>{

    if(!window.confirm("Delete this claim?"))
      return;


    try{

      await API.delete(`/insurance_claims/${id}`);

      fetchClaims();

    }
    catch(error){

      console.log(error);

    }

  };



  const editClaim=(item)=>{

    setEditingId(item.claim_id);


    setFormData({

      patient_id:item.patient_id,
      insurance_company:item.insurance_company,
      claim_amount:item.claim_amount,
      status:item.status

    });


    setShowModal(true);

  };




return (

<div className="container-fluid">


<div className="d-flex justify-content-between align-items-center mb-4">

<h2>
Insurance Claims Management
</h2>


<button
className="btn btn-primary"
onClick={()=>{
resetForm();
setShowModal(true);
}}
>
+ Add Claim
</button>


</div>



<input

className="form-control mb-3"

placeholder="Search Insurance Provider..."

value={search}

onChange={(e)=>setSearch(e.target.value)}

/>




<table className="table table-bordered table-hover">


<thead className="table-dark">

<tr>

<th>ID</th>
<th>Patient ID</th>
<th>Insurance Provider</th>
<th>Claim Amount</th>
<th>Status</th>
<th>Actions</th>

</tr>

</thead>



<tbody>


{
filteredClaims.length===0 ?

<tr>
<td colSpan="6" className="text-center">
No Claims Found
</td>
</tr>


:

filteredClaims.map((item)=>(


<tr key={item.claim_id}>


<td>{item.claim_id}</td>

<td>{item.patient_id}</td>

<td>{item.insurance_company}</td>

<td>
₹ {item.claim_amount}
</td>

<td>{item.status}</td>


<td>


<button

className="btn btn-warning btn-sm me-2"

onClick={()=>editClaim(item)}

>
Edit
</button>



<button

className="btn btn-danger btn-sm"

onClick={()=>deleteClaim(item.claim_id)}

>
Delete
</button>


</td>


</tr>


))

}



</tbody>


</table>





{
showModal &&

<div
className="modal d-block"
style={{
backgroundColor:"rgba(0,0,0,0.5)"
}}
>


<div className="modal-dialog">

<div className="modal-content">


<div className="modal-header">

<h5>
{
editingId===null
?"Add Claim"
:"Edit Claim"
}
</h5>


<button
className="btn-close"
onClick={()=>{
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

placeholder="Insurance Company"

name="insurance_company"

value={formData.insurance_company}

onChange={handleChange}

/>



<input

className="form-control mb-3"

placeholder="Claim Amount"

name="claim_amount"

value={formData.claim_amount}

onChange={handleChange}

/>



<select

className="form-control"

name="status"

value={formData.status}

onChange={handleChange}

>


<option value="">
Select Status
</option>

<option>
Pending
</option>

<option>
Approved
</option>

<option>
Rejected
</option>


</select>



</div>




<div className="modal-footer">


<button

className="btn btn-secondary"

onClick={()=>{
setShowModal(false);
resetForm();
}}

>
Cancel
</button>



<button

className="btn btn-success"

onClick={saveClaim}

>

{
editingId===null
?"Add Claim"
:"Update Claim"
}

</button>


</div>



</div>

</div>


</div>

}


</div>

);

}


export default InsuranceClaims;