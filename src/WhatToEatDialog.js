import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, FormLabel, RadioGroup, Radio, FormControlLabel, Chip, Stack, TextField } from '@mui/material';

const demographicOptions = [
  'Teen', 'Young Adult', 'Adult', 'Senior', 'Pregnant', 'Breastfeeding', 'Other',
];
const cuisineOptions = [
  'African', 'Asian', 'Caribbean', 'European', 'Indian', 'Mediterranean', 'Middle Eastern', 'Latin American', 'American', 'Other',
];
const dietaryOptions = [
  'Vegetarian', 'Vegan', 'Pescatarian', 'Halal', 'Kosher', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Soy-Free', 'Low FODMAP', 'None',
];
const allergyOptions = [
  'Peanuts', 'Tree Nuts', 'Dairy', 'Eggs', 'Fish', 'Shellfish', 'Soy', 'Wheat', 'Sesame', 'Other',
];
const dietTypes = [
  'None', 'Keto', 'Paleo', 'Mediterranean', 'DASH', 'Low-Carb', 'Intermittent Fasting', 'Other',
];

export default function WhatToEatDialog({ open, onClose, onSave, defaultValues }) {
  const [demographic, setDemographic] = useState(defaultValues?.demographic || []);
  const [cuisine, setCuisine] = useState(defaultValues?.cuisine || []);
  const [dietary, setDietary] = useState(defaultValues?.dietary || []);
  const [allergies, setAllergies] = useState(defaultValues?.allergies || []);
  const [dietType, setDietType] = useState(defaultValues?.dietType || '');
  const [otherAllergy, setOtherAllergy] = useState('');
  const [error, setError] = useState('');

  const handleChipToggle = (val, arr, setArr) => {
    if (arr.includes(val)) {
      setArr(arr.filter(v => v !== val));
    } else {
      setArr([...arr, val]);
    }
  };

  const handleSave = () => {
    if (!demographic.length || !cuisine.length || !dietary.length || (!allergies.length && !otherAllergy) || !dietType) {
      setError('Please answer all questions.');
      return;
    }
    const allAllergies = otherAllergy ? [...allergies, otherAllergy] : allergies;
    onSave({ demographic, cuisine, dietary, allergies: allAllergies, dietType });
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
        fontSize: 24,
        color: '#8e24aa',
        letterSpacing: 1,
        textAlign: 'center',
        background: 'linear-gradient(90deg, #b2dfdb 0%, #f8bbd0 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        mb: 1,
      }}>
        Tell us about your eating preferences
      </DialogTitle>
      <DialogContent sx={{ pb: 1 }}>
        <Box mb={3}>
          <FormLabel sx={{ fontWeight: 700, color: '#8e24aa', mb: 1 }}>Demographic</FormLabel>
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
            {demographicOptions.map(opt => (
              <Chip
                key={opt}
                label={opt}
                clickable
                color={demographic.includes(opt) ? 'secondary' : 'default'}
                onClick={() => handleChipToggle(opt, demographic, setDemographic)}
                sx={{
                  mb: 1,
                  bgcolor: demographic.includes(opt) ? '#b2dfdb' : '#f3e5f5',
                  color: demographic.includes(opt) ? '#004d40' : '#6d4c41',
                  fontWeight: 600,
                  fontSize: 15,
                  borderRadius: 2,
                  px: 1.5,
                  py: 0.5,
                  boxShadow: demographic.includes(opt) ? '0 2px 8px 0 #b2dfdb55' : 'none',
                  border: demographic.includes(opt) ? '2px solid #26a69a' : 'none',
                  transition: 'all 0.15s',
                }}
              />
            ))}
          </Stack>
        </Box>
        <Box mb={3}>
          <FormLabel sx={{ fontWeight: 700, color: '#8e24aa', mb: 1 }}>Preferred Cuisine</FormLabel>
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
            {cuisineOptions.map(opt => (
              <Chip
                key={opt}
                label={opt}
                clickable
                color={cuisine.includes(opt) ? 'secondary' : 'default'}
                onClick={() => handleChipToggle(opt, cuisine, setCuisine)}
                sx={{
                  mb: 1,
                  bgcolor: cuisine.includes(opt) ? '#f8bbd0' : '#f3e5f5',
                  color: cuisine.includes(opt) ? '#8e24aa' : '#6d4c41',
                  fontWeight: 600,
                  fontSize: 15,
                  borderRadius: 2,
                  px: 1.5,
                  py: 0.5,
                  boxShadow: cuisine.includes(opt) ? '0 2px 8px 0 #f8bbd055' : 'none',
                  border: cuisine.includes(opt) ? '2px solid #8e24aa' : 'none',
                  transition: 'all 0.15s',
                }}
              />
            ))}
          </Stack>
        </Box>
        <Box mb={3}>
          <FormLabel sx={{ fontWeight: 700, color: '#8e24aa', mb: 1 }}>Dietary Restriction</FormLabel>
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
            {dietaryOptions.map(opt => (
              <Chip
                key={opt}
                label={opt}
                clickable
                color={dietary.includes(opt) ? 'secondary' : 'default'}
                onClick={() => handleChipToggle(opt, dietary, setDietary)}
                sx={{
                  mb: 1,
                  bgcolor: dietary.includes(opt) ? '#fff9c4' : '#f3e5f5',
                  color: dietary.includes(opt) ? '#6d4c41' : '#6d4c41',
                  fontWeight: 600,
                  fontSize: 15,
                  borderRadius: 2,
                  px: 1.5,
                  py: 0.5,
                  boxShadow: dietary.includes(opt) ? '0 2px 8px 0 #fff9c455' : 'none',
                  border: dietary.includes(opt) ? '2px solid #ffd54f' : 'none',
                  transition: 'all 0.15s',
                }}
              />
            ))}
          </Stack>
        </Box>
        <Box mb={3}>
          <FormLabel sx={{ fontWeight: 700, color: '#8e24aa', mb: 1 }}>Allergies</FormLabel>
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
            {allergyOptions.map(opt => (
              <Chip
                key={opt}
                label={opt}
                clickable
                color={allergies.includes(opt) ? 'secondary' : 'default'}
                onClick={() => handleChipToggle(opt, allergies, setAllergies)}
                sx={{
                  mb: 1,
                  bgcolor: allergies.includes(opt) ? '#e57373' : '#f3e5f5',
                  color: allergies.includes(opt) ? '#fff' : '#6d4c41',
                  fontWeight: 600,
                  fontSize: 15,
                  borderRadius: 2,
                  px: 1.5,
                  py: 0.5,
                  boxShadow: allergies.includes(opt) ? '0 2px 8px 0 #e5737355' : 'none',
                  border: allergies.includes(opt) ? '2px solid #e57373' : 'none',
                  transition: 'all 0.15s',
                }}
              />
            ))}
            <TextField
              size="small"
              placeholder="Other allergy"
              value={otherAllergy}
              onChange={e => setOtherAllergy(e.target.value)}
              sx={{ ml: 1, width: 120, bgcolor: '#fff', borderRadius: 2 }}
            />
          </Stack>
        </Box>
        <Box mb={2}>
          <FormLabel sx={{ fontWeight: 700, color: '#8e24aa', mb: 1 }}>Are you already following any diet?</FormLabel>
          <RadioGroup
            value={dietType}
            onChange={e => setDietType(e.target.value)}
            row
            sx={{ ml: 1 }}
          >
            {dietTypes.map(opt => (
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
