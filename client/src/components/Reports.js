// components/admin/Reports.js
import React, { useState } from 'react';
import axios from 'axios';

const Reports = () => {
    const [reportType, setReportType] = useState('transactions');
    const [reportData, setReportData] = useState([]);

    const fetchReport = async () => {
        const res = await axios.get(`http://localhost:5000/api/admin/reports?type=${reportType}`);
        setReportData(res.data);
    };

    return (
        <div>
            <h2>Reports</h2>
            <select onChange={(e) => setReportType(e.target.value)}>
                <option value="transactions">Transaction Report</option>
                <option value="user-activity">User Activity Report</option>
            </select>
            <button onClick={fetchReport}>Generate Report</button>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Data</th>
                    </tr>
                </thead>
                <tbody>
                    {reportData.map((data, index) => (
                        <tr key={index}>
                            <td>{data.id}</td>
                            <td>{JSON.stringify(data)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Reports;
