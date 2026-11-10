require("dotenv").config();

const express = require("express");
const cors = require("cors");
const supabase = require("./config/supabase");

const app = express();

app.use(cors());
app.use(express.json());

// Test Supabase connection
app.get("/", async (req, res) => {
    const { data, error } = await supabase
        .from("users")
        .select("user_id")
        .limit(1);

    if (error) {
        console.error("Supabase connection failed:", error.message);

        return res.status(500).json({
            message: "Supabase connection failed",
            error: error.message
        });
    }

    res.json({
        message: "Welcome to GardenLens API!",
        database: "Supabase connected successfully"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`GardenLens server running on port ${PORT}`);
});