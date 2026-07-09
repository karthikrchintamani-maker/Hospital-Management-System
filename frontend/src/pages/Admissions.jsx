import { useEffect, useState } from "react";
import API from "../api/axios";

function Admissions() {

  const [admissions, setAdmissions] = useState([]);
  const [filteredAdmissions, setFilteredAdmissions] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");


  const [formData, setFormData] = useState({

    patient_id: "",
    room_no: "",
    admission_date: "",
    discharge_date: "",

  });



  useEffect(() => {

    fetchAdmissions();

  }, []);




  useEffect(() => {

    const result = admissions.filter((item)=>

      String(item.patient_id)
      .includes(search)

    );


    setFilteredAdmissions(result);


  }, [search, admissions]);





  const fetchAdmissions = async()=>{

    try{

      const response = await API.get("/admissions/");

      setAdmissions(response.data);

      setFilteredAdmissions(response.data);


    }
    catch(error){

      console.log(error);

    }

  };






  const handleChange=(e)=>{

    setFormData({

      ...formData,

      [e.target.name]:e.target.value,

    });

  };






  const resetForm=()=>{


    setEditingId(null);


    setFormData({

      patient_id:"",
      room_no:"",
      admission_date:"",
      discharge_date:"",

    });


  };







  const saveAdmission=async()=>{


    try{


      if(editingId===null){


        await API.post("/admissions/",{

          ...formData,

          patient_id:Number(formData.patient_id)

        });


        alert("Admission added successfully");


      }
      else{


        await API.put(`/admissions/${editingId}`,{


          ...formData,

          patient_id:Number(formData.patient_id)


        });


        alert("Admission updated successfully");


      }



      setShowModal(false);

      resetForm();

      fetchAdmissions();



    }
    catch(error){

      console.log(error);

      alert("Operation failed");

    }


  };







  const deleteAdmission=async(id)=>{


    if(!window.confirm("Delete this admission?"))
      return;



    try{


      await API.delete(`/admissions/${id}`);

      fetchAdmissions();


    }
    catch(error){

      console.log(error);

    }


  };







  const editAdmission=(item)=>{


    setEditingId(item.admission_id);



    setFormData({

      patient_id:item.patient_id,

      room_no:item.room_no,

      admission_date:item.admission_date,

      discharge_date:item.discharge_date || "",


    });



    setShowModal(true);


  };








return (

<div className="container-fluid">



<div className="d-flex justify-content-between align-items-center mb-4">


<h2>
Admissions Management
</h2>



<button

className="btn btn-primary"

onClick={()=>{

resetForm();

setShowModal(true);

}}

>

+ Add Admission

</button>


</div>





<div className="row mb-3">


<div className="col-md-4">


<input

type="text"

className="form-control"

placeholder="Search by Patient ID..."

value={search}

onChange={(e)=>setSearch(e.target.value)}

/>


</div>


</div>







<table className="table table-bordered table-hover">


<thead className="table-dark">


<tr>

<th>ID</th>

<th>Patient ID</th>

<th>Room Number</th>

<th>Admission Date</th>

<th>Discharge Date</th>

<th>Actions</th>


</tr>


</thead>






<tbody>


{

filteredAdmissions.length===0 ? (


<tr>

<td colSpan="6" className="text-center">

No Admissions Found

</td>

</tr>


)

:

(

filteredAdmissions.map((item)=>(


<tr key={item.admission_id}>


<td>{item.admission_id}</td>


<td>{item.patient_id}</td>


<td>{item.room_no || "N/A"}</td>


<td>{item.admission_date}</td>


<td>{item.discharge_date || "N/A"}</td>




<td>


<button

className="btn btn-warning btn-sm me-2"

onClick={()=>editAdmission(item)}

>

Edit

</button>





<button

className="btn btn-danger btn-sm"

onClick={()=>deleteAdmission(item.admission_id)}

>

Delete

</button>



</td>


</tr>


))


)


}


</tbody>



</table>








{

showModal && (



<div

className="modal d-block"

style={{backgroundColor:"rgba(0,0,0,0.5)"}}

>


<div className="modal-dialog">


<div className="modal-content">





<div className="modal-header">


<h5 className="modal-title">


{

editingId===null

?

"Add Admission"

:

"Edit Admission"

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

placeholder="Room Number"

name="room_no"

value={formData.room_no}

onChange={handleChange}

/>





<input

type="date"

className="form-control mb-3"

name="admission_date"

value={formData.admission_date}

onChange={handleChange}

/>





<input

type="date"

className="form-control"

name="discharge_date"

value={formData.discharge_date}

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

onClick={saveAdmission}

>

{

editingId===null

?

"Add Admission"

:

"Update Admission"

}


</button>


</div>





</div>


</div>


</div>



)


}



</div>


);


}


export default Admissions;