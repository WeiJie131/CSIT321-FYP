
# GardenLens 🌱

GardenLens is a lightweight image recognition mobile web application developed for visitors of the Singapore Botanic Gardens.

The application aims to improve visitors' experiences by allowing them to identify plants, flowers and architectural features using image recognition technology.

## 🛠️ Technologies Used

### Frontend
- HTML
- CSS
- JavaScript
- ReactJS
- Vite

### Backend
- Node.js
- Express.js

### Database
- MySQL
- MySQL Workbench

---

## 📋 Prerequisites

Before running the project, install the following software:

1. **Node.js (LTS)** – https://nodejs.org/
2. **Visual Studio Code** – https://code.visualstudio.com/
3. **Git** – https://git-scm.com/
4. **MySQL Server** – https://dev.mysql.com/downloads/mysql/
5. **MySQL Workbench** – https://dev.mysql.com/downloads/workbench/

After installation, open a terminal and verify that Node.js, npm and Git are installed:

```bash
node -v
npm -v
git --version
```

---

## 📥 Step 1: Clone the GitHub Repository

Open a terminal and navigate to your preferred project directory.

Clone the repository:

```bash
git clone https://github.com/WeiJie131/CSIT321-FYP.git
```

Navigate into the project folder:

```bash
cd CSIT321-FYP
```

Open the project in Visual Studio Code:

```bash
code .
```

---

## 📦 Step 2: Install Frontend Dependencies

Make sure you are inside the project root folder (`CSIT321-FYP`).

Run:

```bash
npm install
```

This installs the dependencies required by the React frontend.

---

## 📦 Step 3: Install Backend Dependencies

Navigate into the backend folder:

```bash
cd backend
```

Install the backend dependencies:

```bash
npm install
```

The backend uses the following packages:

- Express.js
- MySQL2
- CORS
- Dotenv
- Nodemon (development dependency)

Return to the project root folder:

```bash
cd ..
```

---

## 🗄️ Step 4: Set Up the MySQL Database

1. Open MySQL Workbench.
2. Connect to your local MySQL Server.
3. Open a new SQL tab.
4. Copy and execute the following SQL statements:

```sql
CREATE DATABASE gardenlens_db;

USE gardenlens_db;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);
```

The database should now contain:

- Database: `gardenlens_db`
- Table: `users`

---

## 🔐 Step 5: Configure Environment Variables

Inside the `backend` folder, create a new file named `.env`.

Add the following configuration:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=gardenlens_db
PORT=5000
```

**Important:**

- Replace `YOUR_MYSQL_PASSWORD` with your own local MySQL root password.
- Each team member must configure their own `.env` file.
- Do not upload the `.env` file to GitHub.
- Never share your database password publicly.

---

## 🚀 Step 6: Run the Backend Server

Open a VS Code terminal.

Navigate into the backend folder:

```bash
cd backend
```

Start the backend development server:

```bash
npm run dev
```

If everything is configured correctly, the terminal should display:

```text
Connected to GardenLens MySQL database!
GardenLens server running on port 5000
```

To test the backend API, open the following URL in your browser:

http://localhost:5000/

Expected response:

```json
{
  "message": "Welcome to GardenLens API!"
}
```

Keep the backend server running.

---

## 🌐 Step 7: Run the Frontend Application

Open a **second terminal** in VS Code.

Make sure you are inside the project root folder (`CSIT321-FYP`), not the backend folder.

Run:

```bash
npm run dev
```

Vite will display a local development URL, usually:

http://localhost:5173/

Open the URL in your browser to access GardenLens.

---

## 📁 Project Structure

```text
CSIT321-FYP/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── .env
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── public/
├── src/
│
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
└── README.md
```

---

## ⚠️ Important Notes

- Both frontend and backend servers must be running to use the complete application.
- The frontend normally runs on port `5173`.
- The backend normally runs on port `5000`.
- MySQL Server must be running before starting the backend.
- Each team member must set up their own local MySQL database.
- Each team member must create their own `backend/.env` file.
- The `.env` file and `node_modules` folders must not be uploaded to GitHub.

---

## 👥 GitHub Repository

Repository: https://github.com/WeiJie131/CSIT321-FYP
