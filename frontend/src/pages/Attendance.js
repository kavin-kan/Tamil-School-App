import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { format } from 'date-fns';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { getStudentAttendance } from '../services/api';

const STATUS_COLORS = {
  'Present': 'success',
  'Absent': 'error',
  'Late': 'warning'
};

function Attendance() {
  const { currentUser } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ present: 0, absent: 0, late: 0, total: 0 });

  useEffect(() => {
    const studentId = currentUser?.uid;
    if (studentId) {
      fetchAttendance(studentId);
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (attendance.length > 0) {
      const present = attendance.filter(a => a.status === 'Present').length;
      const absent = attendance.filter(a => a.status === 'Absent').length;
      const late = attendance.filter(a => a.status === 'Late').length;
      setStats({ present, absent, late, total: attendance.length });
    }
  }, [attendance]);

  async function fetchAttendance(studentId) {
    try {
      setLoading(true);
      const data = await getStudentAttendance(studentId);
      setAttendance(data);
    } catch (err) {
      setError('Failed to load attendance data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

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

  const attendanceRate = stats.total > 0 ? ((stats.present + stats.late) / stats.total * 100).toFixed(1) : 0;

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
          Attendance
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h4" color="primary">
                  {stats.total}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Days
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h4" color="success.main">
                  {stats.present}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Present
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h4" color="error.main">
                  {stats.absent}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Absent
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h4" color="warning.main">
                  {attendanceRate}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Attendance Rate
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Attendance Table */}
        {attendance.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No attendance records available.
            </Typography>
          </Paper>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Notes</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendance.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{formatDate(record.date)}</TableCell>
                    <TableCell>
                      <Chip
                        label={record.status}
                        color={STATUS_COLORS[record.status]}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{record.notes || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </>
  );
}

export default Attendance;
