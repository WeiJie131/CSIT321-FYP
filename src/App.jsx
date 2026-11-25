import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";

import Home from "./pages/Home";
import Camera from "./pages/Camera";

function ComingSoon({ title }) {
  return (
    <main style={{ padding: "30px", textAlign: "center" }}>
      <h1>{title}</h1>

      <p style={{ margin: "20px 0" }}>
        This feature is coming soon.
      </p>

      <Link to="/">Back to Homepage</Link>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/camera" element={<Camera />} />

        <Route
          path="/login"
          element={<ComingSoon title="Login" />}
        />

        <Route
          path="/register"
          element={<ComingSoon title="Registration" />}
        />

        <Route
          path="/favourites"
          element={<ComingSoon title="Favourites" />}
        />

        <Route
          path="/history"
          element={<ComingSoon title="Recognition History" />}
        />

        <Route
          path="/trails"
          element={<ComingSoon title="Trail Games" />}
        />

        <Route
          path="/account"
          element={<ComingSoon title="Account Details" />}
        />

        <Route
          path="/feedback"
          element={<ComingSoon title="Feedback Form" />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;