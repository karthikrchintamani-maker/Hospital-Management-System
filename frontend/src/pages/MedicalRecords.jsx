import { useEffect, useState } from "react";
import API from "../api/axios";

function MedicalRecords() {

  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    patient_id: "",
    diagnosis: "",
    treatment: "",
    record_date: ""
  });



  useEffect(() => {
    fetchRecords();
  }, []);



  useEffect(() => {

    const result = records.filter((item)=>

      item.diagnosis
      ?.toLowerCase()
      .includes(search.toLowerCase())

    );

    setFilteredRecords(result);

  },[search,records]);





  const fetchRecords = async()=>{

    try{

      const response = await API.get("/medical-records/");

      setRecords(response.data);
      setFilteredRecords(response.data);

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
      diagnosis:"",
      treatment:"",
      record_date:""

    });

  };






  const saveRecord=async()=>{


    try{


      if(editingId===null){


        await API.post("/medical-records/",{

          ...formData,

          patient_id:Number(formData.patient_id)

        });


        alert("Record Added Successfully");


      }
      else{


        await API.put(`/medical-records/${editingId}`,{

          ...formData,

          patient_id:Number(formData.patient_id)

        });


        alert("Record Updated Successfully");

      }


      setShowModal(false);

      resetForm();

      fetchRecords();


    }
    catch(error){

      console.log(error);

      alert("Operation Failed");

    }


  };






  const deleteRecord=async(id)=>{


    if(!window.confirm("Delete this record?"))
      return;


    try{

      await API.delete(`/medical-records/${id}`);

      fetchRecords();

      alert("Deleted Successfully");

    }
    catch(error){

      console.log(error);

    }


  };







  const editRecord=(item)=>{


    setEditingId(item.record_id);


    setFormData({

      patient_id:item.patient_id,

      diagnosis:item.diagnosis,

      treatment:item.treatment,

      record_date:item.record_date

    });


    setShowModal(true);


  };





return(

<div className="container-fluid">


<div className="d-flex justify-content-between align-items-center mb-4">


<h2>
Medical Records Management
</h2>


<button

className="btn btn-primary"

onClick={()=>{

resetForm();

setShowModal(true);

}}

>

+ Add Record

</button>


</div>





<input

className="form-control mb-3"

placeholder="Search Diagnosis..."

value={search}

onChange={(e)=>setSearch(e.target.value)}

/>






<table className="table table-bordered table-hover">


<thead className="table-dark">


<tr>

<th>ID</th>

<th>Patient ID</th>

<th>Diagnosis</th>

<th>Treatment</th>

<th>Record Date</th>

<th>Actions</th>

</tr>


</thead>




<tbody>


{

filteredRecords.length===0 ?


<tr>

<td colSpan="6" className="text-center">

No Records Found

</td>

</tr>


:


filteredRecords.map((item)=>(


<tr key={item.record_id}>


<td>
{item.record_id}
</td>


<td>
{item.patient_id}
</td>


<td>
{item.diagnosis}
</td>


<td>
{item.treatment}
</td>


<td>
{item.record_date}
</td>




<td>


<button

className="btn btn-warning btn-sm me-2"

onClick={()=>editRecord(item)}

>

Edit

</button>




<button

className="btn btn-danger btn-sm"

onClick={()=>deleteRecord(item.record_id)}

>

Delete

</button>



</td>


</tr>


))


}


</tbody>


</table>









{showModal && (

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
?
"Add Record"
:
"Edit Record"
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

placeholder="Diagnosis"

name="diagnosis"

value={formData.diagnosis}

onChange={handleChange}

/>




<input

className="form-control mb-3"

placeholder="Treatment"

name="treatment"

value={formData.treatment}

onChange={handleChange}

/>




<input

type="date"

className="form-control"

name="record_date"

value={formData.record_date}

onChange={handleChange}

/>



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

onClick={saveRecord}

>

{
editingId===null
?
"Add Record"
:
"Update Record"
}

</button>



</div>




</div>


</div>


</div>

)}



</div>

);


}


export default MedicalRecords;