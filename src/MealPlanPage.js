import React, { useState } from 'react';
import { Box, Typography, AppBar, Toolbar, IconButton, Paper, Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CreateMealPlanDialog from './CreateMealPlanDialog';
import { useProfile } from './hooks/useProfile';

const mealSections = [
  { label: 'Breakfast' },
  { label: 'Lunch' },
  { label: 'Snacks' },
  { label: 'Dinner' },
];

// Stub: fetch user profile from localStorage/sessionStorage or set defaults
function getUserProfile() {
  // This should be replaced by real logic later
  return {
    age: 28,
    location: 'Bangalore',
    occupation: 'Desk job',
    cycleRegularity: 'Yes',
    conditions: ['None'],
  };
}

// Stub: Call a free LLM API (e.g., OpenRouter, HuggingFace Inference) to generate a plan
async function generateMealPlanLLM({ profile, period, cuisine, diet, notes }) {
  // For now, simulate with a delay and a fake plan
  await new Promise(r => setTimeout(r, 1800));
  return `Meal Plan for ${period} day(s)\n\nBreakfast: Oats with berries\nLunch: Grilled veggies with quinoa\nSnacks: Mixed nuts and fruit\nDinner: Lentil soup with whole grain bread\n\n(Cuisine: ${cuisine}, Diet: ${diet}, Notes: ${notes})\nBased on your profile: Age ${profile.age}, Location ${profile.location}, Occupation ${profile.occupation}`;
}

export default function MealPlanPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [showPlanDialog, setShowPlanDialog] = useState(false);
  const [profile] = useProfile();

  const handleCreateMealPlan = async (details) => {
    setDialogOpen(false);
    setGenerating(true);
    setGeneratedPlan(null);
    const profile = getUserProfile();
    try {
      const plan = await generateMealPlanLLM({ profile, ...details });
      setGeneratedPlan(plan);
      setShowPlanDialog(true);
    } catch (e) {
      setGeneratedPlan('Failed to generate plan. Please try again.');
      setShowPlanDialog(true);
    }
    setGenerating(false);
  };

  return (
    <Box
      minHeight="100vh"
      sx={{
        background: 'linear-gradient(135deg, #fbeffb 0%, #e3f0ff 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative background motif */}
      <Box
        sx={{
          position: 'absolute',
          top: -120,
          right: -120,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #e1bee7 40%, transparent 80%)',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -100,
          left: -100,
          width: 250,
          height: 250,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #b3e5fc 40%, transparent 80%)',
          zIndex: 0,
        }}
      />
      <AppBar position="static" color="transparent" elevation={0} sx={{ zIndex: 1 }}>
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 900, letterSpacing: 2, fontFamily: 'Quicksand, Arial', color: '#8e24aa' }}>
            HER
          </Typography>
          <IconButton color="inherit">
            <AccountCircleIcon sx={{ fontSize: 32, color: '#8e24aa' }} />
            <Typography variant="body1" sx={{ ml: 1, color: '#8e24aa', fontWeight: 600 }}>
              Profile
            </Typography>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box display="flex" flexDirection="column" alignItems="center" mt={6} sx={{ zIndex: 1, position: 'relative' }}>
        <Paper
          elevation={5}
          sx={{
            px: { xs: 2, sm: 6 },
            py: { xs: 3, sm: 5 },
            borderRadius: 6,
            bgcolor: 'rgba(255,255,255,0.95)',
            boxShadow: '0 8px 32px 0 rgba(140, 90, 180, 0.15)',
            mb: 4,
            minWidth: { xs: '90vw', sm: 500 },
            maxWidth: 700,
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h4"
            fontWeight={900}
            sx={{ color: '#8e24aa', fontFamily: 'Quicksand, Arial', mb: 3 }}
          >
            Today's Meal Plan
          </Typography>
          <Grid container spacing={3} justifyContent="center" sx={{ mb: 3 }}>
            {mealSections.map((meal) => (
              <Grid item xs={12} sm={6} md={3} key={meal.label}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 2,
                    borderRadius: 4,
                    minHeight: 120,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    bgcolor: '#f3e5f5',
                  }}
                >
                  <Typography variant="h6" fontWeight={700} sx={{ color: '#6d4c41', mb: 2 }}>
                    {meal.label}
                  </Typography>
                  <Button
                    endIcon={<ArrowForwardIosIcon />}
                    sx={{
                      fontWeight: 600,
                      color: '#8e24aa',
                      bgcolor: '#ede7f6',
                      borderRadius: 3,
                      px: 2,
                      py: 0.5,
                      mt: 1,
                      '&:hover': {
                        bgcolor: '#d1c4e9',
                        color: '#4a148c',
                      },
                    }}
                  >
                    See details
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* What To Eat Preferences Summary */}
          {profile?.whatToEatPrefs && (
            <Paper elevation={4} sx={{
              mt: 1, mb: 3, p: 2.5, borderRadius: 4,
              background: 'linear-gradient(120deg, #e3f0ff 60%, #fbeffb 100%)',
              boxShadow: '0 4px 24px 0 rgba(248,187,208,0.10)',
              color: '#6d4c41',
              textAlign: 'left',
              maxWidth: 600,
              mx: 'auto',
            }}>
              <Box mb={1}></Box>
              <Typography variant="body1" sx={{ fontWeight: 500, color: '#4a148c' }}>
                {(() => {
                  const prefs = profile.whatToEatPrefs;
                  // Demographic
                  const demographic = Array.isArray(prefs.demographic) ? prefs.demographic : [prefs.demographic];
                  const demographicStr = demographic.filter(Boolean).join(' and ');
                  // Cuisine
                  const cuisine = Array.isArray(prefs.cuisine) ? prefs.cuisine : [prefs.cuisine];
                  let cuisineStr = '';
                  if (cuisine.length === 1) cuisineStr = cuisine[0];
                  else if (cuisine.length === 2) cuisineStr = cuisine.join(' and ');
                  else if (cuisine.length > 2) cuisineStr = cuisine.slice(0, -1).join(', ') + ' and ' + cuisine[cuisine.length - 1];
                  // Diet Type
                  const dietType = prefs.dietType && prefs.dietType !== 'None' ? prefs.dietType : undefined;
                  // Dietary Restrictions
                  const dietary = Array.isArray(prefs.dietary) ? prefs.dietary : [prefs.dietary];
                  let dietaryStr = '';
                  if (dietary.length === 0 || (dietary.length === 1 && (dietary[0] === 'None' || !dietary[0]))) {
                    dietaryStr = 'have no major dietary restrictions';
                  } else if (dietary.length === 1) {
                    dietaryStr = `have a ${dietary[0].toLowerCase()} restriction`;
                  } else {
                    dietaryStr = `have ${dietary.slice(0, -1).map(d => d.toLowerCase()).join(', ')} and ${dietary[dietary.length - 1].toLowerCase()} dietary restrictions`;
                  }
                  // Allergies
                  const allergies = Array.isArray(prefs.allergies) ? prefs.allergies : [prefs.allergies];
                  let allergyStr = '';
                  if (!allergies.length || (allergies.length === 1 && (!allergies[0] || allergies[0] === 'None'))) {
                    allergyStr = 'have no major allergies';
                  } else if (allergies.length === 1) {
                    allergyStr = `do have a ${allergies[0].toLowerCase()} allergy`;
                  } else {
                    allergyStr = `do have ${allergies.slice(0, -1).map(a => a.toLowerCase()).join(', ')} and ${allergies[allergies.length - 1].toLowerCase()} allergies`;
                  }
                  return `You’re a${demographicStr ? ' ' + demographicStr : ''} who loves${cuisineStr ? ' ' + cuisineStr : ''} food.${dietType ? ` You’re on a ${dietType.toLowerCase()} diet,` : ''} ${dietaryStr}, and ${allergyStr}.`;
                })()}
              </Typography>
            </Paper>
          )}

          <Button
            variant="outlined"
            startIcon={<AddCircleOutlineIcon />}
            sx={{
              mt: 2,
              fontWeight: 700,
              fontSize: 18,
              borderRadius: 3,
              color: '#26a69a',
              borderColor: '#26a69a',
              px: 4,
              py: 1.2,
              '&:hover': {
                bgcolor: '#e0f2f1',
                borderColor: '#00897b',
                color: '#00897b',
              },
            }}
            onClick={() => setDialogOpen(true)}
          >
            Create a meal plan
          </Button>
          <CreateMealPlanDialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            onSubmit={handleCreateMealPlan}
          />
          <Dialog open={generating} maxWidth="xs" fullWidth>
            <DialogTitle>Generating your meal plan...</DialogTitle>
            <DialogContent sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress color="secondary" />
              <Typography mt={2}>Please wait</Typography>
            </DialogContent>
          </Dialog>
          <Dialog open={showPlanDialog} onClose={() => setShowPlanDialog(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Your Personalized Meal Plan</DialogTitle>
            <DialogContent>
              <Typography component="pre" fontFamily="monospace" whiteSpace="pre-wrap">
                {generatedPlan}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowPlanDialog(false)} color="primary">Close</Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </Box>
    </Box>
  );
}
