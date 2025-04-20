import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Typography, Box
} from '@mui/material';

const cuisines = [
  'No preference',
  'Indian',
  'Mediterranean',
  'Asian',
  'Continental',
  'Vegan',
  'Other',
];

const diets = [
  'None',
  'Vegetarian',
  'Vegan',
  'Keto',
  'Paleo',
  'Gluten-Free',
  'Low-Carb',
  'Other',
];

export default function CreateMealPlanDialog({ open, onClose, onSubmit }) {
  const [period, setPeriod] = useState('1');
  const [cuisine, setCuisine] = useState('No preference');
  const [diet, setDiet] = useState('None');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    onSubmit({ period, cuisine, diet, notes });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Create Meal Plan</DialogTitle>
      <DialogContent>
        <Box mb={2}>
          <TextField
            label="Time period (days)"
            type="number"
            value={period}
            onChange={e => setPeriod(e.target.value)}
            inputProps={{ min: 1, max: 30 }}
            fullWidth
            required
          />
        </Box>
        <Box mb={2}>
          <TextField
            select
            label="Cuisine preference"
            value={cuisine}
            onChange={e => setCuisine(e.target.value)}
            fullWidth
          >
            {cuisines.map(option => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </TextField>
        </Box>
        <Box mb={2}>
          <TextField
            select
            label="Diet type"
            value={diet}
            onChange={e => setDiet(e.target.value)}
            fullWidth
          >
            {diets.map(option => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </TextField>
        </Box>
        <Box mb={2}>
          <TextField
            label="Notes / Allergies / Restrictions"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            fullWidth
            multiline
            minRows={2}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">Generate Plan</Button>
      </DialogActions>
    </Dialog>
  );
}
