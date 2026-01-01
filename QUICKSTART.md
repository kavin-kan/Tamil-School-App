# Quick Start Guide - Run the App Now

Follow these steps to get the app running on your machine:

## Prerequisites Check

First, verify you have the required software:

```powershell
# Check Node.js (should show version 14 or higher)
node --version

# Check Python (should show version 3.8 or higher)
python --version

# Check npm (comes with Node.js)
npm --version

# Check pip (comes with Python)
pip --version
```

If any are missing, install them:
- **Node.js**: Download from https://nodejs.org/ (install the LTS version)
- **Python**: Download from https://www.python.org/downloads/ (check "Add Python to PATH" during installation)

## Quick Setup (5-10 minutes)

### Option 1: Quick Frontend-Only Demo (Fastest - ~2 minutes)

If you just want to see the UI quickly without backend/Firebase:

1. **Install frontend dependencies:**
   ```powershell
   cd frontend
   npm install
   ```

2. **Temporarily disable Firebase auth** (for demo only):
   - The app will show a login page, but you can view the UI structure
   - You'll need Firebase setup to actually login and see data

### Option 2: Full Setup (Recommended - ~10 minutes)

**Step 1: Install Dependencies (2 minutes)**

Open PowerShell in the project root and run:

```powershell
# Install frontend dependencies
cd frontend
npm install
cd ..

# Install backend dependencies
cd backend
pip install -r requirements.txt
cd ..
```

**Step 2: Quick Firebase Setup (5 minutes)**

1. Go to https://console.firebase.google.com/
2. Click "Add project" → Name it "Tamil School App" → Continue
3. Disable Google Analytics (optional) → Create project
4. Once created, click the **Web icon** (`</>`) to add a web app
5. Register app with nickname "Web App" → Register
6. **Copy the `firebaseConfig` object** (you'll see it on screen)
7. Open `frontend/src/config/firebase.js` and paste your config
8. Go to **Authentication** → **Sign-in method** → Enable **Email/Password** → Save
9. Go to **Firestore Database** → **Create database** → **Start in test mode** → Next → Enable
10. Go to **Project Settings** → **Service Accounts** → **Generate new private key**
11. Save the JSON file as `backend/serviceAccountKey.json`

**Step 3: Configure Backend (1 minute)**

```powershell
cd backend
copy env.example .env
```

Edit `.env` file and set:
```
FIREBASE_CREDENTIALS_PATH=serviceAccountKey.json
FLASK_ENV=development
FLASK_DEBUG=True
```

**Step 4: Start Both Servers (2 minutes)**

Open **TWO** PowerShell windows:

**Terminal 1 - Backend:**
```powershell
cd "C:\Tamil School App\backend"
python app.py
```

Wait for: `* Running on http://127.0.0.1:5000`

**Terminal 2 - Frontend:**
```powershell
cd "C:\Tamil School App\frontend"
npm start
```

Wait for browser to open automatically at `http://localhost:3000`

**Step 5: Create Test User**

1. Go back to Firebase Console → **Authentication** → **Users**
2. Click **Add user**
3. Email: `test@example.com`
4. Password: `test123456` (or any password you want)
5. Click **Add user**
6. Copy the **UID** (User ID) - you'll need this
7. Go to **Firestore Database**
8. Click **Start collection** → Collection ID: `users`
9. Document ID: paste the UID you copied
10. Add fields:
    - `email` (string): `test@example.com`
    - `role` (string): `student`
    - `name` (string): `Test Student`
11. Click **Save**

**Step 6: Login and Explore!**

1. Go to `http://localhost:3000`
2. Login with: `test@example.com` / `test123456`
3. Explore the dashboard and pages!

## Troubleshooting

**"npm: command not found"**
- Install Node.js from https://nodejs.org/
- Restart your terminal after installation

**"python: command not found"**
- Install Python from https://www.python.org/
- Make sure to check "Add Python to PATH" during installation
- Restart your terminal

**"Module not found" errors**
- Make sure you ran `npm install` in the frontend folder
- Make sure you ran `pip install -r requirements.txt` in the backend folder

**Port 3000 or 5000 already in use**
- Close other applications using those ports
- Or change the ports in the code

**Firebase connection errors**
- Double-check your Firebase config in `frontend/src/config/firebase.js`
- Make sure Email/Password authentication is enabled
- Make sure Firestore Database is created

**Backend won't start**
- Make sure `serviceAccountKey.json` is in the `backend` folder
- Check that `.env` file exists in `backend` folder
- Make sure all Python packages are installed

## What You'll See

Once running, you can:
- ✅ View the login page
- ✅ Login with your test account
- ✅ See the Dashboard (may be empty until you add data)
- ✅ Navigate to Skills, Assignments, Attendance, and Progress pages
- ✅ See the clean, modern UI built with Material-UI

The app structure is ready - you just need to add student data through Firebase or the backend API to see full functionality!

