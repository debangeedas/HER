import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, FormControl, FormLabel, RadioGroup, Radio, FormControlLabel, Chip, Stack } from '@mui/material';

const unwindOptions = [
  'Read a book',
  'Listen to music',
  'Meditate',
  'Take a walk',
  'Watch a movie',
  'Journal',
  'Spend time with friends',
  'Other',
];
const exerciseOptions = [
  'Yoga',
  'Walking',
  'Running',
  'Cycling',
  'Dancing',
  'HIIT',
  'Pilates',
  'Strength Training',
  'Other',
];
const frequencyOptions = [
  'Rarely',
  '1-2 times/week',
  '3-4 times/week',
  '5+ times/week',
];

export default function WhatToDoDialog({ open, onClose, onSave, defaultValues }) {
  const [unwind, setUnwind] = useState(defaultValues?.unwind || []);
  const [exercise, setExercise] = useState(defaultValues?.exercise || []);
  const [frequency, setFrequency] = useState(defaultValues?.frequency || '');
  const [error, setError] = useState('');

  // Ensure arrays for multi-select
  const unwindVals = Array.isArray(unwind) ? unwind : unwind ? [unwind] : [];
  const exerciseVals = Array.isArray(exercise) ? exercise : exercise ? [exercise] : [];

  const handleChipToggle = (val, arr, setArr) => {
    if (arr.includes(val)) {
      setArr(arr.filter(v => v !== val));
    } else {
      setArr([...arr, val]);
    }
  };

  const handleSave = () => {
    if (!unwindVals.length || !exerciseVals.length || !frequency) {
      setError('Please answer all questions.');
      return;
    }
    onSave({ unwind: unwindVals, exercise: exerciseVals, frequency });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{
      sx: {
        borderRadius: 4,
        background: 'linear-gradient(135deg, #fbeffb 0%, #e3f0ff 100%)',
        boxShadow: '0 8px 32px 0 rgba(140,90,180,0.13)',
      }
    }}>
      <DialogTitle sx={{
        fontWeight: 900,
        fontSize: 26,
        color: '#8e24aa',
        letterSpacing: 1,
        textAlign: 'center',
        background: 'linear-gradient(90deg, #f8bbd0 0%, #b2dfdb 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        mb: 1,
      }}>
        Tell us about your preferences
      </DialogTitle>
      <DialogContent sx={{ pb: 1 }}>
        <Box mb={3}>
          <FormLabel sx={{ fontWeight: 700, color: '#8e24aa', mb: 1 }}>How do you want to unwind?</FormLabel>
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
            {unwindOptions.map(opt => (
              <Chip
                key={opt}
                label={opt}
                clickable
                color={unwindVals.includes(opt) ? 'secondary' : 'default'}
                onClick={() => handleChipToggle(opt, unwindVals, setUnwind)}
                sx={{
                  mb: 1,
                  bgcolor: unwindVals.includes(opt) ? '#f8bbd0' : '#f3e5f5',
                  color: unwindVals.includes(opt) ? '#8e24aa' : '#6d4c41',
                  fontWeight: 600,
                  fontSize: 15,
                  borderRadius: 2,
                  px: 1.5,
                  py: 0.5,
                  boxShadow: unwindVals.includes(opt) ? '0 2px 8px 0 #f8bbd055' : 'none',
                  border: unwindVals.includes(opt) ? '2px solid #8e24aa' : 'none',
                  transition: 'all 0.15s',
                }}
              />
            ))}
          </Stack>
        </Box>
        <Box mb={3}>
          <FormLabel sx={{ fontWeight: 700, color: '#8e24aa', mb: 1 }}>What kind of exercises do you prefer?</FormLabel>
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
            {exerciseOptions.map(opt => (
              <Chip
                key={opt}
                label={opt}
                clickable
                color={exerciseVals.includes(opt) ? 'secondary' : 'default'}
                onClick={() => handleChipToggle(opt, exerciseVals, setExercise)}
                sx={{
                  mb: 1,
                  bgcolor: exerciseVals.includes(opt) ? '#b2dfdb' : '#f3e5f5',
                  color: exerciseVals.includes(opt) ? '#004d40' : '#6d4c41',
                  fontWeight: 600,
                  fontSize: 15,
                  borderRadius: 2,
                  px: 1.5,
                  py: 0.5,
                  boxShadow: exerciseVals.includes(opt) ? '0 2px 8px 0 #b2dfdb55' : 'none',
                  border: exerciseVals.includes(opt) ? '2px solid #26a69a' : 'none',
                  transition: 'all 0.15s',
                }}
              />
            ))}
          </Stack>
        </Box>
        <Box mb={2}>
          <FormLabel sx={{ fontWeight: 700, color: '#8e24aa', mb: 1 }}>How often do you exercise?</FormLabel>
          <RadioGroup
            value={frequency}
            onChange={e => setFrequency(e.target.value)}
            row
            sx={{ ml: 1 }}
          >
            {frequencyOptions.map(opt => (
              <FormControlLabel key={opt} value={opt} control={<Radio color="secondary" />} label={opt} />
            ))}
          </RadioGroup>
        </Box>
        {error && <Typography color="error" mb={1}>{error}</Typography>}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="secondary" sx={{ fontWeight: 600, borderRadius: 2 }}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary" sx={{ fontWeight: 700, borderRadius: 2, px: 3 }}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
