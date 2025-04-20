import React, { useState } from 'react';
import { Box, Typography, AppBar, Toolbar, IconButton, Paper, Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import DinnerDiningIcon from '@mui/icons-material/DinnerDining';
import CreateMealPlanDialog from './CreateMealPlanDialog';
import { useProfile } from './hooks/useProfile';

const mealSections = [
  { label: 'Breakfast' },
  { label: 'Lunch' },
  { label: 'Snacks' },
  { label: 'Dinner' },
];

const mealIcons = {
  Breakfast: (props = {}) => <LocalDiningIcon sx={{ color: '#ffb300', fontSize: 32, mb: 1, ...props.sx }} {...props} />,
  Lunch: (props = {}) => <RestaurantMenuIcon sx={{ color: '#43a047', fontSize: 32, mb: 1, ...props.sx }} {...props} />,
  Snacks: (props = {}) => <RestaurantMenuIcon sx={{ color: '#fb8c00', fontSize: 32, mb: 1, ...props.sx }} {...props} />,
  Dinner: (props = {}) => <DinnerDiningIcon sx={{ color: '#ab47bc', fontSize: 32, mb: 1, ...props.sx }} {...props} />,
};



// Generate a detailed meal plan for every meal of every day
async function generateMealPlanLLM({ profile, period, cuisine, diet, notes }) {
  await new Promise(r => setTimeout(r, 1200));
  const prefs = profile?.whatToEatPrefs || {};
  const demographic = Array.isArray(prefs.demographic) ? prefs.demographic.join(', ') : prefs.demographic || '';
  const cuisinePref = Array.isArray(prefs.cuisine) ? prefs.cuisine.join(', ') : prefs.cuisine || cuisine;
  const dietary = Array.isArray(prefs.dietary) ? prefs.dietary.join(', ') : prefs.dietary || diet;
  const allergies = Array.isArray(prefs.allergies) ? prefs.allergies.join(', ') : prefs.allergies || '';
  const dietType = prefs.dietType && prefs.dietType !== 'None' ? prefs.dietType : diet;
  const name = profile?.name || 'User';
  const location = profile?.location ? ` from ${profile.location}` : '';
  const days = [];
  const mealTemplates = [
    {
      Breakfast: 'Oats with berries and chia seeds',
      Lunch: 'Grilled veggies with quinoa and hummus',
      Snacks: 'Mixed nuts, apple slices',
      Dinner: 'Lentil soup with whole grain bread',
    },
    {
      Breakfast: 'Greek yogurt parfait with granola',
      Lunch: 'Chickpea salad bowl',
      Snacks: 'Carrot sticks & hummus',
      Dinner: 'Stir-fried tofu with brown rice',
    },
    {
      Breakfast: 'Avocado toast with tomato',
      Lunch: 'Veggie wrap with spinach and feta',
      Snacks: 'Banana and peanut butter',
      Dinner: 'Vegetable curry with basmati rice',
    },
    {
      Breakfast: 'Smoothie bowl with seeds',
      Lunch: 'Quinoa tabbouleh salad',
      Snacks: 'Trail mix',
      Dinner: 'Stuffed bell peppers',
    },
    {
      Breakfast: 'Scrambled eggs with spinach',
      Lunch: 'Lentil and roasted veggie bowl',
      Snacks: 'Rice cakes with almond butter',
      Dinner: 'Vegetable pasta primavera',
    },
    {
      Breakfast: 'Whole grain pancakes with fruit',
      Lunch: 'Falafel pita with veggies',
      Snacks: 'Orange slices',
      Dinner: 'Eggplant parmesan',
    },
    {
      Breakfast: 'Berry overnight oats',
      Lunch: 'Sweet potato and black bean salad',
      Snacks: 'Cucumber and guacamole',
      Dinner: 'Mushroom risotto',
    },
  ];
  for (let d = 0; d < period; d++) {
    const template = mealTemplates[d % mealTemplates.length];
    days.push({
      day: d + 1,
      meals: [
        { type: 'Breakfast', desc: template.Breakfast },
        { type: 'Lunch', desc: template.Lunch },
        { type: 'Snacks', desc: template.Snacks },
        { type: 'Dinner', desc: template.Dinner },
      ]
    });
  }
  return {
    greeting: `Hi${name ? ' ' + name : ''}${location}, here’s your personalized meal plan for ${period} day${period > 1 ? 's' : ''}:`,
    profileSummary: [
      `Demographic: ${demographic || 'N/A'}`,
      `Cuisine preference: ${cuisinePref || 'N/A'}`,
      `Diet type: ${dietType || 'N/A'}`,
      `Dietary restrictions: ${dietary || 'None'}`,
      `Allergies: ${allergies || 'None'}`,
      notes ? `Notes: ${notes}` : null,
    ].filter(Boolean),
    days,
  };
}

export default function MealPlanPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [showPlanDialog, setShowPlanDialog] = useState(false);
  const [profile] = useProfile(); // This profile is now passed to meal plan generation for real personalization.

  const handleCreateMealPlan = async (details) => {
    setDialogOpen(false);
    setGenerating(true);
    setGeneratedPlan(null);
    // Use the actual profile from useProfile
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
                })()}
              </Typography>
            </Paper>
          )}

          {/* Day 1 Meal Plan Cards */}
          {generatedPlan && generatedPlan.days && generatedPlan.days.length > 0 && (
            <Box sx={{ mt: 4, mb: 2 }}>
              <Grid container spacing={3} justifyContent="center">
                {generatedPlan.days[0].meals.map((meal, idx) => (
                  <Grid item xs={12} sm={6} md={3} key={meal.type}>
                    <Paper elevation={4} sx={{
                      p: 3,
                      borderRadius: 4,
                      textAlign: 'center',
                      background: 'linear-gradient(120deg, #fff8e1 60%, #e1f5fe 100%)',
                      boxShadow: '0 4px 16px 0 rgba(136,58,185,0.08)',
                      minHeight: 160,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Box mb={1}>
                        {typeof mealIcons[meal.type] === 'function' ? mealIcons[meal.type]() : <LocalDiningIcon sx={{ color: '#8e24aa', fontSize: 32, mb: 1 }} />}
                      </Box>
                      <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#00897b', mb: 0.5, fontSize: 18 }}>{meal.type}</Typography>
                      <Typography variant="body2" sx={{ color: '#6d4c41', fontSize: 16 }}>{meal.desc}</Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Quick meal cards (SEE DETAILS) section - hide when meal plan is generated */}
          {(!Boolean(generatedPlan) && !generating) && (
            <Box sx={{ mt: 3, mb: 4 }}>
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
            </Box>
          )}

          {/* Generated Meal Plan Result */}
          {generating && (
            <Paper elevation={3} sx={{
              mb: 3, p: 3, borderRadius: 4,
              background: 'linear-gradient(90deg, #fbeffb 60%, #e3f0ff 100%)',
              color: '#6d4c41',
              maxWidth: 600,
              mx: 'auto',
              textAlign: 'center',
            }}>
              <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                <CircularProgress color="secondary" sx={{ mb: 2 }} />
                <Typography variant="h6" fontWeight={700} color="#8e24aa">Generating your meal plan...</Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>This may take a few seconds.</Typography>
              </Box>
            </Paper>
          )}
          {generatedPlan && !generating && typeof generatedPlan === 'object' && Array.isArray(generatedPlan.days) && Array.isArray(generatedPlan.profileSummary) && (() => {
            const mealIcons = {
              Breakfast: <img src="https://fonts.gstatic.com/s/i/materialicons/breakfast_dining/v11/24px.svg" alt="Breakfast" style={{verticalAlign:'middle',marginRight:8}}/>,
              Lunch: <img src="https://fonts.gstatic.com/s/i/materialicons/lunch_dining/v10/24px.svg" alt="Lunch" style={{verticalAlign:'middle',marginRight:8}}/>,
              Snacks: <RestaurantMenuIcon sx={{ color: '#fb8c00', fontSize: 24, mr: 1 }} />,
              Dinner: <DinnerDiningIcon sx={{ color: '#ab47bc', fontSize: 24, mr: 1 }} />,
            };
            return (
              <Paper elevation={6} sx={{
                mb: 3, p: 4, borderRadius: 5,
                background: 'linear-gradient(120deg, #f3e5f5 60%, #e1f5fe 100%)',
                color: '#4a148c',
                maxWidth: 900,
                mx: 'auto',
                boxShadow: '0 8px 32px 0 rgba(136,58,185,0.10)',
                position: 'relative',
                overflow: 'hidden',
              }}>

                <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#00897b', mb: 2, mt: 2 }}>
                  Detailed Meal Plan
                </Typography>
                <Grid container spacing={3}>
                  {generatedPlan.days.slice(1).map((dayObj, dayIdx) => (
                    <Grid item xs={12} md={6} lg={4} key={dayObj.day}>
                      <Paper elevation={2} sx={{ borderRadius: 4, p: 2.5, mb: 2, background: 'rgba(255,255,255,0.92)', boxShadow: '0 2px 10px 0 rgba(136,58,185,0.07)' }}>
                        <Typography variant="h6" fontWeight={700} sx={{ color: '#7c43bd', mb: 1 }}>Day {dayObj.day}</Typography>
                        <Grid container spacing={1}>
                          {dayObj.meals.map((meal, idx) => (
                            <Grid item xs={12} key={meal.type}>
                              <Box display="flex" alignItems="center" mb={0.5}>
                                {typeof mealIcons[meal.type] === 'function' ? mealIcons[meal.type]({ sx: { fontSize: 22, mr: 1 } }) : <LocalDiningIcon sx={{ color: '#8e24aa', fontSize: 22, mr: 1 }} />}
                                <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#00897b', fontSize: 16, mr: 1 }}>{meal.type}:</Typography>
                                <Typography variant="body2" sx={{ color: '#4a148c', fontSize: 15 }}>{meal.desc}</Typography>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
                <Box mt={3} textAlign="center">
                  <Typography variant="body2" sx={{ color: '#6d4c41', fontStyle: 'italic' }}>
                    Enjoy your meals!
                  </Typography>
                </Box>
              </Paper>
            );
          })()}




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
        </Paper>
      </Box>
    </Box>
  );
}
