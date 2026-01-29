# Sahal School JAMB Practice App

### Overview

Sahal School JAMB Practice App is a lightweight Computer-Based Test (CBT) application for students preparing for JAMB exams. This is a frontend-only MVP built with vanilla HTML, CSS, and JavaScript, using browser localStorage for data persistence and static JSON files for questions.

This README describes how to run the application and its current features.

### Repository Layout

```
Sahal School jamb quiz app/
├── index.html              # Login page
├── signup.html             # Signup page
├── practice.html           # Quiz interface
├── results.html            # Results page
├── css/
│   └── style.css           # Application styling
├── data/
│   └── questions.json      # Static question database
├── img/
│   ├── sahal logo.svg      # School logo
│   └── sahal favicon.svg   # Favicon
└── js/
    ├── login.js            # Login functionality
    ├── signup.js           # Signup functionality
    ├── script.js           # Main quiz logic
    └── results.js          # Results display
```

### Key Features

- User signup and login (localStorage-based authentication)
- Subject selection during signup (up to 4 subjects)
- Interactive quiz interface with question navigation
- Question palette with visual indicators (answered/current/unanswered)
- 2-hour timer with auto-submission
- Built-in calculator for math questions
- Results display with subject-wise scoring
- Responsive design for mobile and desktop

## Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional dependencies required

---

## Getting Started

### Installation

1. **Clone or download the project**:

   ```bash
   git clone <repository-url>
   cd "Sahal School jamb quiz app"
   ```

2. **Open the application**:
   - Navigate to the project directory
   - Double-click `index.html` or open it in your web browser
   - Alternatively, use a local server (recommended for better compatibility):
     ```bash
     python -m http.server 8000
     # or
     npx http-server -p 8000
     ```
   - Then visit `http://localhost:8000`

### First-Time Setup

1. **Create an account**:
   - Click "Sign Up Here" on the login page
   - Enter your email and password
   - Enter a license code (any text for now)
   - Select 4 subjects you want to practice
   - Click "Sign Up"

2. **Login**:
   - Enter your credentials on the login page
   - Click "Login" to access the quiz interface

3. **Start Practicing**:
   - Select answers for each question
   - Use subject tabs to switch between topics
   - Use the question palette to navigate
   - Progress is automatically saved
   - Submit your answers to view results

---

## Usage Guide

### Taking a Quiz

1. Log in with your credentials
2. You'll be presented with the first question
3. Select one of four multiple-choice options (A, B, C, D)
4. Use the question palette on the right to:
   - Navigate to specific questions
   - View which questions you've answered
   - See remaining questions at a glance
5. Switch between subjects using the tabs at the top
6. Use the calculator button for math calculations
7. Submit your quiz when ready to see results

### Viewing Results

- After submission, you'll see:
  - Your overall score
  - Performance by subject
  - Total questions answered correctly

---

## Data Structure

### User Data (Local Storage)

```javascript
{
  "fullname": "Student Name",
  "password": "unencrypted_password", // Development only
  "subjects": ["English", "Mathematics", "Physics", "Chemistry"]
}
```

### Questions Format

```json
{
  "subject": "Subject Name",
  "questions": [
    {
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Correct Option"
    }
  ]
}
```

---

## Development Notes

- User data is stored in browser localStorage (not secure for production)
- Questions are loaded from static JSON file
- No backend integration currently implemented
- Timer is set to 2 hours (7200 seconds)


