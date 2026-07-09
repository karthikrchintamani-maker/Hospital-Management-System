import { useEffect, useState } from "react";
import API from "../api/axios";

function Inventory() {

  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");



  const [formData, setFormData] = useState({

    item_name: "",
    quantity: "",
    supplier: "",
    price: ""

  });



  useEffect(() => {

    fetchItems();

  }, []);




  useEffect(() => {


    const result = items.filter((item)=>

      item.item_name
      ?.toLowerCase()
      .includes(search.toLowerCase())

    );


    setFilteredItems(result);


  },[search,items]);





  const fetchItems = async()=>{


    try{


      const response = await API.get("/inventory/");


      setItems(response.data);

      setFilteredItems(response.data);


    }
    catch(error){


      console.log("Inventory Fetch Error:",error);


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

      item_name:"",
      quantity:"",
      supplier:"",
      price:""

    });


  };





  const saveItem=async()=>{


    try{


      const data={

        ...formData,

        quantity:Number(formData.quantity),

        price:Number(formData.price)

      };



      if(editingId===null){


        await API.post("/inventory/",data);


        alert("Item added successfully");


      }
      else{


        await API.put(

          `/inventory/${editingId}`,

          data

        );


        alert("Item updated successfully");


      }



      setShowModal(false);

      resetForm();

      fetchItems();



    }
    catch(error){


      console.log(error);

      alert("Operation failed");


    }


  };






  const deleteItem=async(id)=>{


    if(!window.confirm("Delete this item?"))

      return;



    try{


      await API.delete(`/inventory/${id}`);


      fetchItems();


      alert("Deleted successfully");


    }
    catch(error){


      console.log(error);


    }


  };






  const editItem=(item)=>{


    setEditingId(item.item_id);



    setFormData({


      item_name:item.item_name || "",

      quantity:item.quantity || "",

      supplier:item.supplier || "",

      price:item.price || ""


    });



    setShowModal(true);


  };






  return(


<div className="container-fluid">



<div className="d-flex justify-content-between align-items-center mb-4">


<h2>
Inventory Management
</h2>



<button

className="btn btn-primary"

onClick={()=>{

resetForm();

setShowModal(true);

}}

>

+ Add Item

</button>


</div>





<input

className="form-control mb-3"

placeholder="Search Item..."

value={search}

onChange={(e)=>setSearch(e.target.value)}

/>







<table className="table table-bordered table-hover">



<thead className="table-dark">


<tr>

<th>ID</th>

<th>Item Name</th>

<th>Quantity</th>

<th>Supplier</th>

<th>Price</th>

<th>Actions</th>


</tr>


</thead>






<tbody>


{

filteredItems.length===0 ?


<tr>

<td colSpan="6" className="text-center">

No Items Found

</td>

</tr>



:


filteredItems.map((item)=>(


<tr key={item.item_id}>


<td>

{item.item_id}

</td>



<td>

{item.item_name}

</td>



<td>

{item.quantity}

</td>



<td>

{item.supplier}

</td>



<td>

₹ {Number(item.price).toFixed(2)}

</td>




<td>


<button

className="btn btn-warning btn-sm me-2"

onClick={()=>editItem(item)}

>

Edit

</button>




<button

className="btn btn-danger btn-sm"

onClick={()=>deleteItem(item.item_id)}

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

?

"Add Item"

:

"Edit Item"

}

</h5>



<button

className="btn-close"

onClick={()=>{

setShowModal(false);

resetForm();

}}

>

</button>


</div>





<div className="modal-body">



<input

className="form-control mb-3"

placeholder="Item Name"

name="item_name"

value={formData.item_name}

onChange={handleChange}

/>




<input

type="number"

className="form-control mb-3"

placeholder="Quantity"

name="quantity"

value={formData.quantity}

onChange={handleChange}

/>





<input

className="form-control mb-3"

placeholder="Supplier"

name="supplier"

value={formData.supplier}

onChange={handleChange}

/>





<input

type="number"

step="0.01"

className="form-control"

placeholder="Price"

name="price"

value={formData.price}

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

onClick={saveItem}

>

{

editingId===null

?

"Add Item"

:

"Update Item"

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


export default Inventory;