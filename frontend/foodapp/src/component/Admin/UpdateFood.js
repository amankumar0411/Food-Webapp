import axiosInstance from '../../api/axiosInstance';
import { useState } from 'react'
import toast from 'react-hot-toast';

function UpdateFood() {
    let [food, setFood] = useState({
        fid: "",
        fname: "",
        price: ""
    })

    const refreshData = () => {
        setFood({
            fid: "",
            fname: "",
            price: ""
        })
    }

    const updateData = () => {
        if (!food.fid) {
            toast.error("Please enter a Food ID to update");
            return;
        }
        const loadingToast = toast.loading("Updating food item...");
        axiosInstance.put(`/food/upd/${food.fid}`, food)
            .then((res) => {
                toast.dismiss(loadingToast);
                toast.success(res.data || "Food updated successfully!");
                refreshData();
            })
            .catch((error) => {
                toast.dismiss(loadingToast);
                toast.error("Failed to update food. Please try again.");
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
                </div>
            </div>
        </div>
    )
}

export default UpdateFood