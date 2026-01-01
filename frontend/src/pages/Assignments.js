import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { format } from 'date-fns';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { getStudentAssignments } from '../services/api';

const STATUS_COLORS = {
  'Completed': 'success',
  'In Progress': 'info',
  'Missing': 'error'
};

function Assignments() {
  const { currentUser } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const studentId = currentUser?.uid;
    if (studentId) {
      fetchAssignments(studentId);
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  async function fetchAssignments(studentId) {
    try {
      setLoading(true);
      const data = await getStudentAssignments(studentId);
      setAssignments(data);
    } catch (err) {
      setError('Failed to load assignments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleAssignmentClick = (assignment) => {
    setSelectedAssignment(assignment);
    setDialogOpen(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date specified';
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

  const groupedAssignments = {
    'In Progress': assignments.filter(a => a.status === 'In Progress'),
    'Completed': assignments.filter(a => a.status === 'Completed'),
    'Missing': assignments.filter(a => a.status === 'Missing')
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Assignments
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {assignments.length === 0 && !loading ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No assignments available.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {Object.entries(groupedAssignments).map(([status, statusAssignments]) => (
              <Grid item xs={12} key={status}>
                <Paper sx={{ p: 2 }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Chip
                      label={`${status} (${statusAssignments.length})`}
                      color={STATUS_COLORS[status]}
                      sx={{ mr: 2 }}
                    />
                  </Box>
                  <Grid container spacing={2}>
                    {statusAssignments.map((assignment) => (
                      <Grid item xs={12} sm={6} md={4} key={assignment.id}>
                        <Card
                          sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }}
                          onClick={() => handleAssignmentClick(assignment)}
                        >
                          <CardContent>
                            <Typography variant="h6" gutterBottom>
                              {assignment.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Type: {assignment.type || 'homework'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Due: {formatDate(assignment.dueDate)}
                            </Typography>
                            {assignment.description && (
                              <Typography
                                variant="body2"
                                sx={{
                                  mt: 1,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical'
                                }}
                              >
                                {assignment.description}
                              </Typography>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Assignment Detail Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
          {selectedAssignment && (
            <>
              <DialogTitle>{selectedAssignment.title}</DialogTitle>
              <DialogContent>
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={selectedAssignment.status}
                    color={STATUS_COLORS[selectedAssignment.status]}
                    sx={{ mb: 2 }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Type:</strong> {selectedAssignment.type || 'homework'}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Due Date:</strong> {formatDate(selectedAssignment.dueDate)}
                </Typography>
                {selectedAssignment.description && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Description:
                    </Typography>
                    <Typography variant="body2">{selectedAssignment.description}</Typography>
                  </Box>
                )}
                {selectedAssignment.comments && selectedAssignment.comments.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Teacher Comments:
                    </Typography>
                    {selectedAssignment.comments.map((comment, index) => (
                      <Paper key={index} sx={{ p: 1, mt: 1, bgcolor: 'background.default' }}>
                        <Typography variant="body2">{comment}</Typography>
                      </Paper>
                    ))}
                  </Box>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setDialogOpen(false)}>Close</Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Container>
    </>
  );
}

export default Assignments;
