import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, CircularProgress, Alert, Paper } from '@mui/material';
import { useProfile } from '../contexts/ProfileContext';
import { getWhatToDoSuggestions } from '../services/ollamaService';
import { getCurrentCyclePhase } from '../utils/cyclePhase';

export default function WhatToDoPage() {
  const { profile } = useProfile();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedPhase, setSelectedPhase] = useState(null);

  useEffect(() => {
    const storedDate = localStorage.getItem('selectedDate');
    const storedPhase = localStorage.getItem('selectedPhase');
    
    if (storedDate && storedPhase) {
      setSelectedDate(new Date(storedDate));
      setSelectedPhase(storedPhase);
      localStorage.removeItem('selectedDate');
      localStorage.removeItem('selectedPhase');
    }
  }, []);

  const handleYouTubeClick = useCallback((url) => {
    if (url && typeof url === 'string') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!profile) return;
      
      setLoading(true);
      setError(null);
      try {
        const phase = selectedPhase || getCurrentCyclePhase(profile);
        const date = selectedDate || new Date();
        
        const response = await getWhatToDoSuggestions(
          profile?.preferences || [],
          phase,
          profile?.location || 'New York'
        );
        
        if (response?.suggestions) {
          setSuggestions(response.suggestions);
        } else {
          setError('No suggestions available');
        }
      } catch (err) {
        setError('Failed to fetch suggestions. Please try again later.');
        console.error('Error fetching suggestions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [profile, selectedDate, selectedPhase]);

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 2,
          bgcolor: 'rgba(255,255,255,0.95)',
          boxShadow: '0 8px 32px 0 rgba(140, 90, 180, 0.15)',
        }}
      >
        <Typography variant="h4" gutterBottom color="primary" fontWeight="bold">
          What To Do
        </Typography>
        
        {selectedDate && (
          <Typography variant="subtitle1" color="text.secondary" mb={2}>
            Suggestions for {selectedDate.toLocaleDateString()} ({selectedPhase} Phase)
          </Typography>
        )}
        
        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : (
          <Box>
            {suggestions.map((suggestion, index) => (
              <Box
                key={index}
                sx={{
                  mb: 3,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                <Typography variant="h6" gutterBottom color="primary">
                  {suggestion.title}
                </Typography>
                <Typography variant="body1" paragraph>
                  {suggestion.description}
                </Typography>
                {suggestion.youtubeLink && (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleYouTubeClick(suggestion.youtubeLink)}
                    sx={{ mt: 1 }}
                  >
                    Watch Video
                  </Button>
                )}
                {suggestion.nearby && (
                  <Box mt={2}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Nearby Activities:
                    </Typography>
                    <Typography variant="body2">
                      {suggestion.nearby}
                    </Typography>
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        )}
      </Paper>
    </Box>
  );
} 