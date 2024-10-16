// components/admin/AuditLogs.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AuditLogs = () => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const fetchLogs = async () => {
            const res = await axios.get('http://localhost:5000/api/admin/audit-logs');
            setLogs(res.data);
        };
        fetchLogs();
    }, []);

    return (
        <div>
            <h2>Audit Logs</h2>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>User</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map(log => (
                        <tr key={log.id}>
                            <td>{new Date(log.timestamp).toLocaleString()}</td>
                            <td>{log.user}</td>
                            <td>{log.action}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AuditLogs;
