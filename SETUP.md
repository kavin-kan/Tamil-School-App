# Tamil School App - Setup Guide

This guide will help you set up and run the Tamil School App on your local machine.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.8 or higher) - [Download](https://www.python.org/downloads/)
- **npm** (comes with Node.js) or **yarn**
- **pip** (comes with Python 3.4+)
- **Google Firebase account** - [Sign up](https://firebase.google.com/)

## Step 1: Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and create a new project (e.g., "Tamil School App")
3. Enable the following services:

### Authentication
- Go to **Authentication** > **Sign-in method**
- Click on **Email/Password** and enable it
- Click **Save**

### Firestore Database
- Go to **Firestore Database**
- Click **Create database**
- Select **Start in production mode** (we'll add security rules separately)
- Choose a location for your database
- Click **Enable**

4. Get your Firebase configuration:
   - Go to **Project Settings** (gear icon) > **General**
   - Scroll down to **Your apps** section
   - Click the **Web** icon (`</>`) to add a web app
   - Register your app with a nickname (e.g., "Tamil School Web")
   - Copy the Firebase configuration object

5. Set up Service Account (for backend):
   - Go to **Project Settings** > **Service Accounts**
   - Click **Generate new private key**
   - Save the JSON file securely (e.g., `backend/serviceAccountKey.json`)
   - **Important:** Add this file to `.gitignore` (already included)

6. Deploy Firestore security rules:
   - Install Firebase CLI: `npm install -g firebase-tools`
   - Login: `firebase login`
   - Initialize: `firebase init firestore`
   - Copy the rules from `firebase/firestore.rules` to the generated `firestore.rules`
   - Deploy: `firebase deploy --only firestore:rules`

## Step 2: Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (recommended):
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   - Copy `env.example` to `.env`
   - Update `.env` with your Firebase service account key path:
     ```
     FIREBASE_CREDENTIALS_PATH=serviceAccountKey.json
     FLASK_ENV=development
     FLASK_DEBUG=True
     ```

5. Start the backend server:
   ```bash
   python app.py
   ```

   The backend should now be running on `http://localhost:5000`

## Step 3: Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Firebase:
   - Open `frontend/src/config/firebase.js`
   - Replace the placeholder values with your Firebase configuration from Step 1:
     ```javascript
     const firebaseConfig = {
       apiKey: "your-actual-api-key",
       authDomain: "your-project.firebaseapp.com",
       projectId: "your-project-id",
       storageBucket: "your-project.appspot.com",
       messagingSenderId: "123456789",
       appId: "your-app-id"
     };
     ```

4. (Optional) Create a `.env` file in the `frontend` directory if you want to configure the API URL:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

5. Start the development server:
   ```bash
   npm start
   ```

   The frontend should now be running on `http://localhost:3000`

## Step 4: Create Initial Users

Since authentication is handled by Firebase, you'll need to create users through the Firebase Console:

1. Go to **Authentication** > **Users** in Firebase Console
2. Click **Add user**
3. Enter email and password for test users
4. After creating users, you'll need to add their profile data to Firestore:
   - Go to **Firestore Database**
   - Create a `users` collection
   - Add a document with the user's UID (from Authentication)
   - Add fields: `email`, `role` (student/parent/teacher/admin), `name`

## Step 5: Test the Application

1. Make sure both backend and frontend are running
2. Open `http://localhost:3000` in your browser
3. Login with a user account you created
4. You should see the dashboard (even if it's empty, that's expected)

## Troubleshooting

### Backend Issues

- **Import errors**: Make sure you've activated your virtual environment
- **Firebase connection errors**: Verify your service account key path is correct in `.env`
- **Port already in use**: Change the port in `app.py` (default is 5000)

### Frontend Issues

- **Firebase errors**: Double-check your Firebase configuration in `firebase.js`
- **API connection errors**: Make sure the backend is running and the API URL is correct
- **Build errors**: Try deleting `node_modules` and running `npm install` again

### Firebase Issues

- **Authentication not working**: Make sure Email/Password provider is enabled
- **Permission denied errors**: Check that Firestore security rules are deployed correctly
- **Missing collections**: The app will create collections automatically as needed

## Next Steps

- Create more user accounts (students, parents, teachers)
- Set up classes and enrollments
- Add initial skill assessments
- Create assignments and mark attendance
- Customize the UI and add Tamil language labels as needed

## Production Deployment

For production deployment:

1. Build the frontend: `cd frontend && npm run build`
2. Deploy frontend to a hosting service (Firebase Hosting, Vercel, Netlify, etc.)
3. Deploy backend to a cloud service (Heroku, AWS, Google Cloud Run, etc.)
4. Update Firebase configuration for production
5. Set up environment variables securely
6. Update CORS settings in the backend for your production domain

For more details, see the main [README.md](README.md) file.


