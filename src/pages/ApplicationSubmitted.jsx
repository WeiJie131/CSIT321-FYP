
import { Link } from "react-router-dom";
import { CircleCheck } from "lucide-react";

import "../styles/Auth.css";

function ApplicationSubmitted() {

    return (
        <div className="auth-page application-page">

            <main className="application-content">

                <CircleCheck
                    size={55}
                    className="application-icon"
                />

                <h1>
                    Thank You for Your Application!
                </h1>

                <p>
                    Your Plant Enthusiast application has
                    been successfully submitted.
                </p>

                <p>
                    Your account is currently pending review
                    by a User Admin.
                </p>

                <p>
                    Please note that you will only
                    be able to log in after your application
                    has been approved.
                </p>

                <Link
                    to="/login"
                    className="auth-submit application-button"
                >
                    Back to Login
                </Link>

            </main>

        </div>
    );
}

export default ApplicationSubmitted;
