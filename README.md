# CareMind 🤝💬

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-F55036?style=for-the-badge&logo=groq&logoColor=white)

[![Node.js CI](https://github.com/KAMO333/MS-AI-Hackathon/actions/workflows/tests.yml/badge.svg)](https://github.com/KAMO333/MS-AI-Hackathon/actions/workflows/tests.yml)

A professional full-stack application designed for social workers to manage client interactions with AI-powered clinical guidance. This project showcases a modern MVC (Model-View-Controller) architecture, cloud-native database integration, and automated testing.

---

## 📁 Project Structure

```text
backend/
├── src/
│   ├── controllers/    # Route logic & orchestration
│   ├── db/             # Database connection & pooling
│   ├── middleware/     # Request validation guards
│   ├── routes/         # API endpoint definitions
│   ├── services/       # External AI API integration
│   ├── tests/          # Jest unit & integration tests
│   └── server.js       # Entry point
frontend/               # Client-side assets (HTML/CSS/JS)
.github/workflows/      # CI/CD (GitHub Actions)
```

---

## ✨ Key Features

- **MVC Architecture:** Decoupled concerns for high maintainability and scalability.
- **AI Consultation Engine:** Context-aware guidance powered by Groq (Llama-3-70b).
- **Cloud-Native Storage:** Robust data persistence using Neon PostgreSQL.
- **Automated Quality Assurance:** 100% mocked testing environment using Jest.
- **CI/CD Pipeline:** Automated test execution on every push via GitHub Actions.
- **Modern UI:** Professional "Digital Case File" aesthetic with real-time state feedback.

---

## 🛠️ Technologies Used

**Backend:**

- Node.js (ES Modules)
- Express.js
- Groq SDK (Llama-3-70b-versatile)
- PostgreSQL (pg) with Connection Pooling

**Frontend:**

- HTML5
- Vanilla JS (Fetch API & DOM Manipulation)
- CSS3 (Flexbox/Grid design system)

**DevOps & Testing:**

- Jest (Native ESM Testing)
- GitHub Actions
- Supertest (API Testing)

---

## 🚀 Installation Guide

### Prerequisites

- Node.js (v20+)
- Neon.tech (or local PostgreSQL) account
- Groq API Key

### Setup Instructions

#### 1. Clone & Install

```bash
git clone https://git@github.com:KAMO333/MS-AI-Hackathon.git
cd CareMind/backend
npm install
```

#### 2. Environment Configuration

Create a `.env` file in the `backend` folder:

```env
PORT=3000
DATABASE_URL=postgres://user:password@hostname/dbname?sslmode=require
GROQ_API_KEY=your_groq_key_here
```

#### 3. Database Migration

Run this in your PostgreSQL console:

```sql
CREATE TABLE Clients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    surname VARCHAR(255),
    age INTEGER,
    location VARCHAR(255),
    issue TEXT,
    response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🧪 Running Tests

This project uses Native ESM with Jest. Run the automated suite with:

```bash
npm test
```

---

## 🏃 Running the Application

#### 1. Start the Development Server

```bash
npm run dev
```

#### 2. Access the UI

Open `http://localhost:3000` in your browser.

---
