import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, CircularProgress, Button, Avatar, Fade, Grid } from '@mui/material';
import { useProfile } from './hooks/useProfile';
import { getCurrentCyclePhase } from './utils/cyclePhase';

// This function simulates an LLM call. Replace with real API call in production.
async function fetchLLMSuggestions({ phase, preferences }) {
  // Simulate network delay
  await new Promise(r => setTimeout(r, 1200));
  // Example suggestions (should be replaced by real LLM output)
  return [
    `Try a relaxing ${preferences.unwind.toLowerCase()} session during your ${phase} phase.`,
    `Incorporate ${preferences.exercise.toLowerCase()} exercises, as you enjoy them!`,
    `Since you exercise ${preferences.frequency.toLowerCase()}, balance activity with rest.`,
    `Remember to listen to your body—uplift your mood with self-care!`
  ];
}

export default function WhatToDoPage() {
  const [profile] = useProfile();
  const phase = getCurrentCyclePhase(profile);
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(true);
  const preferences = profile?.whatToDoPrefs;

  useEffect(() => {
    let isMounted = true;
    if (phase && preferences) {
      setLoading(true);
      fetchLLMSuggestions({ phase, preferences }).then(suggestions => {
        if (isMounted) {
          setSuggestions(suggestions);
          setLoading(false);
        }
      });
    }
    return () => { isMounted = false; };
  }, [phase, preferences]);

  if (!preferences) {
    return (
      <Box minHeight="60vh" display="flex" alignItems="center" justifyContent="center">
        <Typography variant="h6" color="text.secondary">
          Please provide your preferences first from the landing page.
        </Typography>
      </Box>
    );
  }

  return (
    <Box minHeight="100vh" position="relative" display="flex" flexDirection="column" alignItems="center" justifyContent="center" sx={{
      background: 'linear-gradient(135deg, #fbeffb 0%, #e3f0ff 100%)',
      overflow: 'hidden',
    }}>
      {/* Floating Pastel Circles */}
      <Box sx={{
        position: 'absolute',
        top: -80,
        left: -80,
        width: 220,
        height: 220,
        borderRadius: '50%',
        background: 'radial-gradient(circle, #f8bbd0 50%, transparent 80%)',
        zIndex: 0,
        animation: 'float1 8s ease-in-out infinite',
      }} />
      <Box sx={{
        position: 'absolute',
        bottom: -100,
        right: -100,
        width: 280,
        height: 280,
        borderRadius: '50%',
        background: 'radial-gradient(circle, #b2dfdb 50%, transparent 80%)',
        zIndex: 0,
        animation: 'float2 10s ease-in-out infinite',
      }} />
      <Box sx={{
        position: 'absolute',
        top: 60,
        right: 60,
        width: 120,
        height: 120,
        borderRadius: '50%',
        background: 'radial-gradient(circle, #fff9c4 60%, transparent 90%)',
        zIndex: 0,
        animation: 'float3 7s ease-in-out infinite',
      }} />

      {/* Main Content */}
      <Paper elevation={8} sx={{
        px: { xs: 2, sm: 7 },
        py: { xs: 4, sm: 6 },
        borderRadius: 6,
        maxWidth: 600,
        width: '100%',
        textAlign: 'center',
        mt: 7,
        boxShadow: '0 8px 40px 0 rgba(140, 90, 180, 0.13)',
        position: 'relative',
        zIndex: 1,
        bgcolor: '#fff8fdcc',
      }}>
        <Avatar sx={{ width: 84, height: 84, bgcolor: '#f8bbd0', mx: 'auto', mb: 2, boxShadow: 3 }}>
          <span role="img" aria-label="lightbulb" style={{ fontSize: 42 }}>💡</span>
        </Avatar>
        <Typography variant="h3" fontWeight={900} sx={{
          background: 'linear-gradient(90deg, #8e24aa 10%, #26a69a 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 1,
          letterSpacing: 1.5,
        }}>
          Uplifting Activities for You
        </Typography>
        <Typography variant="subtitle1" mb={4} color="#6d4c41">
          Based on your preferences and current phase: <b>{phase}</b>
        </Typography>
        {loading ? (
          <CircularProgress color="secondary" sx={{ my: 6 }} />
        ) : (
          <Fade in timeout={900}>
            <Grid container spacing={3} justifyContent="center" alignItems="stretch" sx={{ mb: 2 }}>
              {suggestions && suggestions.map((s, i) => (
                <Grid item xs={12} sm={6} key={i}>
                  <Paper elevation={3} sx={{
                    bgcolor: '#e3f2fd',
                    borderRadius: 4,
                    p: 3,
                    minHeight: 120,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 12px 0 rgba(178,223,219,0.15)',
                    transition: 'transform 0.18s',
                    '&:hover': { transform: 'scale(1.032)', boxShadow: '0 8px 32px 0 rgba(178,223,219,0.23)' },
                  }}>
                    <Avatar sx={{ bgcolor: '#ffd54f', color: '#8e24aa', mb: 1, width: 48, height: 48, fontSize: 28 }}>
                      {['🌸','🌱','🌼','🌙','✨','💖','🎵','📖','🧘','🏃','🎬'][i % 11]}
                    </Avatar>
                    <Typography variant="body1" fontWeight={600} color="#6d4c41">
                      {s}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Fade>
        )}
        <Button variant="contained" color="secondary" sx={{ mt: 2, fontWeight: 700, borderRadius: 4, px: 5, py: 1.2, fontSize: 18, boxShadow: '0 2px 12px 0 rgba(178,223,219,0.13)' }} href="/landing">
          Back to Home
        </Button>
      </Paper>
      {/* Keyframes for floating animation */}
      <style>{`
        @keyframes float1 {
          0% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(16px) scale(1.04); }
          100% { transform: translateY(0px) scale(1); }
        }
        @keyframes float2 {
          0% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-18px) scale(1.03); }
          100% { transform: translateY(0px) scale(1); }
        }
        @keyframes float3 {
          0% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(12px) scale(1.02); }
          100% { transform: translateY(0px) scale(1); }
        }
      `}</style>
    </Box>
  );
}
