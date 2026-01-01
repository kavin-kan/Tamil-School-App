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
  Chip
} from '@mui/material';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { getStudentProgress } from '../services/api';

function Dashboard() {
  const { currentUser } = useAuth();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // TODO: Get student ID from user profile
    const studentId = currentUser?.uid; // Placeholder - should get from user profile
    
    if (studentId) {
      fetchProgress(studentId);
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  async function fetchProgress(studentId) {
    try {
      setLoading(true);
      const data = await getStudentProgress(studentId);
      setProgress(data);
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
          Dashboard
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {progress && (
          <Grid container spacing={3}>
            {/* Overall Status */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5">
                      Overall Progress Status
                    </Typography>
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
                  Skills Overview
                </Typography>
                {progress.skills && Object.keys(progress.skills).length > 0 ? (
                  <Box sx={{ mt: 2 }}>
                    {Object.entries(progress.skills).map(([category, skill]) => (
                      <Box key={category} sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          {category}
                        </Typography>
                        <Chip
                          label={skill.level || 'Not Assessed'}
                          size="small"
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                    ))}
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
                {progress.recentFeedback && progress.recentFeedback.length > 0 ? (
                  <Box sx={{ mt: 2 }}>
                    {progress.recentFeedback.map((feedback, index) => (
                      <Box key={index} sx={{ mb: 2, pb: 2, borderBottom: '1px solid #e0e0e0' }}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          Strengths:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {feedback.strengths || 'No strengths noted'}
                        </Typography>
                        {feedback.areasForImprovement && (
                          <>
                            <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 1 }}>
                              Areas for Improvement:
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {feedback.areasForImprovement}
                            </Typography>
                          </>
                        )}
                      </Box>
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
                  <Box sx={{ mt: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">
                          Completed
                        </Typography>
                        <Typography variant="h4">
                          {progress.assignments.filter(a => a.status === 'Completed').length}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">
                          In Progress
                        </Typography>
                        <Typography variant="h4">
                          {progress.assignments.filter(a => a.status === 'In Progress').length}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">
                          Missing
                        </Typography>
                        <Typography variant="h4">
                          {progress.assignments.filter(a => a.status === 'Missing').length}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
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

export default Dashboard;

