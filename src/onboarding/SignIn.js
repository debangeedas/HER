import React from 'react';
import { Box, Button, Typography, Divider } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import AppleIcon from '@mui/icons-material/Apple';

export default function SignIn({ onSignIn }) {
  // Stub: Replace with real auth logic later
  const handleSignIn = (provider) => {
    // Simulate fetching name/email from provider
    if (provider === 'google') {
      onSignIn({ name: 'Jane Doe', email: 'janedoe@gmail.com', provider: 'google' });
    } else if (provider === 'apple') {
      onSignIn({ name: 'Jane Doe', email: 'janedoe@icloud.com', provider: 'apple' });
    } else {
      onSignIn({ name: '', email: '', provider: 'email' });
    }
  };

  return (
    <Box textAlign="center" mt={4}>
      <Typography variant="h5" fontWeight={700} mb={3}>Sign in to HER</Typography>
      <Button
        variant="contained"
        color="secondary"
        fullWidth
        startIcon={<GoogleIcon />}
        sx={{ mb: 2, fontWeight: 600 }}
        onClick={() => handleSignIn('google')}
      >
        Sign in with Google
      </Button>
      <Button
        variant="contained"
        color="inherit"
        fullWidth
        startIcon={<AppleIcon />}
        sx={{ mb: 2, fontWeight: 600, color: '#333', background: '#fff', border: '1px solid #ccc' }}
        onClick={() => handleSignIn('apple')}
      >
        Sign in with Apple
      </Button>
      <Divider sx={{ my: 2 }}>or</Divider>
      <Button
        variant="outlined"
        color="primary"
        fullWidth
        sx={{ fontWeight: 600 }}
        onClick={() => handleSignIn('email')}
      >
        Sign in with Email
      </Button>
    </Box>
  );
}
