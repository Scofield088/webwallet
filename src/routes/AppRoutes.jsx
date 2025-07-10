import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Wallet from '../components/Wallet.jsx';
import Seed from '../components/Seed.jsx';

const AppRoutes=()=>{
    return(
        <Router>
        <Routes>
            <Route path="/" element={<Wallet/>}/>
            <Route path="/seed" element={<Seed/>}/>
        </Routes>
        </Router>
    );
};
export default AppRoutes;
