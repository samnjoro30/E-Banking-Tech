import React, { useEffect, useState } from 'react';
import axiosInstance from './axiosInstance';


const sidebar = () => {
    const [showTransactions, setShowTransactions]= useState();

    const [transactions, setTransactions] = useState([]);
useEffect(() => {
    const fetchData = async () => {

        const transactionsRes = await axiosInstance.get('/transaction/transactions', getAuthConfig());
        setTransactions(transactionsRes.data);
     }



}, );

}

export default sidebar