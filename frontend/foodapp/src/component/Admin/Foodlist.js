import React, { useEffect } from 'react'
import axios from 'axios'
import { useState } from 'react'
function Foodlist({ searchQuery }) {
       let[food,setFood]=useState([]);
    useEffect(()=>{ 
           axios.get("https://foodapp-api1.onrender.com/food/fetch")
        .then((res)=>{ 

            setFood(res.data);
           
        })
        .catch((error)=>{ 

        })
    },[])

    const filteredFood = food.filter(item => {
        const itemName = item?.fname?.toLowerCase() || "";
        const query = searchQuery?.toLowerCase() || "";
        return itemName.includes(query);
    });

  return (
    <div>
      { 
        filteredFood.length>0 ? 
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-12 col-lg-8">
                    <div className="table-responsive shadow-sm">
                        <table className='table table-hover mb-0'>
           <thead className='table-light'>
            <tr>
                <th>FOOD ID</th>
                <th>FOOD NAME</th>
                <th>PRICE</th>
                
            </tr>
           </thead>
           <tbody>
            {
                filteredFood.map((element,index)=>{ 
                    return(
                        <tr>
                            
                             <td>{element.fid }</td>
                            <td>{element.fname }</td>
                              <td>{element.price }</td>
                        </tr>
                    )
                })
            }
           </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        :<h2 style={{color:"red", textAlign:"center", marginTop:"50px"} }>NO FOOD Available </h2>
      }
    </div>
  )
}

export default Foodlist