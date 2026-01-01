# Firebase Setup Instructions

## Initial Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable the following services:

### Authentication
1. Go to Authentication > Sign-in method
2. Enable "Email/Password" provider

### Firestore Database
1. Go to Firestore Database
2. Create database in production mode (we'll add rules separately)
3. Copy your Firestore rules from `firestore.rules` file
4. Deploy rules using Firebase CLI:
   ```bash
   firebase deploy --only firestore:rules
   ```

### Get Firebase Configuration
1. Go to Project Settings > General
2. Scroll down to "Your apps"
3. Click on the Web icon (</>) to add a web app
4. Copy the Firebase configuration object
5. Add it to `frontend/src/config/firebase.js`

### Service Account Key (for Backend)
1. Go to Project Settings > Service Accounts
2. Click "Generate new private key"
3. Save the JSON file securely
4. Update `backend/.env` with the path to this file:
   ```
   FIREBASE_CREDENTIALS_PATH=path/to/serviceAccountKey.json
   ```

## Database Schema

The app uses the following Firestore structure:

```
users/
  {userId}/
    - email
    - role (student|parent|teacher|admin)
    - name
    - children: [] (for parents)
    
students/
  {studentId}/
    - name
    - email
    - classId
    - grade
    - parentIds: []
    
    skills/
      {skillCategory}/
        - level (Advanced|Proficient|Developing|Beginning)
        - notes
        - updatedAt
        - updatedBy
        
    assignments/
      {assignmentId}/
        - title
        - description
        - type (homework|reading|writing|speaking)
        - dueDate
        - status (Completed|In Progress|Missing)
        - createdAt
        - createdBy
        - comments: []
        
    attendance/
      {attendanceId}/
        - status (Present|Absent|Late)
        - date
        - notes
        - markedBy
        - markedAt
        
    feedback/
      {feedbackId}/
        - strengths
        - areasForImprovement
        - notes
        - createdAt
        - createdBy

classes/
  {classId}/
    - name
    - grade
    - teacherId
    - studentIds: []
```

## Skill Categories

The following skill categories are used:
- Tamil Reading
- Tamil Writing
- Tamil Speaking and Pronunciation
- Grammar and Vocabulary
- Cultural Knowledge
- Participation and Effort

