const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connection = require('./db');
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/adminRoutes");
const StudentRoutes = require("./routes/StudentRoutes");
const cookie = require("cookie-parser");

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:3000",  
  credentials: true               
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookie());
app.use("/api/auth", authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', StudentRoutes);

// connection DB
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
  } else {
    console.log('Connected to the database.');
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
