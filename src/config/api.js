const hostname = window.location.hostname;

let API_URL;

if (import.meta.env.DEV) {

    // Laptop or mobile Wi-Fi development
    API_URL = `http://${hostname}:5000`;

} else {

    // Production deployment on Netlify
    API_URL = import.meta.env.VITE_API_URL;

}

// Remove trailing slashes
API_URL = API_URL?.replace(/\/+$/, "");

export { API_URL };