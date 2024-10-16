//BarChart.js
import React from 'react';
import { Bar } from 'react-chartjs-2';

const BarChart = ({ data, options }) => {
    return <Bar data={data} options={options} />;
};

export default BarChart;
