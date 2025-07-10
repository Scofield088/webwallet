import React from "react";
import { useNavigate } from "react-router-dom";

const Wallet=()=>{
    const navigate=useNavigate();
    
    const handleRedirect=()=>{
        navigate("/seed");
    };
    return(
        <div>
            <h2>LessGo Create Your Wallet</h2>
            <button onClick={handleRedirect}>Create wallet</button>
        </div>
    );
};
export default Wallet;