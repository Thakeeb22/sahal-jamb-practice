# Sahal School JAMB Practice App

### Overview

Sahal School JAMB Practice App is a full-stack Computer-Based Test (CBT) application for students preparing for JAMB exams. It features a responsive frontend built with vanilla HTML, CSS, and JavaScript, integrated with a Next.js backend API, MongoDB database for persistent data storage, and JWT-based authentication. The app includes tools for question data management and scraping.

This README describes how to set up and run the application, its features, and architecture.

### Repository Layout

```
Sahal School jamb quiz app/
├── index.html              # Login page
├── signup.html             # Signup page
├── practice.html           # Quiz interface
├── results.html            # Results page
├── server.js               # Express server for serving questions (alternative)
├── package.json            # Node.js dependencies and scripts
├── css/
│   └── style.css           # Application styling
├── js/
│   ├── login.js            # Login functionality
│   ├── signup.js           # Signup functionality
│   ├── script.js           # Main quiz logic
│   └── results.js          # Results display
├── api/                    # Next.js API routes
│   ├── index.js            # API index (if applicable)
│   ├── auth/
│   │   ├── login.js        # User login endpoint
│   │   └── signup.js       # User registration endpoint
│   ├── questions/
│   │   ├── index.js        # Fetch questions endpoint
│   │   └── sync.js         # Sync questions to database
│   └── _models/            # Mongoose models
│       ├── User.js         # User schema
│       ├── License.js      # License schema
│       └── Question.js     # Question schema
│   └── _utils/             # Utility functions
│       ├── auth.js         # JWT token utilities
│       ├── db.js           # Database connection
│       └── hash.js         # Password hashing
├── data/                   # Static JSON question files
│   ├── questions.json      # Combined questions
│   ├── biology.json        # Biology questions
│   ├── chemistry.json      # Chemistry questions
│   ├── commerce.json       # Commerce questions
│   ├── economics.json      # Economics questions
│   ├── english.json        # English questions
│   ├── government.json     # Government questions
│   ├── literature-in-english # Literature questions
│   ├── mathematics.json    # Mathematics questions
│   ├── physics.json        # Physics questions
│   ├── principles-of-accounts.json # Accounts questions
│   └── accounting.json     # Accounting questions

├── img/                    # Images and assets
│   ├── sahal logo.svg      # School logo
│   ├── sahal favicon.svg   # Favicon
│   └── questions/          # Question-related images
└── .gitignore              # Git ignore file
```

### Key Features

- **User Authentication**: Secure signup and login with JWT tokens and MongoDB storage
- **License Management**: License code validation for user registration
- **Subject Selection**: Choose up to 4 subjects during signup
- **Interactive Quiz Interface**: Question navigation with visual palette
- **Real-time Timer**: 2-hour countdown with auto-submission
- **Built-in Calculator**: For mathematics questions
- **Results Analysis**: Subject-wise scoring and performance metrics
- **Responsive Design**: Optimized for mobile and desktop
- **Data Management**: Static JSON files for questions
- **API Endpoints**: RESTful API for questions, authentication, and data sync

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or cloud service like MongoDB Atlas)
- Modern web browser (Chrome, Firefox, Safari, Edge)
- npm or yarn package manager

---

## Getting Started

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Thakeeb22/sahal-jamb-practice.git
   cd "Sahal School jamb quiz app"
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:

   Create a `.env.local` file in the root directory:

   ```env
   MONGODB_URI=mongodb://localhost:27017/sahal-jamb-quiz
   JWT_SECRET=your-super-secret-jwt-key-here
   ```

   Replace `MONGODB_URI` with your MongoDB connection string and `JWT_SECRET` with a secure random string.

4. **Start MongoDB** (if running locally):

   ```bash
   mongod
   ```

5. **Run the application**:

   For development with Next.js:

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

   Alternatively, use the Express server:

   ```bash
   node server.js
   ```

   Access at `http://localhost:5000`

### First-Time Setup

1. **Seed the database** (optional):

   Manually populate the database with questions using the API endpoints or MongoDB tools.

2. **Create license codes** (via MongoDB or admin interface):

   Add license codes to the `License` collection for user registration.

3. **Access the application**:
   - Open `http://localhost:3000` (or 5000 for Express)
   - Click "Sign Up Here" to register
   - Enter fullname, password, and valid license code
   - Select 4 subjects
   - Login to start practicing

---

## API Endpoints

### Authentication

- `POST /api/auth/signup` - User registration
  - Body: `{ fullname, password, licenseCode }`
  - Returns: `{ token, fullname }`

- `POST /api/auth/login` - User login
  - Body: `{ fullname, password }`
  - Returns: `{ token, fullname }`

### Questions

- `GET /api/questions` - Fetch questions
  - Query params: `?subject=Mathematics`
  - Returns: Array of question objects

- `GET /api/questions/sync` - Sync JSON questions to database

### Subjects

- `GET /api/subjects` - Get all available subjects
  - Returns: Array of subject names

---

## Usage Guide

### Taking a Quiz

1. Log in with your credentials
2. Select answers for questions
3. Navigate using the question palette
4. Switch between subjects via tabs
5. Use calculator for math problems
6. Submit quiz to view results

### Viewing Results

- Overall score and subject breakdown
- Correct/incorrect answer counts

---

## Data Structure

### User Model (MongoDB)

```javascript
{
  fullname: String (required, unique),
  password: String (hashed, required),
  licenseCode: String (required),
  createdAt: Date (default: now)
}
```

### License Model

```javascript
{
  code: String (required, unique),
  isActive: Boolean (default: true),
  createdAt: Date (default: now)
}
```

### Question Model

```javascript
{
  subject: String (required),
  question: String (required),
  options: [String] (4 options),
  answer: String (required)
}
```

### Questions JSON Format

```json
{
  "subject": "Mathematics",
  "questions": [
    {
      "question": "What is 2 + 2?",
      "options": ["3", "4", "5", "6"],
      "answer": "4"
    }
  ]
}
```

## Development Notes

- JWT tokens are used for authentication
- Passwords are hashed with bcryptjs
- Questions can be served from JSON files or MongoDB
- Timer set to 2 hours (7200 seconds)
- For production, use environment variables for secrets
- Consider adding rate limiting and input validation
- Static JSON files provide fallback for questions
