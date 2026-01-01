import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { format } from 'date-fns';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { getStudentProgress, getStudentFeedback } from '../services/api';

const SKILL_CATEGORIES = [
  'Tamil Reading',
  'Tamil Writing',
  'Tamil Speaking and Pronunciation',
  'Grammar and Vocabulary',
  'Cultural Knowledge',
  'Participation and Effort'
];

function StudentProgress() {
  const { currentUser } = useAuth();
  const [progress, setProgress] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const studentId = currentUser?.uid;
    if (studentId) {
      fetchProgressData(studentId);
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  async function fetchProgressData(studentId) {
    try {
      setLoading(true);
      const [progressData, feedbackData] = await Promise.all([
        getStudentProgress(studentId),
        getStudentFeedback(studentId)
      ]);
      setProgress(progressData);
      setFeedback(feedbackData);
    } catch (err) {
      setError('Failed to load progress data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Excellent':
        return 'success';
      case 'Good':
        return 'info';
      case 'Needs Improvement':
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      if (dateString.toDate) {
        return format(dateString.toDate(), 'MMM dd, yyyy');
      }
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Container>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
            <CircularProgress />
          </Box>
        </Container>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Progress Overview
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {progress && (
          <Grid container spacing={3}>
            {/* Overall Status Card */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="h5" gutterBottom>
                        Overall Progress Status
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Current assessment of overall performance
                      </Typography>
                    </Box>
                    <Chip
                      label={progress.overallStatus}
                      color={getStatusColor(progress.overallStatus)}
                      size="large"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Skills Overview */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Skills Assessment
                </Typography>
                {progress.skills && Object.keys(progress.skills).length > 0 ? (
                  <Box sx={{ mt: 2 }}>
                    {SKILL_CATEGORIES.map((category) => {
                      const skill = progress.skills[category];
                      if (!skill) return null;
                      const level = skill.level || 'Not Assessed';
                      
                      return (
                        <Box key={category} sx={{ mb: 2, pb: 2, borderBottom: '1px solid #e0e0e0' }}>
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {category}
                            </Typography>
                            {level !== 'Not Assessed' && (
                              <Chip label={level} size="small" />
                            )}
                          </Box>
                          {skill.notes && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                              {skill.notes}
                            </Typography>
                          )}
                        </Box>
                      );
                    })}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No skills data available
                  </Typography>
                )}
              </Paper>
            </Grid>

            {/* Recent Feedback */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Recent Feedback
                </Typography>
                {feedback && feedback.length > 0 ? (
                  <Box sx={{ mt: 2 }}>
                    {feedback.slice(0, 5).map((item, index) => (
                      <Accordion key={index} sx={{ mb: 1 }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            Feedback - {formatDate(item.createdAt)}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          {item.strengths && (
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                                Strengths:
                              </Typography>
                              <Typography variant="body2">{item.strengths}</Typography>
                            </Box>
                          )}
                          {item.areasForImprovement && (
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                                Areas for Improvement:
                              </Typography>
                              <Typography variant="body2">{item.areasForImprovement}</Typography>
                            </Box>
                          )}
                          {item.notes && (
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                Additional Notes:
                              </Typography>
                              <Typography variant="body2">{item.notes}</Typography>
                            </Box>
                          )}
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No feedback available
                  </Typography>
                )}
              </Paper>
            </Grid>

            {/* Assignments Summary */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Assignments Summary
                </Typography>
                {progress.assignments && progress.assignments.length > 0 ? (
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={4}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="h4" color="success.main">
                            {progress.assignments.filter(a => a.status === 'Completed').length}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Completed
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="h4" color="info.main">
                            {progress.assignments.filter(a => a.status === 'In Progress').length}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            In Progress
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="h4" color="error.main">
                            {progress.assignments.filter(a => a.status === 'Missing').length}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Missing
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No assignments available
                  </Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
        )}

        {!progress && !loading && (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No progress data available. Please contact your teacher.
            </Typography>
          </Paper>
        )}
      </Container>
    </>
  );
}

export default StudentProgress;
