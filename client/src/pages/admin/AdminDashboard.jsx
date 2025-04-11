import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import AdminNavbar from "./components/AdminNavbar";

const AdminDashboard = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [salesData, setSalesData] = useState([]);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  useEffect(() => {
    fetchSalesData(selectedYear);
  }, [selectedYear]);

  const fetchSalesData = async (year) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/orders/sales/${year}`);
      const dataWithAllMonths = months.map((month, index) => {
        const record = res.data.find((r) => r.month === index + 1);
        return {
          month,
          sales: record ? record.totalSales : 0,
        };
      });
      setSalesData(dataWithAllMonths);
    } catch (err) {
      console.error("Failed to fetch sales data:", err);
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Sales Overview</h2>

        <div className="mb-4">
          <label htmlFor="yearSelect" className="font-semibold mr-2">Select Year:</label>
          <select
            id="yearSelect"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="border px-2 py-1 rounded"
          >
            {[currentYear, currentYear - 1, currentYear - 2].map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#f87171" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
