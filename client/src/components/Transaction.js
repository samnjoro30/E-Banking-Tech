import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
//import { isAuthenticated } from '../utils/auth';
import DashboardSectionWrapper from './dashbordwrapper';
import '../styles/transaction.css';

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
        `/trans/transactions?page=${page}&limit=10`
        // isAuthenticated()
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
    fetchTransactions(1);
  }, []);

  const handlePageChange = newPage => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchTransactions(newPage);
    }
  };

  return (
    <DashboardSectionWrapper>
      <div className="transaction-container">
        <h2 className="transaction-title">Transaction History</h2>

        {error && <p className="transaction-error">{error}</p>}

        <div className="transaction-balance">
          <strong>Balance:</strong> Ksh {balance.toFixed(2)}
        </div>

        {loading ? (
          <p className="loading-text">Loading transactions...</p>
        ) : (
          <div className="table-wrapper">
            <table className="transaction-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Recipient</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="no-data">
                      No transactions found.
                    </td>
                  </tr>
                ) : (
                  transactions.map((txn, index) => (
                    <tr key={index}>
                      <td>{new Date(txn.date).toLocaleDateString()}</td>
                      <td>{txn.type}</td>
                      <td>${txn.amount.toFixed(2)}</td>
                      <td>{txn.recipientName}</td>
                      <td>{txn.description}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </DashboardSectionWrapper>
  );
};

export default Transaction;
