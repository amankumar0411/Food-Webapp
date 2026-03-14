import React, { useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import toast from 'react-hot-toast';

function DeleteFood() {
    let [fid, setfid] = useState("");

    const refreshData = () => {
        setfid("");
    }

    const deleteData = () => {
        if (!fid) {
            toast.error("Please enter a Food ID to delete");
            return;
        }
        const loadingToast = toast.loading("Deleting food item...");
        axiosInstance.delete(`/food/del/${fid}`)
            .then((res) => {
                toast.dismiss(loadingToast);
                toast.success(res.data || "Food deleted successfully!");
                refreshData(); 
            })
            .catch((error) => {
                toast.dismiss(loadingToast);
                toast.error("Failed to delete food. Please try again.");
            })
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-5 p-4 shadow-sm rounded" style={{ backgroundColor: 'var(--card-bg)' }}>
            <h2 className='text-danger'>DELETE FOOD FORM</h2>
            <input
                type='text'
                className='form-control'
                value={fid}
                onChange={(event) => {
                    setfid(event.target.value)
                }}
                placeholder='ENTER THE FOOD ID TO DELETE'
            />
            <br />
            <button className='btn btn-outline-danger' onClick={deleteData}>
                DELETE
            </button> 
            &nbsp;&nbsp;
            <button className='btn btn-outline-secondary' onClick={refreshData}>
                REFRESH
            </button>
                </div>
            </div>
        </div>
    )
}

export default DeleteFood