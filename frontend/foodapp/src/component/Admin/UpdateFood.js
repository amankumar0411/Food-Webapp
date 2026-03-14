import axiosInstance from '../../api/axiosInstance';
import { useState } from 'react'

function UpdateFood() {
    let [food, setFood] = useState({
        fid: "",
        fname: "",
        price: ""
    })
    let [msg, setMsg] = useState("");

    const refreshData = () => {
        setMsg("");
        setFood({
            fid: "",
            fname: "",
            price: ""
        })
    }

    const updateData = () => {
        axiosInstance.put(`/food/upd/${food.fid}`, food)
            .then((res) => {

                setMsg(res.data);
            })
            .catch((error) => {

                alert("SOMETHING WENT WRONG WHILE UPDATING DATA");
            })
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-5 p-4 shadow-sm rounded" style={{ backgroundColor: 'var(--card-bg)' }}>
            <h2 className="text-success">UPDATE FOOD FORM</h2>
            <input 
                type='text' 
                className='form-control' 
                value={food.fid}
                onChange={(event) => {
                    setFood({ ...food, fid: event.target.value })
                }}
                placeholder='ENTER FOOD ID TO UPDATE' 
            />
            <input 
                type='text' 
                className='form-control' 
                value={food.fname}
                onChange={(event) => {
                    setFood({ ...food, fname: event.target.value })
                }}
                placeholder='ENTER NEW FOOD NAME' 
            />
            <input 
                type='text' 
                className='form-control' 
                value={food.price}
                onChange={(event) => {
                    setFood({ ...food, price: event.target.value })
                }}
                placeholder='ENTER NEW FOOD PRICE' 
            />
            
            <button className='btn btn-outline-success' onClick={updateData}>UPDATE</button> &nbsp;&nbsp;
            <button className='btn btn-outline-secondary' onClick={refreshData}>REFRESH</button>
            
            <h2 className="mt-3">{msg}</h2>
                </div>
            </div>
        </div>
    )
}

export default UpdateFood