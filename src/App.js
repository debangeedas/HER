import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import OnboardingStep1 from './onboarding/OnboardingStep1';
import LandingPage from './LandingPage';
import MealPlanPage from './MealPlanPage';
import ProfilePage from './ProfilePage';
import WhatToDoPage from './WhatToDoPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <Container maxWidth="sm">
            <Box mt={6}>
              <OnboardingStep1 />
            </Box>
          </Container>
        } />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/meal-plan" element={<MealPlanPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/what-to-do" element={<WhatToDoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
