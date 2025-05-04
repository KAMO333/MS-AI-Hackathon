# Care Mind 🤝💬

A full-stack application that helps social workers manage client information and get AI-powered assistance, with proper client data integration.

![Project Status](https://img.shields.io/badge/status-active-success)
![Tech Stack](https://img.shields.io/badge/stack-HTML5%20%7C%20CSS3%20%7C%20JavaScript%20%7C%20Node.js%20%7C%20Express%20%7C%20OpenAI%20%7C%20MSSQL-blue)


## 📁 Project Structure

## ✨ Key Features

- 🧑‍💼 Complete client data integration with AI responses
- 🤖 Intelligent context-aware suggestions
- 💾 SQL database storage for all interactions
- 🔄 Real-time AI responses with client context
- 🛡️ Error handling and user feedback

## 🛠️ Technologies Used

- **Backend**:
  - Node.js 🟢
  - Express.js 🚀
  - OpenAI API 🧠 (GPT-3.5-turbo)
  - MSSQL 🗃️
  - CORS 🔄
- **Frontend**:
  - HTML5 📄
  - CSS3 🎨
  - JavaScript 🟨 (ES6)

## 🚀 Installation Guide

### Prerequisites

- Node.js (v14+)
- npm (v6+)
- SQL Server instance
- OpenAI API key

### Setup Instructions

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/social-worker-assistant.git
   cd social-worker-assistant
   ```

2. **Backend setup**:

   ```bash
   cd backend
   npm install
   ```

3. **Environment configuration**:
   Create `.env` file in backend folder with:

   ```env
   PORT=3000
   DB_USER=your_db_username
   DB_PASSWORD=your_db_password
   DB_SERVER=your_server_address
   DB_DATABASE=your_db_name
   OPENAI_API_KEY=your_openai_key
   ```

4. **Database setup**:
   Ensure your SQL Server has a table with this structure:
   ```sql
   CREATE TABLE Clients (
     id INT IDENTITY(1,1) PRIMARY KEY,
     name NVARCHAR(100),
     surname NVARCHAR(100),
     age INT,
     location NVARCHAR(100),
     issue NVARCHAR(255),
     response NVARCHAR(MAX),
     created_at DATETIME DEFAULT GETDATE()
   )
   ```

## 🏃 Running the Application

1. **Start the backend server**:

   ```bash
   cd backend
   node src/server.js
   ```

2. **Open in browser**:
   http://localhost:3000

## 🖥️ Usage Guide

1. **View Client Dashboard**:

   - Automatically loads client information
   - Displays name, age, location, and primary issue

2. **Send Messages**:

   - Type your message in the text area
   - Click "Send to AI"
   - Client context is automatically included

3. **View Responses**:
   - AI responses appear in the response section
   - Formatted with proper line breaks
   - Includes contextual advice based on client data
