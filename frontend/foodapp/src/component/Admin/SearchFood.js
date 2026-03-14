import React from 'react'
import axios from 'axios'
import { useState } from 'react'

function SearchFood() {
    // foodId for the input, searchResult to store the object returned from DB
    let [foodId, setFoodId] = useState("");
    let [searchResult, setSearchResult] = useState(null);
    let [msg, setMsg] = useState("");

    const refreshData = () => {
        setFoodId("");
        setSearchResult(null);
        setMsg("");
    }

    const searchData = () => {
        if (!foodId) {
            alert("Please enter a Food ID to search");
            return;
        }

        // Using axios.get to fetch data by ID
        axios.get(`https://foodapp-api1.onrender.com/food/fetch/${foodId}`)
            .then((res) => {
                if (res.data) {
                    setSearchResult(res.data);
                    setMsg("Food Found!");
                } else {
                    setMsg("No food found with this ID");
                    setSearchResult(null);
                }
            })
            .catch((error) => {

                setMsg("Error occurred while searching");
                setSearchResult(null);
            })
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-5 p-4 shadow-sm rounded" style={{ backgroundColor: 'var(--card-bg)' }}>
            <h2 className='text-info mb-4'>SEARCH FOOD</h2>
            <div className="input-group mb-3">
                <input
                    type='text'
                    className='form-control'
                    value={foodId}
                    onChange={(event) => setFoodId(event.target.value)}
                    placeholder='ENTER FOOD ID'
                />
                <button className='btn btn-info' onClick={searchData}>SEARCH</button>
            </div>
            
            <button className='btn btn-outline-secondary' onClick={refreshData}>REFRESH</button>

            <hr />

            {/* Displaying the result only if data exists */}
            {searchResult && (
                <div className="card p-3 mt-3 shadow-sm">
                    <h4>Results:</h4>
                    <p><strong>ID:</strong> {searchResult.fid}</p>
                    <p><strong>Name:</strong> {searchResult.fname}</p>
                    <p><strong>Price:</strong> {searchResult.price}</p>
                </div>
            )}

            <h2 className="mt-3 text-secondary">{msg}</h2>
                </div>
            </div>
        </div>
    )
}

export default SearchFood