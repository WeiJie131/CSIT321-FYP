require("dotenv").config();

const express = require("express");
const cors = require("cors");
const supabase = require("./config/supabase");
const authRoutes = require("./routes/authRoutes");

const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    process.env.FRONTEND_URL?.replace(/\/+$/, "")
].filter(Boolean);

const isDevelopment = process.env.NODE_ENV !== "production";

app.use(cors({
    origin: (origin, callback) => {

        // Allow direct API requests
        if (!origin) {
            return callback(null, true);
        }

        // Allow configured frontend URLs
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        // Allow local Wi-Fi development
        if (
            isDevelopment &&
            /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}:5173$/.test(origin)
        ) {
            return callback(null, true);
        }

        // Block unrecognised origins
        return callback(new Error("Not allowed by CORS"));
    }
}));

app.use(express.json());

// Authentication routes
app.use("/api/auth", authRoutes);

// Test Supabase connection
app.get("/", async (req, res) => {
    try {
        const { error } = await supabase
            .from("profiles")
            .select("id")
            .limit(1);

        if (error) {
            throw error;
        }

        res.json({
            message: "GardenLens API is running",
            database: "Supabase connected successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Supabase connection failed",
            error: error.message
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`GardenLens server running on port ${PORT}`);
});