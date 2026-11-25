import { useState } from "react";
import { Leaf } from "lucide-react";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import BottomNavbar from "../components/BottomNavbar";

import "../styles/Home.css";

function Home() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="home-page">

            <Header
                onMenuClick={() => setIsSidebarOpen(true)}
            />

            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <main className="home-content">

                <section className="hero-section">
                    <img
                        src="/swan-statue.jpg"
                        alt="Swan Lake at Singapore Botanic Gardens"
                        className="hero-image"
                    />

                    <p className="hero-tagline">
                        Explore · Discover · Learn
                    </p>

                    <h1>
                        Discover nature with GardenLens.
                    </h1>
                </section>

                <section className="about-section">
                    <h2>About Us</h2>

                    <p>
                        GardenLens is a lightweight image recognition
                        web application designed to enhance the
                        experience of visitors at the Singapore
                        Botanic Gardens.
                    </p>

                    <p>
                        Discover a variety of plants, flowers and
                        historical architecture simply by taking
                        a photograph using your mobile device.
                    </p>

                    <p>
                        Whether you are a tourist, local visitor or
                        plant enthusiast, GardenLens helps you explore,
                        discover and learn more about the Gardens.
                    </p>

                    <div className="discovery-message">
                        <Leaf size={25} />

                        <p>
                            Tap the camera below to begin your discovery!
                        </p>
                    </div>
                </section>

            </main>

            <BottomNavbar />

        </div>
    );
}

export default Home;