# 🚀 START HERE - Run Your Tamil School App

## ⚡ Quick Checklist

Before running, you need:
- [ ] **Node.js** installed (for frontend)
- [ ] **Python** installed (for backend)  
- [ ] **Firebase account** set up (free)

---

## 📦 Step 1: Install Prerequisites (if needed)

### Check if you have Node.js:
Open PowerShell and type:
```powershell
node --version
```

**If you see a version number (like v18.x.x):** ✅ You're good! Skip to Step 2.

**If you get an error:** 
1. Download Node.js from: https://nodejs.org/
2. Install the **LTS version** (Long Term Support)
3. **Restart your terminal/PowerShell after installation**

### Check if you have Python:
```powershell
python --version
```

**If you see a version number (like Python 3.10.x):** ✅ You're good!

**If you get an error:**
1. Download Python from: https://www.python.org/downloads/
2. **IMPORTANT:** During installation, check the box "Add Python to PATH"
3. **Restart your terminal/PowerShell after installation**

---

## 🔥 Step 2: Set Up Firebase (5 minutes)

1. **Go to Firebase Console:** https://console.firebase.google.com/
2. **Sign in** with your Google account (or create one - it's free)
3. **Create a new project:**
   - Click "Add project"
   - Name: `Tamil School App`
   - Click "Continue"
   - Disable Google Analytics (optional)
   - Click "Create project"
   - Wait for setup to complete, then click "Continue"

4. **Enable Authentication:**
   - Click "Authentication" in left menu
   - Click "Get started"
   - Click "Sign-in method" tab
   - Click on "Email/Password"
   - Toggle "Enable" to ON
   - Click "Save"

5. **Create Firestore Database:**
   - Click "Firestore Database" in left menu
   - Click "Create database"
   - Select "Start in test mode" (we'll add rules later)
   - Click "Next"
   - Choose a location (pick closest to you)
   - Click "Enable"

6. **Get Web App Configuration:**
   - Click the gear icon ⚙️ (Project Settings)
   - Scroll down to "Your apps"
   - Click the web icon `</>` 
   - Register app nickname: `Web App`
   - Click "Register app"
   - **COPY the `firebaseConfig` object** (the code that looks like this):

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

7. **Paste config into your code:**
   - Open `frontend/src/config/firebase.js` in your editor
   - Replace the placeholder values with your actual config
   - Save the file

8. **Get Service Account Key (for backend):**
   - Still in Project Settings
   - Click "Service accounts" tab
   - Click "Generate new private key"
   - Click "Generate key" in the popup
   - Save the JSON file that downloads
   - **Move it to:** `backend/serviceAccountKey.json`

---

## 💻 Step 3: Install Dependencies (2 minutes)

Open PowerShell in the project folder and run:

```powershell
# Install frontend packages
cd frontend
npm install

# Go back and install backend packages
cd ..
cd backend
pip install -r requirements.txt
cd ..
```

**This will take 2-3 minutes** - be patient! ☕

---

## ⚙️ Step 4: Configure Backend

Create the `.env` file:

```powershell
cd backend
copy env.example .env
```

The `.env` file should contain:
```
FIREBASE_CREDENTIALS_PATH=serviceAccountKey.json
FLASK_ENV=development
FLASK_DEBUG=True
```

---

## 🚀 Step 5: Start the App!

You need **TWO terminal windows** running at the same time:

### Terminal Window 1 - Backend Server

```powershell
cd "C:\Tamil School App\backend"
python app.py
```

**Wait for this message:** `* Running on http://127.0.0.1:5000`

✅ **Leave this window running!**

### Terminal Window 2 - Frontend Server

```powershell
cd "C:\Tamil School App\frontend"
npm start
```

**Your browser should automatically open** to `http://localhost:3000`

✅ **Leave this window running too!**

---

## 👤 Step 6: Create a Test User

To login, you need to create a user in Firebase:

1. Go back to **Firebase Console** → **Authentication** → **Users**
2. Click **"Add user"**
3. Email: `student@test.com`
4. Password: `test123456`
5. Click **"Add user"**
6. **Copy the UID** (the long string next to the email)

7. Go to **Firestore Database**
8. Click **"Start collection"**
9. Collection ID: `users`
10. Document ID: **Paste the UID** you copied
11. Click **"Add field"** three times:
    - Field: `email`, Type: `string`, Value: `student@test.com`
    - Field: `role`, Type: `string`, Value: `student`
    - Field: `name`, Type: `string`, Value: `Test Student`
12. Click **"Save"**

---

## 🎉 Step 7: Login and Explore!

1. Go to `http://localhost:3000` (or it should already be open)
2. You'll see the login page
3. Enter:
   - Email: `student@test.com`
   - Password: `test123456`
4. Click "Sign In"
5. **You should see the Dashboard!** 🎊

---

## 🐛 Troubleshooting

### "npm: command not found"
- Install Node.js from https://nodejs.org/
- **Restart your terminal** after installing

### "python: command not found"  
- Install Python from https://www.python.org/downloads/
- **Check "Add Python to PATH" during installation**
- **Restart your terminal** after installing

### Port 3000 or 5000 already in use
- Close other apps using those ports
- Or stop any other development servers you're running

### "Module not found" errors
- Make sure you ran `npm install` in the `frontend` folder
- Make sure you ran `pip install -r requirements.txt` in the `backend` folder

### Firebase errors on login
- Double-check your Firebase config in `frontend/src/config/firebase.js`
- Make sure Email/Password auth is enabled in Firebase Console
- Make sure Firestore Database is created

### Backend won't start
- Make sure `serviceAccountKey.json` is in the `backend` folder
- Make sure `.env` file exists in `backend` folder
- Check that all packages installed: `pip list`

---

## 📱 What You'll See

Once logged in, you can navigate to:
- **Dashboard** - Overview of progress
- **Progress** - Detailed progress view  
- **Assignments** - All assignments
- **Attendance** - Attendance records
- **Skills** - Skill assessments

The pages may be empty initially (no data yet), but you can see the UI structure!

---

## ✅ Success Checklist

- [ ] Node.js installed and working
- [ ] Python installed and working  
- [ ] Firebase project created
- [ ] Authentication enabled
- [ ] Firestore Database created
- [ ] Firebase config added to `frontend/src/config/firebase.js`
- [ ] Service account key saved to `backend/serviceAccountKey.json`
- [ ] Dependencies installed (`npm install` and `pip install`)
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Test user created in Firebase
- [ ] Successfully logged in!

---

**Need help?** Check the full [SETUP.md](SETUP.md) guide for detailed instructions.


