// pages/admin.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserManagement from '../components/UserManagement';
import AuditLogs from '../components/AuditLogs';
import Reports from '../components/Reports';
import '../styles/Admin.css';
//import BarChart from '../components/BarChart';
//import LineChart from '../components/LineChart';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('user-management');
    const [transactionData, setTransactionData] = useState(null);

    useEffect(() => {
        const fetchTransactionData = async () => {
            const res = await axios.get('http://localhost:5000/api/reports/transactions-data');
            const chartData = {
                labels: res.data.map(item => `${item._id.month}/${item._id.year}`),
                datasets: [
                    {
                        label: 'Total Transactions',
                        data: res.data.map(item => item.total),
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    },
                ],
            };
            setTransactionData(chartData);
        };

        fetchTransactionData();
    }, []);

    return (
        <div className="admin-dashboard">
            <nav>
                <button onClick={() => setActiveTab('user-management')}>User Management</button>
                <button onClick={() => setActiveTab('audit-logs')}>Audit Logs</button>
                <button onClick={() => setActiveTab('reports')}>Reports</button>
            </nav>
            <div className="admin-content">
                {activeTab === 'user-management' && <UserManagement />}
                {activeTab === 'audit-logs' && <AuditLogs />}
                {activeTab === 'reports' && <Reports />}
            </div>
          {/* <h1>Analysis Dashboard</h1>
            <h2>bar chart</h2>
            <div className="chart-container">
                <h2>Transaction Overview</h2>
                {transactionData && <BarChart data={transactionData} options={{ responsive: true }} />}
            </div>
            <h2>line Graph</h2>
            <div>
            {transactionData && <LineChart data={transactionData} options={{ responsive: true }} />}
            </div>*/}
        </div>
    );
};

export default AdminDashboard;
