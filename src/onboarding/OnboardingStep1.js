import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Checkbox, FormControlLabel, Dialog, DialogTitle, DialogContent, DialogActions, InputAdornment, IconButton, Paper } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SignIn from './SignIn';

function getTodayISO() {
  return new Date().toISOString().slice(0, 10);
}

const defaultProfile = {
  name: '',
  email: '',
  provider: '',
  dob: '',
  location: '',
  lastCycle: '',
  cycleLength: '',
  smartwatch: false,
  calendar: false,
};

const OnboardingStep1 = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0: sign-in, 1: info
  const [profile, setProfile] = useState(defaultProfile);
  const [calendarDialog, setCalendarDialog] = useState(false);

  // Handle Google/Apple/Email sign-in
  const handleSignIn = (user) => {
    setProfile(p => ({ ...p, ...user }));
    setStep(1);
  };

  // Auto-detect location
  const handleDetectLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
          );
          const data = await response.json();
          setProfile(p => ({ ...p, location: data.address.city || data.address.town || data.address.state || '' }));
        } catch (err) {}
      });
    }
  };

  // Calendar permission dialog
  const handleCalendarConnect = () => setCalendarDialog(true);
  const handleCalendarAllow = () => {
    setProfile(p => ({ ...p, calendar: true }));
    setCalendarDialog(false);
  };
  const handleCalendarSkip = () => {
    setProfile(p => ({ ...p, calendar: false }));
    setCalendarDialog(false);
  };

  // Submit onboarding
  const handleSubmit = (e) => {
    e.preventDefault();
    // Save to localStorage (replace with backend later)
    localStorage.setItem('her_profile', JSON.stringify(profile));
    navigate('/landing');
  };

  if (step === 0) {
    return <SignIn onSignIn={handleSignIn} />;
  }

  return (
    <Box minHeight="100vh" display="flex" justifyContent="center" alignItems="center" sx={{ background: 'linear-gradient(135deg, #fbeffb 0%, #e3f0ff 100%)' }}>
      <Box sx={{ width: '100%', maxWidth: 440 }}>
        <Paper elevation={6} sx={{ borderRadius: 6, px: { xs: 2, sm: 5 }, py: { xs: 3, sm: 5 }, boxShadow: '0 8px 32px 0 rgba(140, 90, 180, 0.15)' }}>
          <Typography variant="h4" fontWeight={900} fontFamily="Quicksand, Arial" color="#8e24aa" mb={2} textAlign="center">
            Welcome to HER!
          </Typography>
          <Typography variant="subtitle1" color="#6d4c41" mb={3} textAlign="center">
            Let's get to know you better.
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            {/* SECTION: Personal Info */}
            <Typography variant="subtitle2" color="#8e24aa" fontWeight={700} mb={1} mt={1}>
              👋 Personal Info
            </Typography>
            <TextField
              label="Full Name"
              value={profile.name}
              onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
              fullWidth
              required
              sx={{ mb: 2 }}
              helperText="How should we address you?"
            />
            <TextField
              label="Email"
              value={profile.email}
              InputProps={{ readOnly: true }}
              fullWidth
              sx={{ mb: 2 }}
              helperText="We'll never share your email."
            />
            <TextField
              label="Date of Birth"
              type="date"
              value={profile.dob}
              onChange={e => setProfile(p => ({ ...p, dob: e.target.value }))}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
              sx={{ mb: 2 }}
              helperText="Personalized tips depend on your age."
            />

            {/* SECTION: Location */}
            <Typography variant="subtitle2" color="#8e24aa" fontWeight={700} mb={1} mt={3}>
              📍 Where are you located?
            </Typography>
            <TextField
              label="Home Location"
              value={profile.location}
              onChange={e => setProfile(p => ({ ...p, location: e.target.value }))}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end" aria-label="auto-detect location" onClick={handleDetectLocation}>
                      <LocationOnIcon color="secondary" />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              helperText="Auto-detect or enter manually for local recommendations."
              sx={{ mb: 2 }}
            />

            {/* SECTION: Cycle Info */}
            <Typography variant="subtitle2" color="#8e24aa" fontWeight={700} mb={1} mt={3}>
              🌸 Cycle Details
            </Typography>
            <Box display="flex" gap={2} flexDirection={{ xs: 'column', sm: 'row' }}>
              <TextField
                label="Last Cycle Start"
                type="date"
                value={profile.lastCycle}
                onChange={e => setProfile(p => ({ ...p, lastCycle: e.target.value }))}
                fullWidth
                InputLabelProps={{ shrink: true }}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <CalendarMonthIcon color="secondary" />
                    </InputAdornment>
                  )
                }}
                helperText="First day of your last period."
                sx={{ mb: { xs: 2, sm: 0 } }}
              />
              <TextField
                label="Cycle Length (days)"
                type="number"
                value={profile.cycleLength}
                onChange={e => setProfile(p => ({ ...p, cycleLength: e.target.value }))}
                inputProps={{ min: 15, max: 45 }}
                fullWidth
                required
                helperText="Typical is 28 days."
              />
            </Box>

            {/* SECTION: Preferences */}
            <Typography variant="subtitle2" color="#8e24aa" fontWeight={700} mb={1} mt={3}>
              ⚙️ Preferences
            </Typography>
            <FormControlLabel
              control={<Checkbox checked={profile.smartwatch} onChange={e => setProfile(p => ({ ...p, smartwatch: e.target.checked }))} color="secondary" />}
              label={<Typography fontWeight={500}>I wear a smartwatch regularly</Typography>}
              sx={{ mb: 2 }}
            />
            <Box mb={2}>
              <Button variant={profile.calendar ? 'contained' : 'outlined'} color="secondary" onClick={handleCalendarConnect} sx={{ mr: 2 }}>
                {profile.calendar ? 'Calendar Connected' : 'Connect Calendar'}
              </Button>
              <Button variant="text" color="primary" onClick={handleCalendarSkip}>
                Skip
              </Button>
            </Box>
            <Button type="submit" variant="contained" color="primary" fullWidth size="large" sx={{ fontWeight: 700, fontSize: 18, borderRadius: 3, mt: 1 }}>
              Finish
            </Button>
          </Box>
        </Paper>
      </Box>
      <Dialog open={calendarDialog} onClose={() => setCalendarDialog(false)} PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle sx={{ fontWeight: 700, color: '#8e24aa', fontFamily: 'Quicksand, Arial' }}>Allow calendar access?</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">Allow HER to connect to your calendar to help you sync your hormonal phases and routines?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCalendarSkip} color="secondary">Skip</Button>
          <Button onClick={handleCalendarAllow} variant="contained" color="primary">Allow</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OnboardingStep1;
