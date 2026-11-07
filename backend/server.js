require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

// Test MySQL connection
db.getConnection((err, connection) => {
    if (err) {
        console.error("Database connection failed:", err.message);
        return;
    }

    console.log("Connected to GardenLens MySQL database!");

    connection.release();
});

// Test API endpoint
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to GardenLens API!"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`GardenLens server running on port ${PORT}`);
});