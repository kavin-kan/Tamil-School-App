# Tamil School App

A student progress tracking and communication platform designed specifically for Tamil school education. This app focuses on skill-based learning, effort, participation, attendance, and overall growth in Tamil language education and cultural studies.

## Features

- **Skill-Based Evaluation**: Track progress in Tamil Reading, Writing, Speaking, Grammar, Vocabulary, Cultural Knowledge, and Participation
- **Progress Tracking**: Visual indicators showing skill levels (Advanced, Proficient, Developing, Beginning)
- **Assignments**: Manage homework, reading tasks, writing tasks, and speaking activities
- **Attendance Tracking**: Mark and view attendance history with notes
- **Teacher Feedback**: Written feedback highlighting strengths and areas for improvement
- **Parent Portal**: Parents can view their child's progress, feedback, attendance, and assignments
- **Progress Reports**: Generate reports focusing on learning growth rather than scores

## Technology Stack

- **Frontend**: React
- **Backend**: Python (Flask/FastAPI)
- **Database**: Google Firebase (Firestore)

## Project Structure

```
Tamil School App/
├── frontend/          # React application
├── backend/           # Python backend API
├── firebase/          # Firebase configuration and rules
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- Python (v3.8 or higher)
- Google Firebase account
- npm or yarn

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
python app.py
```

### Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Authentication (Email/Password)
3. Enable Firestore Database
4. Copy your Firebase config and add it to `frontend/src/config/firebase.js`
5. Deploy Firestore security rules from `firebase/firestore.rules`

## User Roles

- **Students**: View their own progress, skills, assignments, and attendance
- **Parents**: View their child's progress, communicate with teachers
- **Teachers**: Manage classes, track student progress, create assignments, mark attendance
- **Administrators**: Manage users, classes, enrollments, and school settings

## Skill Categories

1. Tamil Reading
2. Tamil Writing
3. Tamil Speaking and Pronunciation
4. Grammar and Vocabulary
5. Cultural Knowledge
6. Participation and Effort

## Progress Levels

- **Advanced**: Mastery level performance
- **Proficient**: Solid understanding and application
- **Developing**: Growing competency with support
- **Beginning**: Initial learning stage

## License

Private - Tamil School Use Only


