
import {
    BrowserRouter,
    Routes,
    Route,
    Link,
    Navigate
} from "react-router-dom";

import {
    AuthProvider,
    useAuth
} from "./context/AuthContext";

import Home from "./pages/Home";
import Camera from "./pages/Camera";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ApplicationSubmitted from "./pages/ApplicationSubmitted";

function ComingSoon({ title }) {

    return (
        <main style={{
            padding: "30px",
            textAlign: "center"
        }}>

            <h1>{title}</h1>

            <p style={{ margin: "20px 0" }}>
                This feature is coming soon.
            </p>

            <Link to="/">Back to Homepage</Link>

        </main>
    );
}

function ProtectedRoute({ children }) {

    const { user, profile, loading } = useAuth();

    if (loading || (user && !profile)) {
        return <p>Loading...</p>;
    }

    if (!user || profile?.account_status !== "active") {
        return <Navigate to="/login" replace />;
    }

    return children;
}

function App() {

    return (
        <BrowserRouter>

            <AuthProvider>

                <Routes>

                    {/* Public pages */}

                    <Route path="/" element={<Home />} />

                    <Route
                        path="/camera"
                        element={<Camera />}
                    />

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/register"
                        element={<Register />}
                    />

                    <Route
                        path="/application-submitted"
                        element={<ApplicationSubmitted />}
                    />

                    <Route
                        path="/feedback"
                        element={
                            <ComingSoon title="Feedback Form" />
                        }
                    />

                    <Route
                        path="/trails"
                        element={
                            <ComingSoon title="Trail Games" />
                        }
                    />

                    {/* Login required pages */}

                    <Route
                        path="/favourites"
                        element={
                            <ProtectedRoute>
                                <ComingSoon title="Favourites" />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/history"
                        element={
                            <ProtectedRoute>
                                <ComingSoon
                                    title="Recognition History"
                                />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/account"
                        element={
                            <ProtectedRoute>
                                <ComingSoon
                                    title="Account Details"
                                />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="*"
                        element={<Navigate to="/" replace />}
                    />

                </Routes>

            </AuthProvider>

        </BrowserRouter>
    );
}

export default App;
