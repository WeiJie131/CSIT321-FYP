
const express = require("express");
const multer = require("multer");
const crypto = require("crypto");
const { createClient } = require("@supabase/supabase-js");

const supabase = require("../config/supabase");

const router = express.Router();

const allowedTypes = {
    "application/pdf": "pdf",
    "image/jpeg": "jpg",
    "image/png": "png"
};

const upload = multer({
    storage: multer.memoryStorage(),

    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 1
    },

    fileFilter: (req, file, callback) => {
        if (allowedTypes[file.mimetype]) {
            callback(null, true);
        } else {
            callback(
                new Error("Only PDF, JPG and PNG files are allowed.")
            );
        }
    }
});

router.post(
    "/register",
    upload.single("credential"),
    async (req, res) => {

        let credentialPath = null;
        let createdUserId = null;

        try {
            const {
                email,
                password,
                fullName,
                country,
                residentStatus,
                plantEnthusiast,
                portfolio
            } = req.body;

            const isEnthusiast = plantEnthusiast === "yes";

            // Validate required fields
            if (
                !email ||
                !password ||
                !fullName?.trim() ||
                !country?.trim() ||
                !residentStatus
            ) {
                return res.status(400).json({
                    message: "Please complete all required fields."
                });
            }

            if (password.length < 8) {
                return res.status(400).json({
                    message: "Password must contain at least 8 characters."
                });
            }

            if (!["local", "tourist"].includes(residentStatus)) {
                return res.status(400).json({
                    message: "Invalid resident status."
                });
            }

            if (!["yes", "no"].includes(plantEnthusiast)) {
                return res.status(400).json({
                    message: "Please select your plant enthusiast status."
                });
            }

            if (isEnthusiast && (!req.file || !portfolio?.trim())) {
                return res.status(400).json({
                    message: "Please upload your credentials and enter your portfolio."
                });
            }

            // Upload enthusiast credential to private storage
            if (isEnthusiast) {
                const extension = allowedTypes[req.file.mimetype];

                credentialPath =
                    `applications/${crypto.randomUUID()}.${extension}`;

                const { error: uploadError } = await supabase.storage
                    .from("enthusiast-credentials")
                    .upload(credentialPath, req.file.buffer, {
                        contentType: req.file.mimetype,
                        upsert: false
                    });

                if (uploadError) throw uploadError;
            }

            // Use a separate public Auth client for signup
            const authClient = createClient(
                process.env.SUPABASE_URL,
                process.env.SUPABASE_ANON_KEY,
                {
                    auth: {
                        persistSession: false,
                        autoRefreshToken: false
                    }
                }
            );

            // Register account with Supabase Auth
            const { data, error } = await supabase.auth.admin.createUser({
                email: email.trim(),
                password,
                email_confirm: true,
                user_metadata: {
                    full_name: fullName.trim(),
                    country: country.trim(),
                    resident_status: residentStatus,
                    plant_enthusiast: isEnthusiast
                }
            });

            if (error) throw error;

            if (
                !data?.user
            ) {
                if (credentialPath) {
                    await supabase.storage
                        .from("enthusiast-credentials")
                        .remove([credentialPath]);
                }

                return res.status(400).json({
                    message: "Unable to register. If you already have an account, please log in."
                });
            }

            createdUserId = data.user.id;

            // Save enthusiast application
            if (isEnthusiast) {
                const { error: applicationError } = await supabase
                    .from("enthusiast_applications")
                    .insert({
                        user_id: createdUserId,
                        portfolio: portfolio.trim(),
                        credential_path: credentialPath,
                        application_status: "pending"
                    });

                if (applicationError) {
                    throw applicationError;
                }
            }

            return res.status(201).json({
                message: isEnthusiast
                    ? "Your application has been submitted successfully and is pending User Admin approval."
                    : "Registration successful! You can now log in.",
                requiresApproval: isEnthusiast
            });

        } catch (error) {

            // Clean up if registration fails partway
            if (createdUserId) {
                await supabase.auth.admin.deleteUser(createdUserId);
            }

            if (credentialPath) {
                await supabase.storage
                    .from("enthusiast-credentials")
                    .remove([credentialPath]);
            }

            console.error("Registration failed:", error.message);

            return res.status(400).json({
                message: "Registration failed. Please check your details and try again."
            });
        }
    }
);

// Handle file upload errors
router.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        return res.status(400).json({
            message: "Invalid upload. Maximum file size is 5 MB."
        });
    }

    return res.status(400).json({
        message: error.message || "Unable to upload file."
    });
});

module.exports = router;
