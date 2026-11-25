
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, FileUp } from "lucide-react";

import "../styles/Auth.css";

const API_URL = import.meta.env.VITE_API_URL.replace(/\/+$/, "");

const initialForm = {
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    country: "",
    residentStatus: "",
    plantEnthusiast: "no",
    portfolio: ""
};

function Register() {

    const navigate = useNavigate();

    const [form, setForm] = useState(initialForm);
    const [credential, setCredential] = useState(null);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    function handleChange(event) {

        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));

        if (name === "plantEnthusiast" && value === "no") {

            setCredential(null);

            setForm((previous) => ({
                ...previous,
                portfolio: ""
            }));
        }
    }

    function handleFileChange(event) {

        const file = event.target.files?.[0];

        setError("");

        if (!file) return;

        const allowedTypes = [
            "application/pdf",
            "image/jpeg",
            "image/png"
        ];

        if (!allowedTypes.includes(file.type)) {
            setError("Only PDF, JPG and PNG files are allowed.");
            setCredential(null);
            event.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("File size must not exceed 5 MB.");
            setCredential(null);
            event.target.value = "";
            return;
        }

        setCredential(file);
    }

    async function handleSubmit(event) {

        event.preventDefault();

        setError("");
        setSuccess("");

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (form.password.length < 8) {
            setError(
                "Password must contain at least 8 characters."
            );
            return;
        }

        if (
            form.plantEnthusiast === "yes" &&
            (!credential || !form.portfolio.trim())
        ) {
            setError(
                "Please upload your credentials and enter your portfolio."
            );
            return;
        }

        setLoading(true);

        try {

            const formData = new FormData();

            Object.entries(form).forEach(([key, value]) => {

                if (key !== "confirmPassword") {
                    formData.append(key, value);
                }
            });

            if (
                form.plantEnthusiast === "yes" &&
                credential
            ) {
                formData.append("credential", credential);
            }

            const response = await fetch(
                `${API_URL}/api/auth/register`,
                {
                    method: "POST",
                    body: formData
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            if (data.requiresApproval) {

                navigate("/application-submitted", {
                    replace: true
                });

            } else {

                setSuccess(
                    "Account created successfully! Please check your email to verify your account before logging in."
                );

                setForm(initialForm);
                setCredential(null);
            }

        } catch (err) {

            setError(
                err.message === "Failed to fetch"
                    ? "Unable to connect to the GardenLens server. Please try again later."
                    : err.message
            );

        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page register-page">

            <header className="register-header">
                <h1>New Account</h1>
            </header>

            <main className="auth-content">

                <Link to="/login" className="auth-back">
                    <ArrowLeft size={17} />
                    Back
                </Link>

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >

                    <div className="auth-field">
                        <label htmlFor="register-email">
                            Email
                        </label>

                        <input
                            id="register-email"
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label htmlFor="register-password">
                            Password
                        </label>

                        <input
                            id="register-password"
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            autoComplete="new-password"
                            minLength={8}
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label htmlFor="confirm-password">
                            Confirm Password
                        </label>

                        <input
                            id="confirm-password"
                            type="password"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            autoComplete="new-password"
                            required
                        />
                    </div>

                    <hr className="auth-divider" />

                    <h2 className="auth-section-title">
                        Personal Particulars
                    </h2>

                    <div className="auth-field">
                        <label htmlFor="full-name">
                            Name
                        </label>

                        <input
                            id="full-name"
                            type="text"
                            name="fullName"
                            value={form.fullName}
                            onChange={handleChange}
                            autoComplete="name"
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label htmlFor="country">
                            Country
                        </label>

                        <select
                            id="country"
                            name="country"
                            value={form.country}
                            onChange={handleChange}
                            required
                        >
                            <option value="">
                                Select Country
                            </option>

                            {[
                                "Singapore",
                                "Australia",
                                "Brunei",
                                "Cambodia",
                                "Canada",
                                "China",
                                "France",
                                "Germany",
                                "India",
                                "Indonesia",
                                "Japan",
                                "Laos",
                                "Malaysia",
                                "Myanmar",
                                "New Zealand",
                                "Philippines",
                                "South Korea",
                                "Thailand",
                                "United Kingdom",
                                "United States",
                                "Vietnam",
                                "Other"
                            ].map((country) => (
                                <option
                                    key={country}
                                    value={country}
                                >
                                    {country}
                                </option>
                            ))}
                        </select>
                    </div>

                    <fieldset className="auth-radio-field">

                        <legend>Resident Status</legend>

                        <div className="radio-options">

                            <label>
                                <input
                                    type="radio"
                                    name="residentStatus"
                                    value="local"
                                    checked={
                                        form.residentStatus === "local"
                                    }
                                    onChange={handleChange}
                                    required
                                />
                                Local
                            </label>

                            <label>
                                <input
                                    type="radio"
                                    name="residentStatus"
                                    value="tourist"
                                    checked={
                                        form.residentStatus === "tourist"
                                    }
                                    onChange={handleChange}
                                    required
                                />
                                Tourist
                            </label>

                        </div>

                    </fieldset>

                    <fieldset className="auth-radio-field">

                        <legend>Plant Enthusiast?</legend>

                        <div className="radio-options">

                            <label>
                                <input
                                    type="radio"
                                    name="plantEnthusiast"
                                    value="yes"
                                    checked={
                                        form.plantEnthusiast === "yes"
                                    }
                                    onChange={handleChange}
                                />
                                Yes
                            </label>

                            <label>
                                <input
                                    type="radio"
                                    name="plantEnthusiast"
                                    value="no"
                                    checked={
                                        form.plantEnthusiast === "no"
                                    }
                                    onChange={handleChange}
                                />
                                No
                            </label>

                        </div>

                    </fieldset>

                    {form.plantEnthusiast === "yes" && (

                        <section className="enthusiast-section">

                            <h2 className="auth-section-title">
                                Upload Credentials
                            </h2>

                            <label className="credential-upload">

                                <FileUp size={35} />

                                <span>
                                    {credential
                                        ? credential.name
                                        : "Upload File"
                                    }
                                </span>

                                <small>
                                    File Size (Max 10 MB)
                                </small>

                                <input
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={handleFileChange}
                                    required={!credential}
                                />

                            </label>

                            {credential && (
                                <button
                                    type="button"
                                    className="remove-file"
                                    onClick={() =>
                                        setCredential(null)
                                    }
                                >
                                    Remove File
                                </button>
                            )}

                            <div className="auth-field">

                                <label htmlFor="portfolio">
                                    Portfolio
                                </label>

                                <textarea
                                    id="portfolio"
                                    name="portfolio"
                                    rows={5}
                                    placeholder="Tell us about your plant knowledge, experience, qualifications and portfolio links..."
                                    value={form.portfolio}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            <p className="approval-notice">
                                Your Plant Enthusiast application
                                requires User Admin approval before
                                you can log in.
                            </p>

                        </section>
                    )}

                    {error && (
                        <p className="auth-error" role="alert">
                            {error}
                        </p>
                    )}

                    {success && (
                        <div className="auth-success">
                            <p>{success}</p>

                            <Link to="/login">
                                Proceed to Login
                            </Link>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="auth-submit"
                        disabled={loading || Boolean(success)}
                    >
                        {loading ? "Submitting..." : "Submit"}
                    </button>

                </form>

            </main>

        </div>
    );
}

export default Register;
