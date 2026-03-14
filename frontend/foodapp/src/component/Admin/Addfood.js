import axiosInstance from '../../api/axiosInstance';
import { useState } from 'react'
import toast from 'react-hot-toast';

function Addfood() {
    let [food, setfood] = useState({
        fid: "",
        fname: "",
        price: ""
    })

    const refreshData = () => {
        setfood({
            fid: "",
            fname: "",
            price: ""
        })
    }

    const addData = () => {
        const loadingToast = toast.loading("Adding food item...");
        axiosInstance.post("/food/add", food)
            .then((res) => {
                toast.dismiss(loadingToast);
                toast.success(res.data || "Food added successfully!");
                refreshData();
            })
            .catch((error) => {
                toast.dismiss(loadingToast);
                toast.error("Failed to add food. Please try again.");
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
                </div>
            </div>
        </div>
    )
}

export default Addfood