import React, { useEffect, useState } from 'react';
import axiosInstance from './axiosInstance'; // Ensure this is correctly set up
import { getToken, isAuthenticated } from '../utils/auth'; // Auth header function

const Transaction = () => {
  const [error, setError] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchTransactions = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/transaction/transactions?page=${page}&limit=10`,
        isAuthenticated()
      );
      setTransactions(res.data.transactions);
      setBalance(res.data.balance);
      setCurrentPage(res.data.currentPage);
      setTotalPages(res.data.totalPages);
      setError('');
    } catch (err) {
      setError('Failed to fetch transactions. Please log in again.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchTransactions(newPage);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Transaction History</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="mb-4">
        <strong>Balance:</strong> ${balance.toFixed(2)}
      </div>

      {loading ? (
        <p>Loading transactions...</p>
      ) : (
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Date</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Recipient</th>
              <th className="border p-2">Description</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-4">
                  No transactions found.
                </td>
              </tr>
            ) : (
              transactions.map((txn, index) => (
                <tr key={index}>
                  <td className="border p-2">{new Date(txn.date).toLocaleDateString()}</td>
                  <td className="border p-2">{txn.type}</td>
                  <td className="border p-2">${txn.amount.toFixed(2)}</td>
                  <td className="border p-2">{txn.recipientName}</td>
                  <td className="border p-2">{txn.description}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Transaction;
