import React, {useEffect, useState} from 'react';

const Transaction = () =>{
    const [error, setError] = useState('');
    const [ transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const transactionsRes = await axiosInstance.get('/transaction/transactions', getAuthConfig());
                setTransactions(transactionsRes.data);
            } catch (error) {
                setShowError('Failed to fetch user data. Please log in again.');
            }
        };
        fetchData();
    }, []);

    return (
        <div>

        </div>
    )

};

export default Transaction;