import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, CircularProgress, Button, Avatar, Fade, Grid, Tooltip } from '@mui/material';
import { useProfile } from './hooks/useProfile';
import { getCurrentCyclePhase } from './utils/cyclePhase';
import { getWhatToDoSuggestions } from './services/ollamaService';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export default function WhatToDoPage() {
  const [profile] = useProfile();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videoStatus, setVideoStatus] = useState({});

  useEffect(() => {
    async function fetchSuggestions() {
      if (!profile?.whatToDoPrefs) return;
      
      try {
        setLoading(true);
        const phase = getCurrentCyclePhase();
        const newSuggestions = await getWhatToDoSuggestions({
          phase,
          preferences: profile.whatToDoPrefs,
          location: profile.location || 'your area'
        });
        setSuggestions(newSuggestions);
        setError(null);
        
        // Initialize video status for each suggestion
        const initialStatus = {};
        newSuggestions.forEach((suggestion, index) => {
          if (suggestion.youtubeLink) {
            initialStatus[index] = 'loading';
          }
        });
        setVideoStatus(initialStatus);
      } catch (err) {
        console.error('Error fetching suggestions:', err);
        setError('Failed to load suggestions. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchSuggestions();
  }, [profile]);

  const validateYouTubeLink = async (url) => {
    try {
      const videoId = url.split('v=')[1];
      if (!videoId) return false;
      
      // Check if video exists using YouTube's oembed API
      const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}`);
      return response.ok;
    } catch (err) {
      console.error('Error validating YouTube link:', err);
      return false;
    }
  };

  const handleYouTubeClick = async (url, index) => {
    try {
      setVideoStatus(prev => ({ ...prev, [index]: 'loading' }));
      const isValid = await validateYouTubeLink(url);
      
      if (isValid) {
        window.open(url, '_blank', 'noopener,noreferrer');
        setVideoStatus(prev => ({ ...prev, [index]: 'valid' }));
      } else {
        setVideoStatus(prev => ({ ...prev, [index]: 'invalid' }));
      }
    } catch (err) {
      console.error('Error handling YouTube click:', err);
      setVideoStatus(prev => ({ ...prev, [index]: 'error' }));
    }
  };

  if (!profile?.whatToDoPrefs) {
    return (
      <Box minHeight="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center" sx={{ background: 'linear-gradient(135deg, #fbeffb 0%, #e3f0ff 100%)' }}>
        <Paper elevation={6} sx={{ px: 4, py: 5, minWidth: 350, maxWidth: 420, textAlign: 'center' }}>
          <Typography variant="h5" fontWeight={700} mb={2}>Preferences not set</Typography>
          <Typography mb={3}>Please set your preferences in your profile to get personalized suggestions.</Typography>
          <Button variant="contained" color="primary" href="/profile">Go to Profile</Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      minHeight="100vh"
      sx={{
        background: 'linear-gradient(135deg, #fbeffb 0%, #e3f0ff 100%)',
        position: 'relative',
        overflow: 'hidden',
        p: 3,
      }}
    >
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
      <Paper
        elevation={6}
        sx={{
          position: 'relative',
          zIndex: 1,
          p: 4,
          borderRadius: 4,
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Typography variant="h4" fontWeight={700} color="#8e24aa" mb={3} textAlign="center">
          Personalized Suggestions
        </Typography>
        <Typography variant="h6" color="#6d4c41" mb={4} textAlign="center">
          Based on your {getCurrentCyclePhase()} phase
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
            <CircularProgress color="secondary" />
          </Box>
        ) : error ? (
          <Box textAlign="center" py={4}>
            <Typography color="error">{error}</Typography>
            <Button variant="contained" color="primary" onClick={() => window.location.reload()} sx={{ mt: 2 }}>
              Try Again
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {suggestions.map((suggestion, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Fade in timeout={500 + index * 200}>
                  <Paper
                    elevation={2}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      bgcolor: index % 2 === 0 ? '#f8bbd0' : '#b2dfdb',
                      color: index % 2 === 0 ? '#8e24aa' : '#004d40',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                      },
                    }}
                  >
                    <Box display="flex" alignItems="center" mb={2}>
                      <Avatar
                        sx={{
                          bgcolor: index % 2 === 0 ? '#8e24aa' : '#26a69a',
                          mr: 2,
                          width: 40,
                          height: 40,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        }}
                      >
                        {index + 1}
                      </Avatar>
                      <Typography variant="body1" fontWeight={500}>
                        {suggestion.text}
                      </Typography>
                    </Box>
                    <Box display="flex" flexWrap="wrap" gap={1.5} mt={2}>
                      {suggestion.youtubeLink && (
                        <Tooltip 
                          title={
                            videoStatus[index] === 'loading' ? 'Checking video...' :
                            videoStatus[index] === 'invalid' ? 'Video unavailable' :
                            videoStatus[index] === 'error' ? 'Error checking video' :
                            'Watch on YouTube'
                          }
                        >
                          <Button
                            onClick={() => handleYouTubeClick(suggestion.youtubeLink, index)}
                            variant="contained"
                            startIcon={
                              videoStatus[index] === 'loading' ? <CircularProgress size={20} color="inherit" /> :
                              videoStatus[index] === 'invalid' || videoStatus[index] === 'error' ? <ErrorOutlineIcon /> :
                              <YouTubeIcon />
                            }
                            endIcon={<OpenInNewIcon />}
                            disabled={videoStatus[index] === 'loading'}
                            sx={{
                              bgcolor: videoStatus[index] === 'invalid' || videoStatus[index] === 'error' ? '#ff5252' : '#ff0000',
                              color: 'white',
                              borderRadius: 2,
                              px: 2,
                              py: 1,
                              textTransform: 'none',
                              fontWeight: 600,
                              '&:hover': {
                                bgcolor: videoStatus[index] === 'invalid' || videoStatus[index] === 'error' ? '#ff1744' : '#cc0000',
                                transform: 'translateY(-1px)',
                              },
                              boxShadow: '0 2px 8px rgba(255,0,0,0.2)',
                            }}
                          >
                            {videoStatus[index] === 'loading' ? 'Checking...' :
                             videoStatus[index] === 'invalid' ? 'Video Unavailable' :
                             videoStatus[index] === 'error' ? 'Error' :
                             'Watch Video'}
                          </Button>
                        </Tooltip>
                      )}
                      {suggestion.nearbyActivity && (
                        <Button
                          variant="contained"
                          startIcon={<LocationOnIcon />}
                          sx={{
                            bgcolor: index % 2 === 0 ? '#8e24aa' : '#26a69a',
                            color: 'white',
                            borderRadius: 2,
                            px: 2,
                            py: 1,
                            textTransform: 'none',
                            fontWeight: 600,
                            '&:hover': {
                              bgcolor: index % 2 === 0 ? '#6a1b9a' : '#00897b',
                              transform: 'translateY(-1px)',
                            },
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          }}
                        >
                          Visit {suggestion.nearbyActivity}
                        </Button>
                      )}
                    </Box>
                  </Paper>
                </Fade>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Box>
  );
}
