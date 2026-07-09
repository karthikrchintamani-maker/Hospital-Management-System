import { useEffect, useState } from "react";
import API from "../api/axios";

function Laboratory() {

  const [labs, setLabs] = useState([]);
  const [filteredLabs, setFilteredLabs] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");


  const [formData, setFormData] = useState({

    patient_id: "",
    test_name: "",
    result: "",
    test_date: "",

  });



  useEffect(() => {

    fetchLabs();

  }, []);



  useEffect(() => {

    const result = labs.filter((item) =>

      (item.test_name || "")
      .toLowerCase()
      .includes(search.toLowerCase())

    );


    setFilteredLabs(result);


  }, [search, labs]);





  const fetchLabs = async () => {

    try {

      const response = await API.get("/laboratory/");

      setLabs(response.data);

      setFilteredLabs(response.data);


    } catch(error){

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

      patient_id:"",
      test_name:"",
      result:"",
      test_date:"",

    });


  };






  const saveLab = async () => {


    try{


      if(editingId === null){


        await API.post("/laboratory/",{


          ...formData,

          patient_id:Number(formData.patient_id)


        });



        alert("Test Added Successfully");


      }

      else{


        await API.put(`/laboratory/${editingId}`,{


          ...formData,

          patient_id:Number(formData.patient_id)


        });



        alert("Test Updated Successfully");


      }



      setShowModal(false);

      resetForm();

      fetchLabs();



    }
    catch(error){

      console.log(error);

      alert("Operation Failed");

    }


  };






  const deleteLab = async(id)=>{


    if(!window.confirm("Delete this test?"))
      return;



    try{


      await API.delete(`/laboratory/${id}`);

      fetchLabs();


    }
    catch(error){

      console.log(error);

    }


  };







  const editLab = (item)=>{


    setEditingId(item.lab_id);



    setFormData({

      patient_id:item.patient_id,

      test_name:item.test_name,

      result:item.result,

      test_date:item.test_date,


    });



    setShowModal(true);


  };







return (

<div className="container-fluid">


<div className="d-flex justify-content-between align-items-center mb-4">


<h2>
Laboratory Management
</h2>


<button

className="btn btn-primary"

onClick={()=>{

resetForm();

setShowModal(true);

}}

>

+ Add Test

</button>


</div>





<input

className="form-control mb-3"

placeholder="Search Test Name..."

value={search}

onChange={(e)=>setSearch(e.target.value)}

/>







<table className="table table-bordered table-hover">


<thead className="table-dark">


<tr>

<th>ID</th>

<th>Patient ID</th>

<th>Test Name</th>

<th>Result</th>

<th>Test Date</th>

<th>Actions</th>


</tr>


</thead>





<tbody>


{

filteredLabs.length === 0 ? (


<tr>

<td colSpan="6" className="text-center">

No Laboratory Records Found

</td>

</tr>


)

:

(


filteredLabs.map((item)=>(


<tr key={item.lab_id}>


<td>{item.lab_id}</td>


<td>{item.patient_id}</td>


<td>{item.test_name}</td>


<td>{item.result || "Pending"}</td>


<td>{item.test_date}</td>




<td>


<button

className="btn btn-warning btn-sm me-2"

onClick={()=>editLab(item)}

>

Edit

</button>





<button

className="btn btn-danger btn-sm"

onClick={()=>deleteLab(item.lab_id)}

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

"Add Test"

:

"Edit Test"

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

placeholder="Test Name"

name="test_name"

value={formData.test_name}

onChange={handleChange}

/>





<input

className="form-control mb-3"

placeholder="Result"

name="result"

value={formData.result}

onChange={handleChange}

/>





<input

type="date"

className="form-control"

name="test_date"

value={formData.test_date}

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

onClick={saveLab}

>

{

editingId===null

?

"Add Test"

:

"Update Test"

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


export default Laboratory;