import axiosInstance from '../../api/axiosInstance';
import { useState } from 'react'

function Addfood() {
    let [food, setfood] = useState({
        fid: "",
        fname: "",
        price: ""
    })
    let [msg, setMsg] = useState("");

    const refreshData = () => {
        setMsg("");
        setfood({
            fid: "",
            fname: "",
            price: ""
        })
    }

    const addData = () => {
        axiosInstance.post("/food/add", food)
            .then((res) => {

                setMsg(res.data);
            })
            .catch((error) => {

                alert("SOMETHING WENT WRONG FOR STORING DATA");
            })
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-5 p-4 shadow-sm rounded" style={{ backgroundColor: 'var(--card-bg)' }}>
            <h2 className='text-primary'>ADD FOOD FORM</h2>
            <input 
                type='text' 
                className='form-control' 
                value={food.fid}
                onChange={(event) => {
                    setfood({
                        ...food,
                        fid: event.target.value
                    })
                }}
                placeholder='ENTER THE FOOD ID' 
            />
            <input 
                type='text' 
                className='form-control' 
                value={food.fname}
                onChange={(event) => {
                    setfood({
                        ...food,
                        fname: event.target.value
                    })
                }}
                placeholder='ENTER THE FOOD NAME' 
            />
            <input 
                type='text' 
                className='form-control' 
                value={food.price}
                onChange={(event) => {
                    setfood({
                        ...food,
                        price: event.target.value
                    })
                }}
                placeholder='ENTER THE FOOD PRICE' 
            />
            
            <button className='btn btn-outline-primary' onClick={addData}>ADD</button> 
            &nbsp;&nbsp;
            <button className='btn btn-outline-secondary' onClick={refreshData}>REFRESH</button>
            
            <h2>{msg}</h2>
                </div>
            </div>
        </div>
    )
}

export default Addfood