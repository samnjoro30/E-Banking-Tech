import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import DashboardSectionWrapper from './dashbordwrapper';

const Balance = () => {
    const [balance, setBalance]  = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const FetchBalance = async () =>{
        try{
            setLoading(true)
            setError(null);
            const res = await axiosInstance.get('/balance');
            setBalance(res.data.balance);
        }catch(error){
            setError(error.response?.data?.message || 'Failed to fetch balance');
            console.error('Error fetching balance:', error);
        }
    }
    useEffect( ()=> {
       FetchBalance()
    }, []);


    return(
        <DashboardSectionWrapper>
        <div>
            <h2>Account Balance</h2>
            {loading ? (
                <p>Loading balance ...</p>
            ) : error ? (
                <div className="error-message">
                    <p>{error}</p>
                    <button onClick={FetchBalance}>Retry</button>
                </div>
            ) : (
                <div className="balance-amount">
                    <p>Your current balance is: ${Number(balance || 0).toFixed(2)}</p>
                    <button onClick={FetchBalance}>Refresh</button>
                </div>
            )}

        </div>
        </DashboardSectionWrapper>
    )
}
export default Balance;