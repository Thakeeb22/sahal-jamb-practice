# Sahal School JAMB Practice App

### Overview

Sahal School JAMB Practice App is a frontend-only Computer-Based Test (CBT) application designed for students preparing for JAMB exams. Built with vanilla HTML, CSS, and JavaScript, it provides an interactive quiz interface for practicing questions across multiple subjects. The app uses browser localStorage for user data persistence and static JSON files for question storage.

This README describes how to set up and run the application, its features, and architecture.

### Repository Layout

```
Sahal School jamb quiz app/
├── index.html              # Login page
├── signup.html             # Signup page
├── practice.html           # Quiz interface
├── results.html            # Results page
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker for PWA
├── package.json            # Node.js dependencies and scripts
├── css/
│   └── style.css           # Application styling
├── js/
│   ├── login.js            # Login functionality
│   ├── signup.js           # Signup functionality
│   ├── script.js           # Main quiz logic
│   └── results.js          # Results display
├── data/                   # Static JSON question files
│   ├── biology.json        # Biology questions
│   ├── chemistry.json      # Chemistry questions
│   ├── commerce.json       # Commerce questions
│   ├── economics.json      # Economics questions
│   ├── english.json        # English questions
│   ├── government.json     # Government questions
│   ├── literature-in-english.json # Literature questions
│   ├── mathematics.json    # Mathematics questions
│   ├── physics.json        # Physics questions
│   └── principles-of-accounts.json # Accounts questions
├── img/                    # Images and assets
│   ├── sahal logo.svg      # School logo
│   ├── sahal favicon.svg   # Favicon
│   └── questions/          # Question-related images
├── api/                    # Unused API directory (for future backend)
└── .gitignore              # Git ignore file
```

### Key Features

- **User Authentication**: Simple signup and login using browser localStorage
- **Subject Selection**: Choose subjects during signup
- **Interactive Quiz Interface**: Question navigation with visual palette
- **Real-time Timer**: 2-hour countdown with auto-submission
- **Built-in Calculator**: For mathematics questions
- **Results Analysis**: Subject-wise scoring and performance metrics
- **Responsive Design**: Optimized for mobile and desktop
- **Data Management**: Static JSON files for questions
- **PWA Support**: Installable as a Progressive Web App

## Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)

---

## Getting Started

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Thakeeb22/sahal-jamb-practice.git
   cd "Sahal School jamb quiz app"
   ```

2. **Run the application**:

   Open `index.html` in your web browser to start the application.

   Alternatively, serve the files using a local server (e.g., using Python: `python -m http.server` or Node.js live-server) for better functionality.

### Usage

- Open `index.html` in your browser
- Click "Sign Up Here" to register a new account
- Enter your fullname and password
- Select subjects to practice

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

### User Data (localStorage)

Users are stored in browser localStorage as JSON objects:

```json
{
  "fullname": "John Doe",
  "password": "hashedpassword",
  "subjects": ["Mathematics", "English"]
}
```

### Questions JSON Format

Questions are stored in static JSON files in the `data/` directory:

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

- User authentication uses simple password storage in localStorage (not secure for production)
- Questions are loaded from static JSON files
- Timer set to 2 hours (7200 seconds) with auto-submission
- PWA features include offline support and installability
- Responsive design works on mobile and desktop
- Calculator is built-in for mathematics questions
- Results are stored temporarily in localStorage
