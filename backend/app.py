"""
Tamil School App - Backend API
Python Flask backend for student progress tracking and communication
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore, auth
import os
from dotenv import load_dotenv
from datetime import datetime

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize Firebase Admin
try:
    # Check if Firebase Admin is already initialized
    firebase_admin.get_app()
except ValueError:
    # Initialize Firebase Admin SDK
    cred_path = os.getenv('FIREBASE_CREDENTIALS_PATH')
    if cred_path and os.path.exists(cred_path):
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
    else:
        # For development, can use application default credentials
        # or initialize without credentials (will use environment)
        firebase_admin.initialize_app()

db = firestore.client()

# Helper function to verify Firebase token
def verify_token():
    """Verify Firebase ID token from request headers"""
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return None
    
    try:
        token = auth_header.split('Bearer ')[1]
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        print(f"Token verification error: {e}")
        return None

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "message": "Tamil School App API is running"}), 200

# Authentication endpoints
@app.route('/api/auth/user', methods=['GET'])
def get_current_user():
    """Get current authenticated user information"""
    decoded_token = verify_token()
    if not decoded_token:
        return jsonify({"error": "Unauthorized"}), 401
    
    uid = decoded_token['uid']
    user_doc = db.collection('users').document(uid).get()
    
    if user_doc.exists:
        return jsonify(user_doc.to_dict()), 200
    else:
        return jsonify({"error": "User not found"}), 404

# Student endpoints
@app.route('/api/students/<student_id>/progress', methods=['GET'])
def get_student_progress(student_id):
    """Get student progress summary"""
    decoded_token = verify_token()
    if not decoded_token:
        return jsonify({"error": "Unauthorized"}), 401
    
    try:
        student_ref = db.collection('students').document(student_id)
        student_doc = student_ref.get()
        
        if not student_doc.exists:
            return jsonify({"error": "Student not found"}), 404
        
        student_data = student_doc.to_dict()
        
        # Get skills
        skills_ref = student_ref.collection('skills')
        skills_docs = skills_ref.get()
        skills = {doc.id: doc.to_dict() for doc in skills_docs}
        
        # Get recent feedback
        feedback_ref = student_ref.collection('feedback')
        feedback_docs = feedback_ref.order_by('createdAt', direction=firestore.Query.DESCENDING).limit(5).get()
        recent_feedback = [doc.to_dict() for doc in feedback_docs]
        
        # Get assignments summary
        assignments_ref = student_ref.collection('assignments')
        assignments_docs = assignments_ref.get()
        assignments = [doc.to_dict() for doc in assignments_docs]
        
        # Calculate overall progress status
        overall_status = calculate_overall_status(skills)
        
        return jsonify({
            "student": student_data,
            "skills": skills,
            "recentFeedback": recent_feedback,
            "assignments": assignments,
            "overallStatus": overall_status
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def calculate_overall_status(skills):
    """Calculate overall progress status based on skills"""
    if not skills:
        return "Needs Improvement"
    
    level_scores = {"Advanced": 4, "Proficient": 3, "Developing": 2, "Beginning": 1}
    total_score = 0
    count = 0
    
    for skill_data in skills.values():
        level = skill_data.get('level', 'Beginning')
        total_score += level_scores.get(level, 1)
        count += 1
    
    if count == 0:
        return "Needs Improvement"
    
    avg_score = total_score / count
    
    if avg_score >= 3.5:
        return "Excellent"
    elif avg_score >= 2.5:
        return "Good"
    else:
        return "Needs Improvement"

# Skills endpoints
@app.route('/api/students/<student_id>/skills', methods=['GET'])
def get_student_skills(student_id):
    """Get all skills for a student"""
    decoded_token = verify_token()
    if not decoded_token:
        return jsonify({"error": "Unauthorized"}), 401
    
    try:
        skills_ref = db.collection('students').document(student_id).collection('skills')
        skills_docs = skills_ref.get()
        skills = {doc.id: doc.to_dict() for doc in skills_docs}
        return jsonify(skills), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/students/<student_id>/skills/<skill_category>', methods=['PUT'])
def update_student_skill(student_id, skill_category):
    """Update a skill for a student (teacher only)"""
    decoded_token = verify_token()
    if not decoded_token:
        return jsonify({"error": "Unauthorized"}), 401
    
    try:
        data = request.get_json()
        level = data.get('level')
        notes = data.get('notes', '')
        
        if level not in ['Advanced', 'Proficient', 'Developing', 'Beginning']:
            return jsonify({"error": "Invalid skill level"}), 400
        
        skill_ref = db.collection('students').document(student_id).collection('skills').document(skill_category)
        skill_ref.set({
            'level': level,
            'notes': notes,
            'updatedAt': firestore.SERVER_TIMESTAMP,
            'updatedBy': decoded_token['uid']
        }, merge=True)
        
        return jsonify({"message": "Skill updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Assignments endpoints
@app.route('/api/students/<student_id>/assignments', methods=['GET'])
def get_student_assignments(student_id):
    """Get all assignments for a student"""
    decoded_token = verify_token()
    if not decoded_token:
        return jsonify({"error": "Unauthorized"}), 401
    
    try:
        assignments_ref = db.collection('students').document(student_id).collection('assignments')
        assignments_docs = assignments_ref.order_by('dueDate', direction=firestore.Query.DESCENDING).get()
        assignments = [{"id": doc.id, **doc.to_dict()} for doc in assignments_docs]
        return jsonify(assignments), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/students/<student_id>/assignments', methods=['POST'])
def create_assignment(student_id):
    """Create a new assignment (teacher only)"""
    decoded_token = verify_token()
    if not decoded_token:
        return jsonify({"error": "Unauthorized"}), 401
    
    try:
        data = request.get_json()
        assignment_ref = db.collection('students').document(student_id).collection('assignments').document()
        assignment_ref.set({
            'title': data.get('title'),
            'description': data.get('description', ''),
            'type': data.get('type', 'homework'),
            'dueDate': data.get('dueDate'),
            'status': 'In Progress',
            'createdAt': firestore.SERVER_TIMESTAMP,
            'createdBy': decoded_token['uid'],
            'comments': []
        })
        
        return jsonify({"id": assignment_ref.id, "message": "Assignment created successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Attendance endpoints
@app.route('/api/students/<student_id>/attendance', methods=['GET'])
def get_student_attendance(student_id):
    """Get attendance records for a student"""
    decoded_token = verify_token()
    if not decoded_token:
        return jsonify({"error": "Unauthorized"}), 401
    
    try:
        attendance_ref = db.collection('students').document(student_id).collection('attendance')
        attendance_docs = attendance_ref.order_by('date', direction=firestore.Query.DESCENDING).get()
        attendance = [{"id": doc.id, **doc.to_dict()} for doc in attendance_docs]
        return jsonify(attendance), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/students/<student_id>/attendance', methods=['POST'])
def mark_attendance(student_id):
    """Mark attendance for a student (teacher only)"""
    decoded_token = verify_token()
    if not decoded_token:
        return jsonify({"error": "Unauthorized"}), 401
    
    try:
        data = request.get_json()
        status = data.get('status')
        
        if status not in ['Present', 'Absent', 'Late']:
            return jsonify({"error": "Invalid attendance status"}), 400
        
        date = data.get('date', datetime.now().isoformat())
        attendance_ref = db.collection('students').document(student_id).collection('attendance').document()
        attendance_ref.set({
            'status': status,
            'date': date,
            'notes': data.get('notes', ''),
            'markedBy': decoded_token['uid'],
            'markedAt': firestore.SERVER_TIMESTAMP
        })
        
        return jsonify({"id": attendance_ref.id, "message": "Attendance marked successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Feedback endpoints
@app.route('/api/students/<student_id>/feedback', methods=['GET'])
def get_student_feedback(student_id):
    """Get feedback for a student"""
    decoded_token = verify_token()
    if not decoded_token:
        return jsonify({"error": "Unauthorized"}), 401
    
    try:
        feedback_ref = db.collection('students').document(student_id).collection('feedback')
        feedback_docs = feedback_ref.order_by('createdAt', direction=firestore.Query.DESCENDING).get()
        feedback = [{"id": doc.id, **doc.to_dict()} for doc in feedback_docs]
        return jsonify(feedback), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/students/<student_id>/feedback', methods=['POST'])
def create_feedback(student_id):
    """Create feedback for a student (teacher only)"""
    decoded_token = verify_token()
    if not decoded_token:
        return jsonify({"error": "Unauthorized"}), 401
    
    try:
        data = request.get_json()
        feedback_ref = db.collection('students').document(student_id).collection('feedback').document()
        feedback_ref.set({
            'strengths': data.get('strengths', ''),
            'areasForImprovement': data.get('areasForImprovement', ''),
            'notes': data.get('notes', ''),
            'createdAt': firestore.SERVER_TIMESTAMP,
            'createdBy': decoded_token['uid']
        })
        
        return jsonify({"id": feedback_ref.id, "message": "Feedback created successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)

