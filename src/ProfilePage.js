import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Checkbox, FormControlLabel, Paper, Avatar, Divider, InputAdornment, Fade } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WatchIcon from '@mui/icons-material/Watch';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { useProfile } from './hooks/useProfile';
import { useNavigate } from 'react-router-dom';
import ProfileWhatToDoDialog from './ProfileWhatToDoDialog';
import WhatToEatDialog from './WhatToEatDialog';

export default function ProfilePage() {
  const [profile, updateProfile] = useProfile();
  const [form, setForm] = useState(profile || {});
  const [showEditWhatToDo, setShowEditWhatToDo] = useState(false);
  const [showEditWhatToEat, setShowEditWhatToEat] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (profile) setForm(profile);
  }, [profile]);

  if (profile === null) {
    return (
      <Box minHeight="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center" sx={{ background: 'linear-gradient(135deg, #fbeffb 0%, #e3f0ff 100%)' }}>
        <Paper elevation={6} sx={{ px: 4, py: 5, minWidth: 350, maxWidth: 420, textAlign: 'center' }}>
          <Typography variant="h5" fontWeight={700} mb={2}>Your profile is not set up yet.</Typography>
          <Typography mb={3}>Please complete onboarding to personalize your experience.</Typography>
          <Button variant="contained" color="primary" onClick={() => navigate('/')}>Complete Onboarding</Button>
        </Paper>
      </Box>
    );
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(form);
    navigate('/landing');
  };

  return (
    <Box minHeight="100vh" display="flex" flexDirection="column" alignItems="center" justifyContent="center" sx={{ position: 'relative', background: 'linear-gradient(135deg, #fbeffb 0%, #e3f0ff 100%)' }}>
      {/* Decorative floating circles */}
      <Box sx={{ position: 'absolute', top: -60, left: -60, zIndex: 0 }}>
        <svg width="180" height="180"><circle cx="90" cy="90" r="90" fill="#f8bbd0" opacity="0.15" /></svg>
      </Box>
      <Box sx={{ position: 'absolute', bottom: -40, right: -40, zIndex: 0 }}>
        <svg width="120" height="120"><circle cx="60" cy="60" r="60" fill="#b39ddb" opacity="0.13" /></svg>
      </Box>
      <Paper elevation={8} sx={{ px: { xs: 2, sm: 5 }, py: { xs: 4, sm: 5 }, minWidth: 320, maxWidth: 420, borderRadius: 6, border: '2px solid #f3e5f5', position: 'relative', zIndex: 1, boxShadow: '0 8px 32px 0 rgba(140, 90, 180, 0.10)' }}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
          <Avatar sx={{ width: 80, height: 80, bgcolor: '#f8bbd0', mb: 1 }}>
            <PersonIcon sx={{ fontSize: 48, color: '#8e24aa' }} />
          </Avatar>
          <Typography variant="h4" fontWeight={900} color="#8e24aa" mb={1} fontFamily="Quicksand, Arial">Profile</Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Personalize your experience and get the most out of HER
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        <form onSubmit={handleSubmit}>
          <Typography variant="subtitle1" fontWeight={700} color="#8e24aa" mb={1}>Basic Info</Typography>
          <TextField
            label="Name"
            name="name"
            value={form.name || ''}
            onChange={handleChange}
            fullWidth
            required
            sx={{ mb: 2 }}
            InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon color="action" /></InputAdornment> }}
          />
          <TextField
            label="Email"
            name="email"
            value={form.email || ''}
            InputProps={{ readOnly: true, startAdornment: <InputAdornment position="start"><EmailIcon color="action" /></InputAdornment> }}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Date of Birth"
            name="dob"
            type="date"
            value={form.dob || ''}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            required
            sx={{ mb: 2 }}
            InputProps={{ startAdornment: <InputAdornment position="start"><CalendarTodayIcon color="action" /></InputAdornment> }}
          />
          <TextField
            label="Home Location"
            name="location"
            value={form.location || ''}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
            InputProps={{ startAdornment: <InputAdornment position="start"><LocationOnIcon color="action" /></InputAdornment> }}
          />
          <Divider sx={{ my: 3 }} />
          <Typography variant="subtitle1" fontWeight={700} color="#8e24aa" mb={1}>Cycle Info</Typography>
          <TextField
            label="Last Cycle Start Date"
            name="lastCycle"
            type="date"
            value={form.lastCycle || ''}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            required
            sx={{ mb: 2 }}
            InputProps={{ startAdornment: <InputAdornment position="start"><EventNoteIcon color="action" /></InputAdornment> }}
          />
          <TextField
            label="Cycle Length (days)"
            name="cycleLength"
            type="number"
            value={form.cycleLength || ''}
            onChange={handleChange}
            inputProps={{ min: 15, max: 45 }}
            fullWidth
            required
            sx={{ mb: 2 }}
            InputProps={{ startAdornment: <InputAdornment position="start"><CalendarTodayIcon color="action" /></InputAdornment> }}
          />
          <FormControlLabel
            control={<Checkbox checked={!!form.smartwatch} onChange={handleChange} name="smartwatch" icon={<WatchIcon />} checkedIcon={<WatchIcon color="secondary" />} />}
            label={<Typography variant="body2">I wear a smartwatch regularly</Typography>}
            sx={{ mb: 2, ml: 0 }}
          />
          <FormControlLabel
            control={<Checkbox checked={!!form.calendar} onChange={handleChange} name="calendar" icon={<EventNoteIcon />} checkedIcon={<EventNoteIcon color="secondary" />} />}
            label={<Typography variant="body2">Calendar Connected</Typography>}
            sx={{ mb: 2, ml: 0 }}
          />
          <Fade in={true} timeout={700}>
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2, fontWeight: 700, fontSize: 18, borderRadius: 3, py: 1.3, boxShadow: '0 4px 16px 0 rgba(140,90,180,0.18)' }}>
              Save Changes
            </Button>
          </Fade>
        </form>
        {profile?.whatToDoPrefs && (
          <Box mt={4}>
            <Divider sx={{ mb: 2 }} />
            {/* What To Do Preferences Section (existing) */}
            <Typography variant="subtitle1" fontWeight={700} color="#8e24aa" mb={1}>What To Do Preferences</Typography>
            <Paper elevation={6} sx={{
              p: 3,
              borderRadius: 4,
              mb: 2,
              position: 'relative',
              background: 'linear-gradient(120deg, #fbeffb 60%, #e3f0ff 100%)',
              boxShadow: '0 4px 24px 0 rgba(178,223,219,0.15)',
              color: '#6d4c41',
              overflow: 'visible',
            }}>
              <Box display="flex" alignItems="center" mb={1}>
                <span role="img" aria-label="sparkle" style={{ fontSize: 28, marginRight: 8 }}>✨</span>
                <Typography variant="h6" fontWeight={800} color="#8e24aa">What To Do Preferences</Typography>
              </Box>
              <Typography variant="subtitle2" color="text.secondary" mb={2}>
                Your favorite ways to unwind and move!
              </Typography>
              <Box mb={2}>
                <Typography variant="body2" fontWeight={700} color="#8e24aa" mb={0.5}>How do you like to unwind?</Typography>
                <Box display="flex" flexWrap="wrap" gap={1} mt={0.5}>
                  {(Array.isArray(profile.whatToDoPrefs.unwind) ? profile.whatToDoPrefs.unwind : [profile.whatToDoPrefs.unwind]).map((item, i) => (
                    <span key={item}>
                      <span style={{ display: 'inline-block', background: '#f8bbd0', color: '#8e24aa', fontWeight: 600, borderRadius: 16, padding: '4px 14px', fontSize: 15, marginRight: 4, marginBottom: 4, boxShadow: '0 1px 6px #f8bbd033' }}>
                        {item}
                      </span>
                    </span>
                  ))}
                </Box>
              </Box>
              <Box mb={2}>
                <Typography variant="body2" fontWeight={700} color="#8e24aa" mb={0.5}>Preferred exercise type</Typography>
                <Box display="flex" flexWrap="wrap" gap={1} mt={0.5}>
                  {(Array.isArray(profile.whatToDoPrefs.exercise) ? profile.whatToDoPrefs.exercise : [profile.whatToDoPrefs.exercise]).map((item, i) => (
                    <span key={item}>
                      <span style={{ display: 'inline-block', background: '#b2dfdb', color: '#004d40', fontWeight: 600, borderRadius: 16, padding: '4px 14px', fontSize: 15, marginRight: 4, marginBottom: 4, boxShadow: '0 1px 6px #b2dfdb33' }}>
                        {item}
                      </span>
                    </span>
                  ))}
                </Box>
              </Box>
              <Box mb={2}>
                <Typography variant="body2" fontWeight={700} color="#8e24aa" mb={0.5}>Exercise frequency</Typography>
                <span style={{ display: 'inline-block', background: '#fff9c4', color: '#6d4c41', fontWeight: 600, borderRadius: 16, padding: '4px 14px', fontSize: 15, marginRight: 4, marginBottom: 4, boxShadow: '0 1px 6px #fff9c433' }}>
                  {profile.whatToDoPrefs.frequency}
                </span>
              </Box>
              <Box sx={{ position: 'relative', height: 36 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{
                    position: 'absolute',
                    bottom: -18,
                    right: 18,
                    minWidth: 0,
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    boxShadow: '0 4px 16px #b2dfdb44',
                    fontWeight: 700,
                    fontSize: 20,
                    zIndex: 2,
                    p: 0,
                  }}
                  onClick={() => setShowEditWhatToDo(true)}
                  title="Edit preferences"
                >
                  ✏️
                </Button>
              </Box>
            </Paper>
            <ProfileWhatToDoDialog
              open={!!showEditWhatToDo}
              onClose={() => setShowEditWhatToDo(false)}
              onSave={(answers) => {
                updateProfile({ ...profile, whatToDoPrefs: answers });
                setShowEditWhatToDo(false);
              }}
              defaultValues={profile?.whatToDoPrefs}
            />
            {/* What To Eat Preferences Section (new) */}
            {profile?.whatToEatPrefs && (
              <Box mt={4}>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="subtitle1" fontWeight={700} color="#8e24aa" mb={1}>What To Eat Preferences</Typography>
                <Paper elevation={6} sx={{
                  p: 3,
                  borderRadius: 4,
                  mb: 2,
                  position: 'relative',
                  background: 'linear-gradient(120deg, #e3f0ff 60%, #fbeffb 100%)',
                  boxShadow: '0 4px 24px 0 rgba(248,187,208,0.12)',
                  color: '#6d4c41',
                  overflow: 'visible',
                }}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <span role="img" aria-label="food" style={{ fontSize: 28, marginRight: 8 }}>🍽️</span>
                    <Typography variant="h6" fontWeight={800} color="#8e24aa">What To Eat Preferences</Typography>
                  </Box>
                  <Typography variant="subtitle2" color="text.secondary" mb={2}>
                    Your food and nutrition choices
                  </Typography>
                  <Box mb={2}>
                    <Typography variant="body2" fontWeight={700} color="#8e24aa" mb={0.5}>Demographic</Typography>
                    <Box display="flex" flexWrap="wrap" gap={1} mt={0.5}>
                      {(Array.isArray(profile.whatToEatPrefs.demographic) ? profile.whatToEatPrefs.demographic : [profile.whatToEatPrefs.demographic]).map((item, i) => (
                        <span key={item}>
                          <span style={{ display: 'inline-block', background: '#b2dfdb', color: '#004d40', fontWeight: 600, borderRadius: 16, padding: '4px 14px', fontSize: 15, marginRight: 4, marginBottom: 4, boxShadow: '0 1px 6px #b2dfdb33' }}>
                            {item}
                          </span>
                        </span>
                      ))}
                    </Box>
                  </Box>
                  <Box mb={2}>
                    <Typography variant="body2" fontWeight={700} color="#8e24aa" mb={0.5}>Preferred Cuisine</Typography>
                    <Box display="flex" flexWrap="wrap" gap={1} mt={0.5}>
                      {(Array.isArray(profile.whatToEatPrefs.cuisine) ? profile.whatToEatPrefs.cuisine : [profile.whatToEatPrefs.cuisine]).map((item, i) => (
                        <span key={item}>
                          <span style={{ display: 'inline-block', background: '#f8bbd0', color: '#8e24aa', fontWeight: 600, borderRadius: 16, padding: '4px 14px', fontSize: 15, marginRight: 4, marginBottom: 4, boxShadow: '0 1px 6px #f8bbd033' }}>
                            {item}
                          </span>
                        </span>
                      ))}
                    </Box>
                  </Box>
                  <Box mb={2}>
                    <Typography variant="body2" fontWeight={700} color="#8e24aa" mb={0.5}>Dietary Restriction</Typography>
                    <Box display="flex" flexWrap="wrap" gap={1} mt={0.5}>
                      {(Array.isArray(profile.whatToEatPrefs.dietary) ? profile.whatToEatPrefs.dietary : [profile.whatToEatPrefs.dietary]).map((item, i) => (
                        <span key={item}>
                          <span style={{ display: 'inline-block', background: '#fff9c4', color: '#6d4c41', fontWeight: 600, borderRadius: 16, padding: '4px 14px', fontSize: 15, marginRight: 4, marginBottom: 4, boxShadow: '0 1px 6px #fff9c433' }}>
                            {item}
                          </span>
                        </span>
                      ))}
                    </Box>
                  </Box>
                  <Box mb={2}>
                    <Typography variant="body2" fontWeight={700} color="#8e24aa" mb={0.5}>Allergies</Typography>
                    <Box display="flex" flexWrap="wrap" gap={1} mt={0.5}>
                      {(Array.isArray(profile.whatToEatPrefs.allergies) ? profile.whatToEatPrefs.allergies : [profile.whatToEatPrefs.allergies]).map((item, i) => (
                        <span key={item}>
                          <span style={{ display: 'inline-block', background: '#e57373', color: '#fff', fontWeight: 600, borderRadius: 16, padding: '4px 14px', fontSize: 15, marginRight: 4, marginBottom: 4, boxShadow: '0 1px 6px #e5737333' }}>
                            {item}
                          </span>
                        </span>
                      ))}
                    </Box>
                  </Box>
                  <Box mb={2}>
                    <Typography variant="body2" fontWeight={700} color="#8e24aa" mb={0.5}>Current Diet</Typography>
                    <span style={{ display: 'inline-block', background: '#b2dfdb', color: '#004d40', fontWeight: 600, borderRadius: 16, padding: '4px 14px', fontSize: 15, marginRight: 4, marginBottom: 4, boxShadow: '0 1px 6px #b2dfdb33' }}>
                      {profile.whatToEatPrefs.dietType}
                    </span>
                  </Box>
                  <Box sx={{ position: 'relative', height: 36 }}>
                    <Button
                      variant="contained"
                      color="secondary"
                      sx={{
                        position: 'absolute',
                        bottom: -18,
                        right: 18,
                        minWidth: 0,
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        boxShadow: '0 4px 16px #b2dfdb44',
                        fontWeight: 700,
                        fontSize: 20,
                        zIndex: 2,
                        p: 0,
                      }}
                      onClick={() => setShowEditWhatToEat(true)}
                      title="Edit preferences"
                    >
                      ✏️
                    </Button>
                  </Box>
                </Paper>
                <WhatToEatDialog
                  open={!!showEditWhatToEat}
                  onClose={() => setShowEditWhatToEat(false)}
                  onSave={(answers) => {
                    updateProfile({ ...profile, whatToEatPrefs: answers });
                    setShowEditWhatToEat(false);
                  }}
                  defaultValues={profile?.whatToEatPrefs}
                />
              </Box>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
}
