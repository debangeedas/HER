import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Chip, Slider, Stack, Paper, IconButton
} from '@mui/material';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import SpaIcon from '@mui/icons-material/Spa';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import NotesIcon from '@mui/icons-material/Notes';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useProfile } from './hooks/useProfile';

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
  const [period, setPeriod] = useState(1);
  const [cuisine, setCuisine] = useState('No preference');
  const [diet, setDiet] = useState('None');
  const [notes, setNotes] = useState('');
  const [profile] = useProfile();

  const handleSubmit = () => {
    onSubmit({ period, cuisine, diet, notes });
  };

  // Helper to format preferences
  const getPrefsSummary = () => {
    if (!profile?.whatToEatPrefs) return null;
    const prefs = profile.whatToEatPrefs;
    const demographic = Array.isArray(prefs.demographic) ? prefs.demographic : [prefs.demographic];
    const cuisineArr = Array.isArray(prefs.cuisine) ? prefs.cuisine : [prefs.cuisine];
    const dietary = Array.isArray(prefs.dietary) ? prefs.dietary : [prefs.dietary];
    const allergies = Array.isArray(prefs.allergies) ? prefs.allergies : [prefs.allergies];
    const dietType = prefs.dietType && prefs.dietType !== 'None' ? prefs.dietType : undefined;
    let cuisineStr = '';
    if (cuisineArr.length === 1) cuisineStr = cuisineArr[0];
    else if (cuisineArr.length === 2) cuisineStr = cuisineArr.join(' and ');
    else if (cuisineArr.length > 2) cuisineStr = cuisineArr.slice(0, -1).join(', ') + ' and ' + cuisineArr[cuisineArr.length - 1];
    let dietaryStr = '';
    if (dietary.length === 0 || (dietary.length === 1 && (dietary[0] === 'None' || !dietary[0]))) {
      dietaryStr = 'no major dietary restrictions';
    } else if (dietary.length === 1) {
      dietaryStr = `${dietary[0].toLowerCase()} restriction`;
    } else {
      dietaryStr = `${dietary.slice(0, -1).map(d => d.toLowerCase()).join(', ')} and ${dietary[dietary.length - 1].toLowerCase()} dietary restrictions`;
    }
    let allergyStr = '';
    if (!allergies.length || (allergies.length === 1 && (!allergies[0] || allergies[0] === 'None'))) {
      allergyStr = 'no major allergies';
    } else if (allergies.length === 1) {
      allergyStr = `${allergies[0].toLowerCase()} allergy`;
    } else {
      allergyStr = `${allergies.slice(0, -1).map(a => a.toLowerCase()).join(', ')} and ${allergies[allergies.length - 1].toLowerCase()} allergies`;
    }
    return `You’re a${demographic.length ? ' ' + demographic.join(' and ') : ''} who loves${cuisineStr ? ' ' + cuisineStr : ''} food.${dietType ? ` You’re on a ${dietType.toLowerCase()} diet,` : ''} ${dietaryStr}, and ${allergyStr}.`;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 900, color: '#8e24aa', fontFamily: 'Quicksand, Arial', pb: 2 }}>Create Meal Plan</DialogTitle>
      <DialogContent sx={{ px: { xs: 2, sm: 5 }, py: 3 }}>
        {/* User Preferences Summary Card */}
        {profile?.whatToEatPrefs && (
          <Paper elevation={3} sx={{ mb: 3, p: 3, borderRadius: 4, background: 'linear-gradient(90deg, #fbeffb 60%, #e3f0ff 100%)', color: '#6d4c41' }}>
            <Typography variant="subtitle2" fontWeight={700} color="#8e24aa" mb={1}>
              Your eating preferences
            </Typography>
            <Typography variant="body2" sx={{ mb: 1.5 }}>{getPrefsSummary()}</Typography>
          </Paper>
        )}
        <Typography variant="subtitle2" color="#8e24aa" fontWeight={700} mb={3}>
          We’ll use this info to personalize your meal plan.
        </Typography>
        {/* Period Selector */}
        <Box mb={3}>
          <Typography variant="body2" fontWeight={700} color="#8e24aa" mb={1.2} display="flex" alignItems="center">
            <AccessTimeIcon sx={{ fontSize: 20, mr: 0.7 }} /> Time period (days)
          </Typography>
          <Slider
            value={period}
            min={1}
            max={14}
            step={1}
            marks={[{ value: 1, label: '1' }, { value: 7, label: '7' }, { value: 14, label: '14' }]}
            valueLabelDisplay="auto"
            onChange={(_, val) => setPeriod(val)}
            sx={{ color: '#8e24aa', mt: 2, mb: 2, mx: 2 }}
          />
        </Box>
        {/* Cuisine Selector */}
        <Box mb={3}>
          <Typography variant="body2" fontWeight={700} color="#8e24aa" mb={1.2} display="flex" alignItems="center">
            <RestaurantMenuIcon sx={{ fontSize: 20, mr: 0.7 }} /> Cuisine preference
          </Typography>
          <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ mt: 1 }}>
            {cuisines.map(option => (
              <Chip
                key={option}
                label={option}
                color={cuisine === option ? 'secondary' : 'default'}
                onClick={() => setCuisine(option)}
                sx={{
                  bgcolor: cuisine === option ? '#f8bbd0' : '#ede7f6',
                  color: cuisine === option ? '#8e24aa' : '#6d4c41',
                  fontWeight: 600,
                  borderRadius: 2,
                  px: 2.5,
                  py: 1.2,
                  fontSize: 17,
                  mb: 1.2,
                  boxShadow: cuisine === option ? '0 1px 6px #f8bbd033' : undefined,
                  cursor: 'pointer',
                }}
              />
            ))}
          </Stack>
        </Box>
        {/* Diet Type Selector */}
        <Box mb={3}>
          <Typography variant="body2" fontWeight={700} color="#8e24aa" mb={1.2} display="flex" alignItems="center">
            <SpaIcon sx={{ fontSize: 20, mr: 0.7 }} /> Diet type
          </Typography>
          <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ mt: 1 }}>
            {diets.map(option => (
              <Chip
                key={option}
                label={option}
                color={diet === option ? 'secondary' : 'default'}
                onClick={() => setDiet(option)}
                sx={{
                  bgcolor: diet === option ? '#b2dfdb' : '#ede7f6',
                  color: diet === option ? '#004d40' : '#6d4c41',
                  fontWeight: 600,
                  borderRadius: 2,
                  px: 2.5,
                  py: 1.2,
                  fontSize: 17,
                  mb: 1.2,
                  boxShadow: diet === option ? '0 1px 6px #b2dfdb33' : undefined,
                  cursor: 'pointer',
                }}
              />
            ))}
          </Stack>
        </Box>
        {/* Notes Field */}
        <Box mb={2.5}>
          <Typography variant="body2" fontWeight={700} color="#8e24aa" mb={1.2} display="flex" alignItems="center">
            <NotesIcon sx={{ fontSize: 20, mr: 0.7 }} /> Notes / Allergies / Restrictions
          </Typography>
          <Paper elevation={1} sx={{ p: 2, borderRadius: 3, bgcolor: '#f3e5f5', mt: 1 }}>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
              style={{
                width: '100%',
                border: 'none',
                background: 'transparent',
                resize: 'vertical',
                fontSize: 16,
                color: '#6d4c41',
                fontFamily: 'inherit',
                outline: 'none',
                padding: 0,
              }}
              placeholder="Add any notes, allergies, or restrictions..."
            />
          </Paper>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 4, pb: 2, pt: 1 }}>
        <Button onClick={onClose} color="secondary" sx={{ fontWeight: 700, borderRadius: 2, px: 2, py: 1 }}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" sx={{ fontWeight: 700, borderRadius: 2, px: 4, py: 1.2 }}>Generate Plan</Button>
      </DialogActions>
    </Dialog>
  );
}

