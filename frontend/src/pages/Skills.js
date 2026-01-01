import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Chip,
  Card,
  CardContent,
  LinearProgress
} from '@mui/material';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { getStudentSkills } from '../services/api';

const SKILL_CATEGORIES = [
  'Tamil Reading',
  'Tamil Writing',
  'Tamil Speaking and Pronunciation',
  'Grammar and Vocabulary',
  'Cultural Knowledge',
  'Participation and Effort'
];

const SKILL_LEVELS = ['Advanced', 'Proficient', 'Developing', 'Beginning'];
const LEVEL_COLORS = {
  'Advanced': 'success',
  'Proficient': 'info',
  'Developing': 'warning',
  'Beginning': 'error'
};

function Skills() {
  const { currentUser } = useAuth();
  const [skills, setSkills] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const studentId = currentUser?.uid;
    if (studentId) {
      fetchSkills(studentId);
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  async function fetchSkills(studentId) {
    try {
      setLoading(true);
      const data = await getStudentSkills(studentId);
      setSkills(data);
    } catch (err) {
      setError('Failed to load skills data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const getLevelValue = (level) => {
    const values = { 'Advanced': 4, 'Proficient': 3, 'Developing': 2, 'Beginning': 1 };
    return values[level] || 0;
  };

  const getLevelPercentage = (level) => {
    return (getLevelValue(level) / 4) * 100;
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
          Skills Assessment
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Grid container spacing={3}>
          {SKILL_CATEGORIES.map((category) => {
            const skill = skills[category];
            const level = skill?.level || 'Not Assessed';
            const notes = skill?.notes || '';

            return (
              <Grid item xs={12} md={6} key={category}>
                <Card>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="h6">{category}</Typography>
                      {level !== 'Not Assessed' && (
                        <Chip
                          label={level}
                          color={LEVEL_COLORS[level] || 'default'}
                          size="small"
                        />
                      )}
                    </Box>

                    {level !== 'Not Assessed' ? (
                      <>
                        <LinearProgress
                          variant="determinate"
                          value={getLevelPercentage(level)}
                          sx={{ height: 8, borderRadius: 4, mb: 2 }}
                        />
                        {notes && (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                            <strong>Notes:</strong> {notes}
                          </Typography>
                        )}
                      </>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        This skill has not been assessed yet.
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        <Box sx={{ mt: 4, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            Skill Levels Explained
          </Typography>
          <Grid container spacing={2}>
            {SKILL_LEVELS.map((level) => (
              <Grid item xs={12} sm={6} md={3} key={level}>
                <Box>
                  <Chip label={level} color={LEVEL_COLORS[level]} size="small" sx={{ mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {level === 'Advanced' && 'Mastery level performance'}
                    {level === 'Proficient' && 'Solid understanding and application'}
                    {level === 'Developing' && 'Growing competency with support'}
                    {level === 'Beginning' && 'Initial learning stage'}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </>
  );
}

export default Skills;
