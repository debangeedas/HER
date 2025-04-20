import React from 'react';
import { Box, Typography, Button, AppBar, Toolbar, Tabs, Tab, Paper, Grid, IconButton, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import { useProfile } from './hooks/useProfile';
import { getCurrentCyclePhase } from './utils/cyclePhase';
import WhatToDoDialog from './WhatToDoDialog';
import WhatToEatDialog from './WhatToEatDialog';

function PhaseInfoCard({ phase }) {
  if (!phase) {
    return (
      <Paper elevation={2} sx={{ mt: 2, p: 3, borderRadius: 4, bgcolor: '#f3e5f5', color: '#6d4c41' }}>
        <Typography variant="h6" fontWeight={700} color="#8e24aa" mb={1}>How does this work?</Typography>
        <Typography variant="body1">Once you enter your cycle info, you'll get personalized insights for each phase of your cycle—routines, nutrition, and more!</Typography>
      </Paper>
    );
  }
  // Open source SVG illustrations (gentle, modern)
  const illustrations = {
    Menstrual: (
      <svg width="90" height="90" viewBox="0 0 90 90" aria-label="Menstrual phase illustration" style={{ display: 'block' }}>
        <ellipse cx="45" cy="45" rx="32" ry="32" fill="#fde0dc" />
        <ellipse cx="45" cy="60" rx="18" ry="9" fill="#e57373" opacity="0.7" />
        <circle cx="45" cy="45" r="13" fill="#e57373" />
        <ellipse cx="45" cy="52" rx="5" ry="2.5" fill="#fff" opacity="0.7" />
      </svg>
    ),
    Follicular: (
      <svg width="90" height="90" viewBox="0 0 90 90" aria-label="Follicular phase illustration" style={{ display: 'block' }}>
        <ellipse cx="45" cy="45" rx="32" ry="32" fill="#e3f2fd" />
        <ellipse cx="45" cy="60" rx="18" ry="9" fill="#64b5f6" opacity="0.7" />
        <circle cx="45" cy="40" r="13" fill="#64b5f6" />
        <rect x="40" y="30" width="10" height="20" rx="5" fill="#fff" opacity="0.3" />
      </svg>
    ),
    Ovulatory: (
      <svg width="90" height="90" viewBox="0 0 90 90" aria-label="Ovulatory phase illustration" style={{ display: 'block' }}>
        <ellipse cx="45" cy="45" rx="32" ry="32" fill="#fffde7" />
        <ellipse cx="45" cy="60" rx="18" ry="9" fill="#ffd54f" opacity="0.7" />
        <circle cx="45" cy="38" r="13" fill="#ffd54f" />
        <ellipse cx="45" cy="45" rx="6" ry="2.5" fill="#fff" opacity="0.7" />
      </svg>
    ),
    Luteal: (
      <svg width="90" height="90" viewBox="0 0 90 90" aria-label="Luteal phase illustration" style={{ display: 'block' }}>
        <ellipse cx="45" cy="45" rx="32" ry="32" fill="#f3e5f5" />
        <ellipse cx="45" cy="60" rx="18" ry="9" fill="#ba68c8" opacity="0.7" />
        <circle cx="45" cy="45" r="13" fill="#ba68c8" />
        <ellipse cx="45" cy="52" rx="5" ry="2.5" fill="#fff" opacity="0.7" />
      </svg>
    ),
  };
  const phaseInfo = {
    Menstrual: {
      color: '#e57373',
      emoji: '🩸',
      title: 'Menstrual Phase',
      desc: 'This is your period. Rest, hydrate, and nourish your body. Gentle movement and self-care are best.',
      learn: 'https://helloclue.com/articles/cycle-a-z/menstrual-phase'
    },
    Follicular: {
      color: '#64b5f6',
      emoji: '🌱',
      title: 'Follicular Phase',
      desc: 'Energy rises. Great time for creativity, learning, and starting new projects. Try new workouts or routines!',
      learn: 'https://helloclue.com/articles/cycle-a-z/follicular-phase'
    },
    Ovulatory: {
      color: '#ffd54f',
      emoji: '🌼',
      title: 'Ovulatory Phase',
      desc: 'You are at your peak—social, confident, and energetic. Connect, collaborate, and shine!',
      learn: 'https://helloclue.com/articles/cycle-a-z/ovulation'
    },
    Luteal: {
      color: '#ba68c8',
      emoji: '🌙',
      title: 'Luteal Phase',
      desc: 'Wind down, reflect, and focus on self-care. Prioritize sleep, nutrition, and stress management.',
      learn: 'https://helloclue.com/articles/cycle-a-z/luteal-phase'
    }
  };
  const info = phaseInfo[phase];
  return (
    <Paper elevation={2} sx={{ mt: 2, p: 3, borderRadius: 4, bgcolor: info.color + '22', color: info.color }}>
      <Box display="flex" alignItems="center" flexDirection={{ xs: 'column', sm: 'row' }}>
        <Box mr={{ sm: 3 }} mb={{ xs: 2, sm: 0 }}>
          {illustrations[phase]}
        </Box>
        <Box flex={1} textAlign={{ xs: 'center', sm: 'left' }}>
          <Typography variant="h5" fontWeight={700} mb={1}>{info.title} {info.emoji}</Typography>
          <Typography variant="body1" fontWeight={500} mb={2}>{info.desc}</Typography>
          <Button href={info.learn} target="_blank" rel="noopener" variant="outlined" color="secondary" size="small" sx={{ fontWeight: 600 }}>
            Learn more about this phase
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}


const phaseTabs = [
  { label: 'Menstrual' },
  { label: 'Follicular' },
  { label: 'Ovulatory' },
  { label: 'Luteal' },
];

export default function LandingPage({ currentPhase = 'Follicular' }) {
  const [tab, setTab] = React.useState(1);
  const theme = useTheme();
  const navigate = useNavigate();
  const [profile, updateProfile] = useProfile();
  const [showWhatToDo, setShowWhatToDo] = React.useState(false);
  const [showWhatToEat, setShowWhatToEat] = React.useState(false);
  const phase = getCurrentCyclePhase(profile);

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
          <IconButton color="inherit" onClick={() => navigate('/profile')}>
            <AccountCircleIcon sx={{ fontSize: 32, color: '#8e24aa' }} />
            <Typography variant="body1" sx={{ ml: 1, color: '#8e24aa', fontWeight: 600 }}>
              Profile
            </Typography>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" mt={6} sx={{ zIndex: 1, position: 'relative' }}>
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
            maxWidth: 600,
            textAlign: 'center',
          }}
        >
          <Typography variant="h3" fontWeight={900} color="#8e24aa" gutterBottom>
            {phase ? `You are in your ${phase} phase` : 'Your cycle phase will appear here!'}
          </Typography>
          <PhaseInfoCard phase={phase} />
          <Grid container spacing={4} justifyContent="center" sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<RestaurantMenuIcon sx={{ fontSize: 38 }} />}
                sx={{
                  width: '100%',
                  height: 100,
                  borderRadius: 6,
                  fontSize: 22,
                  fontWeight: 600,
                  bgcolor: '#f8bbd0',
                  color: '#6d4c41',
                  boxShadow: '0 4px 16px 0 rgba(248,187,208,0.25)',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                  '&:hover': {
                    transform: 'translateY(-4px) scale(1.04)',
                    boxShadow: '0 8px 32px 0 rgba(248,187,208,0.35)',
                    bgcolor: '#f06292',
                    color: 'white',
                  },
                }}
                onClick={() => {
                  if (!profile?.whatToEatPrefs) {
                    setShowWhatToEat(true);
                  } else {
                    navigate('/meal-plan');
                  }
                }}
              >
                What to eat
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<EmojiObjectsIcon sx={{ fontSize: 38 }} />}
                sx={{
                  width: '100%',
                  height: 100,
                  borderRadius: 6,
                  fontSize: 22,
                  fontWeight: 600,
                  bgcolor: '#b2dfdb',
                  color: '#004d40',
                  boxShadow: '0 4px 16px 0 rgba(178,223,219,0.22)',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                  '&:hover': {
                    transform: 'translateY(-4px) scale(1.04)',
                    boxShadow: '0 8px 32px 0 rgba(178,223,219,0.32)',
                    bgcolor: '#26a69a',
                    color: 'white',
                  },
                }}
                onClick={() => {
                  if (profile?.whatToDoPrefs) {
                    navigate('/what-to-do');
                  } else {
                    setShowWhatToDo(true);
                  }
                }}
              >
                What to do
              </Button>
            </Grid>
          </Grid>
        </Paper>
        <WhatToDoDialog
          open={!!showWhatToDo}
          onClose={() => setShowWhatToDo(false)}
          onSave={(answers) => {
            updateProfile({ ...profile, whatToDoPrefs: answers });
            setShowWhatToDo(false);
            navigate('/what-to-do');
          }}
          defaultValues={profile?.whatToDoPrefs}
        />
        <WhatToEatDialog
          open={!!showWhatToEat}
          onClose={() => setShowWhatToEat(false)}
          onSave={(answers) => {
            updateProfile({ ...profile, whatToEatPrefs: answers });
            setShowWhatToEat(false);
            // After saving, user will now be able to click the button to go to meal planning
          }}
          defaultValues={profile?.whatToEatPrefs}
        />
        {/* Explore All Phases Section */}
        <Box sx={{ mt: 5, mb: 4 }}>
          <Typography variant="h5" fontWeight={800} color="#8e24aa" mb={2} textAlign="center">
            Explore All Phases
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            {['Menstrual', 'Follicular', 'Ovulatory', 'Luteal'].map((phase) => {
              const info = {
                Menstrual: {
                  color: '#e57373',
                  emoji: '🩸',
                  title: 'Menstrual',
                  desc: 'Rest, hydrate, and nourish your body. Gentle movement and self-care are best.',
                  learn: 'https://helloclue.com/articles/cycle-a-z/menstrual-phase',
                  illustration: (
                    <svg width="60" height="60" viewBox="0 0 90 90" aria-label="Menstrual phase illustration" style={{ display: 'block' }}>
                      <ellipse cx="45" cy="45" rx="32" ry="32" fill="#fde0dc" />
                      <ellipse cx="45" cy="60" rx="18" ry="9" fill="#e57373" opacity="0.7" />
                      <circle cx="45" cy="45" r="13" fill="#e57373" />
                      <ellipse cx="45" cy="52" rx="5" ry="2.5" fill="#fff" opacity="0.7" />
                    </svg>
                  ),
                },
                Follicular: {
                  color: '#64b5f6',
                  emoji: '🌱',
                  title: 'Follicular',
                  desc: 'Energy rises. Great time for creativity, learning, and starting new projects!',
                  learn: 'https://helloclue.com/articles/cycle-a-z/follicular-phase',
                  illustration: (
                    <svg width="60" height="60" viewBox="0 0 90 90" aria-label="Follicular phase illustration" style={{ display: 'block' }}>
                      <ellipse cx="45" cy="45" rx="32" ry="32" fill="#e3f2fd" />
                      <ellipse cx="45" cy="60" rx="18" ry="9" fill="#64b5f6" opacity="0.7" />
                      <circle cx="45" cy="40" r="13" fill="#64b5f6" />
                      <rect x="40" y="30" width="10" height="20" rx="5" fill="#fff" opacity="0.3" />
                    </svg>
                  ),
                },
                Ovulatory: {
                  color: '#ffd54f',
                  emoji: '🌼',
                  title: 'Ovulatory',
                  desc: 'You are at your peak—social, confident, and energetic. Connect and shine!',
                  learn: 'https://helloclue.com/articles/cycle-a-z/ovulation',
                  illustration: (
                    <svg width="60" height="60" viewBox="0 0 90 90" aria-label="Ovulatory phase illustration" style={{ display: 'block' }}>
                      <ellipse cx="45" cy="45" rx="32" ry="32" fill="#fffde7" />
                      <ellipse cx="45" cy="60" rx="18" ry="9" fill="#ffd54f" opacity="0.7" />
                      <circle cx="45" cy="38" r="13" fill="#ffd54f" />
                      <ellipse cx="45" cy="45" rx="6" ry="2.5" fill="#fff" opacity="0.7" />
                    </svg>
                  ),
                },
                Luteal: {
                  color: '#ba68c8',
                  emoji: '🌙',
                  title: 'Luteal',
                  desc: 'Wind down, reflect, and focus on self-care. Prioritize sleep, nutrition, and stress management.',
                  learn: 'https://helloclue.com/articles/cycle-a-z/luteal-phase',
                  illustration: (
                    <svg width="60" height="60" viewBox="0 0 90 90" aria-label="Luteal phase illustration" style={{ display: 'block' }}>
                      <ellipse cx="45" cy="45" rx="32" ry="32" fill="#f3e5f5" />
                      <ellipse cx="45" cy="60" rx="18" ry="9" fill="#ba68c8" opacity="0.7" />
                      <circle cx="45" cy="45" r="13" fill="#ba68c8" />
                      <ellipse cx="45" cy="52" rx="5" ry="2.5" fill="#fff" opacity="0.7" />
                    </svg>
                  ),
                },
              }[phase];
              return (
                <Grid item xs={12} sm={6} md={3} key={phase}>
                  <Paper elevation={1} sx={{ p: 2, borderRadius: 3, bgcolor: info.color + '12', color: info.color, height: '100%' }}>
                    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" mb={1}>
                      {info.illustration}
                      <Typography variant="h6" fontWeight={700} mt={1}>{info.title} {info.emoji}</Typography>
                    </Box>
                    <Typography variant="body2" fontWeight={500} mb={2} textAlign="center">{info.desc}</Typography>
                    <Button href={info.learn} target="_blank" rel="noopener" variant="text" size="small" color="secondary" sx={{ fontWeight: 600 }}>
                      Learn More
                    </Button>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
