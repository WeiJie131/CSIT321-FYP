require("dotenv").config();

const express = require("express");
const cors = require("cors");
const supabase = require("./config/supabase");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors({
    origin: [
        "http://localhost:5173",
        process.env.FRONTEND_URL
    ].filter(Boolean)
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