const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const AdminRoutes = require("./routes/AdminRoutes");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://elankumaran2103:VR5m34MyuhrNeQgE@cluster0.ntysgc3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("MongoDB connected"));

app.use("/admin", AdminRoutes);
app.use("/api/cart", require("./routes/CartRoutes"));
app.use("/api/orders", require("./routes/OrderRoutes"));
app.listen(5000, () => console.log("Server running on http://localhost:5000"));
