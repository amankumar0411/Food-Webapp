import axiosInstance from '../../api/axiosInstance';
import { useState } from 'react'

function DeleteFood() {
    let [fid, setfid] = useState("");
    let [msg, setMsg] = useState("");

    const refreshData = () => {
        setMsg("");
        setfid("");
    }

    const deleteData = () => {
        if (!fid) {
            alert("Please enter a Food ID to delete");
            return;
        }
        axiosInstance.delete(`/food/del/${fid}`)
            .then((res) => {

                setMsg(res.data);
                // Optional: Clear the input after successful deletion
                setfid(""); 
            })
            .catch((error) => {

                alert("SOMETHING WENT WRONG WHILE DELETING DATA");
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
            <h2 className='mt-3'>{msg}</h2>
                </div>
            </div>
        </div>
    )
}

export default DeleteFood