import React, { useState, useEffect } from 'react';
import axiosInstance from './axiosInstance';
import DashboardSectionWrapper from './dashbordwrapper';

const PayBill = () => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        
        const fetchBills = async () => {
            try {
                const response = await axiosInstance.get('/bills');
                setBills(response.data);
            } catch (error) {
                console.error("Error fetching bills", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBills();
    }, []);

    const handlePay = async (billId) => {
        try {
            await axiosInstance.post(`/bills/${billId}/pay`);
            setMessage(`Bill ${billId} paid successfully!`);
            // Optionally refresh bill list
        } catch (error) {
            console.error("Payment failed", error);
            setMessage(`Payment for bill ${billId} failed.`);
        }
    };

    return (
        <DashboardSectionWrapper>
            <div>
                <h2 className="text-xl font-bold mb-4">Bills</h2>
                {loading ? (
                    <p>Loading bills...</p>
                ) : (
                    <>
                        {message && <p className="mb-2 text-green-600">{message}</p>}
                        {bills.length === 0 ? (
                            <p>No bills available.</p>
                        ) : (
                            <ul className="space-y-2">
                                {bills.map(bill => (
                                    <li key={bill.id} className="border p-3 rounded flex justify-between items-center">
                                        <div>
                                            <p><strong>{bill.name}</strong></p>
                                            <p>Amount: ${bill.amount}</p>
                                            <p>Due: {bill.dueDate}</p>
                                        </div>
                                        <button
                                            onClick={() => handlePay(bill.id)}
                                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                        >
                                            Pay
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </>
                )}
            </div>
        </DashboardSectionWrapper>
    );
};

export default PayBill;
