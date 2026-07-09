import { useEffect, useState } from "react";
import API from "../api/axios";
import "./Dashboard.css";


function Dashboard() {


  const [counts, setCounts] = useState({

    patients: 0,
    doctors: 0,
    appointments: 0,
    admissions: 0,
    billing: 0,
    laboratory: 0,
    inventory: 0,
    medical_records: 0,
    prescriptions: 0,
    insurance_claims: 0

  });



  useEffect(() => {

    fetchCounts();

  }, []);




  const fetchCounts = async () => {


    try {


      const responses = await Promise.allSettled([


        API.get("/patients/"),

        API.get("/doctors/"),

        API.get("/appointments/"),

        API.get("/admissions/"),

        API.get("/billing/"),

        API.get("/laboratory/"),

        API.get("/inventory/"),

        API.get("/medical_records/"),

        API.get("/prescriptions/"),

        API.get("/insurance_claims/")


      ]);




      const getLength = (response) => {


        if(response.status === "fulfilled") {


          if(Array.isArray(response.value.data)) {

            return response.value.data.length;

          }


        }


        return 0;


      };





      setCounts({


        patients: getLength(responses[0]),


        doctors: getLength(responses[1]),


        appointments: getLength(responses[2]),


        admissions: getLength(responses[3]),


        billing: getLength(responses[4]),


        laboratory: getLength(responses[5]),


        inventory: getLength(responses[6]),


        medical_records: getLength(responses[7]),


        prescriptions: getLength(responses[8]),


        insurance_claims: getLength(responses[9])


      });




    }

    catch(error){


      console.log("Dashboard Error:",error);


    }


  };






  const cards = [


    {
      title:"Patients",
      count:counts.patients,
      icon:"🧑‍⚕️"
    },


    {
      title:"Doctors",
      count:counts.doctors,
      icon:"👨‍⚕️"
    },


    {
      title:"Appointments",
      count:counts.appointments,
      icon:"📅"
    },


    {
      title:"Admissions",
      count:counts.admissions,
      icon:"🏥"
    },


    {
      title:"Billing",
      count:counts.billing,
      icon:"💰"
    },


    {
      title:"Laboratory",
      count:counts.laboratory,
      icon:"🧪"
    },


    {
      title:"Inventory",
      count:counts.inventory,
      icon:"💊"
    },


    {
      title:"Medical Records",
      count:counts.medical_records,
      icon:"📄"
    },


    {
      title:"Prescriptions",
      count:counts.prescriptions,
      icon:"💉"
    },


    {
      title:"Insurance Claims",
      count:counts.insurance_claims,
      icon:"📑"
    }


  ];






  return (


    <div className="dashboard">


      <h1>
        Hospital Dashboard
      </h1>



      <div className="cards">


      {
        cards.map((card,index)=>(


          <div className="card" key={index}>


            <div className="icon">

              {card.icon}

            </div>



            <div>


              <h2>
                {card.title}
              </h2>



              <p>
                {card.count}
              </p>


            </div>



          </div>



        ))
      }



      </div>



    </div>


  );


}


export default Dashboard;