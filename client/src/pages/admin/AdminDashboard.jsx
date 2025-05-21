import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "./components/AdminNavbar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const AdminDashboard = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [salesData, setSalesData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [categorySales, setCategorySales] = useState([]);

  useEffect(() => {
    fetchAnalytics(selectedYear);
  }, [selectedYear]);

  const fetchAnalytics = async (year) => {
    try {
      const res = await axios.get(`https://consultancy-yrz7.onrender.com/api/orders/analytics/${year}`);
      const { monthlySales, totalRevenue, totalOrders, categorySales } = res.data;

      const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ];
      const data = months.map((month, index) => ({
        month,
        sales: monthlySales[index] || 0,
      }));

      setSalesData(data);
      setTotalRevenue(totalRevenue);
      setTotalOrders(totalOrders);
      setCategorySales(
        Object.entries(categorySales).map(([category, value]) => ({
          name: category,
          value,
        }))
      );
    } catch (err) {
      console.error("Error fetching analytics:", err);
    }
  };

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a28fd0", "#ff6384"];

  return (
    <>
      <AdminNavbar />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">SRI RAGHAVENDRA STEELS</h2>

        {/* Year Selector */}
        <div className="mb-4">
          <label className="mr-2 font-medium">Select Year:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="border px-2 py-1 rounded"
          >
            {[currentYear, currentYear - 1, currentYear - 2].map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 shadow rounded">
            <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
            <p className="text-2xl font-bold text-green-600">₹{totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 shadow rounded">
            <h3 className="text-lg font-semibold mb-2">Total Orders</h3>
            <p className="text-2xl font-bold text-blue-600">{totalOrders}</p>
          </div>
        </div>

        {/* Monthly Sales Line Chart */}
        <div className="bg-white p-6 shadow rounded">
          <h3 className="text-xl font-bold mb-4">Monthly Sales - {selectedYear}</h3>
          {salesData.length === 0 ? (
            <p>No sales data available</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top-Selling Categories Pie Chart */}
        <div className="bg-white p-6 shadow rounded mt-6">
          <h3 className="text-xl font-bold mb-4">Top-Selling Categories</h3>
          {categorySales.length === 0 ? (
            <p>No category data available</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categorySales}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {categorySales.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;


/*
import React, { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { PieChart, Pie, Cell, Legend } from "recharts";
import AdminNavbar from "./components/AdminNavbar";

const AdminDashboard = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [data, setData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    fetchAnalytics(year);
  }, [year]);

  const fetchAnalytics = async (selectedYear) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/orders/analytics/${selectedYear}`);
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const chartData = res.data.monthlySales.map((sales, idx) => ({
        month: monthNames[idx],
        sales,
      }));
      setData(chartData);
      setTotalRevenue(res.data.totalRevenue);
      setTotalOrders(res.data.totalOrders);
    } catch (err) {
      console.error("Error fetching analytics", err);
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold">Sales Dashboard</h2>
          <select
            className="border rounded px-4 py-2"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            {[2025, 2024, 2023].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="p-4 bg-white shadow rounded text-center">
            <p className="text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold text-green-600">₹{totalRevenue.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-white shadow rounded text-center">
            <p className="text-gray-600">Total Orders</p>
            <p className="text-2xl font-bold">{totalOrders}</p>
          </div>
        </div>

        <div className="bg-white p-6 shadow rounded">
          <h3 className="text-xl font-bold mb-4">Monthly Sales</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
*/

/*
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
*/