import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { Box, Paper, Typography, IconButton, Button, Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const phaseColors = {
  Menstrual: '#e57373',
  Follicular: '#64b5f6',
  Ovulatory: '#ffd54f',
  Luteal: '#ba68c8'
};

function getPhaseForDate(date, lastCycle, cycleLength) {
  if (!lastCycle || !cycleLength) return 'Follicular';
  
  const startDate = new Date(lastCycle);
  const daysSinceStart = Math.floor((date - startDate) / (1000 * 60 * 60 * 24));
  if (daysSinceStart < 0) return 'Follicular';
  
  const cycleDay = (daysSinceStart % cycleLength) + 1;
  
  if (cycleDay >= 1 && cycleDay <= 5) return 'Menstrual';
  if (cycleDay >= 6 && cycleDay <= 13) return 'Follicular';
  if (cycleDay >= 14 && cycleDay <= 17) return 'Ovulatory';
  if (cycleDay >= 18 && cycleDay <= cycleLength) return 'Luteal';
  return 'Follicular';
}

export default function PhaseCalendar({ profile }) {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleNavigate = (date) => {
    setCurrentDate(date);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const phase = getPhaseForDate(date, profile?.lastCycle, profile?.cycleLength);
    localStorage.setItem('selectedDate', date.toISOString());
    localStorage.setItem('selectedPhase', phase);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleActionClick = (action) => {
    handleMenuClose();
    if (selectedDate) {
      const phase = getPhaseForDate(selectedDate, profile?.lastCycle, profile?.cycleLength);
      localStorage.setItem('selectedDate', selectedDate.toISOString());
      localStorage.setItem('selectedPhase', phase);
      navigate(`/${action}`);
    }
  };

  const customDayPropGetter = (date) => {
    const phase = getPhaseForDate(date, profile?.lastCycle, profile?.cycleLength);
    return {
      style: {
        backgroundColor: `${phaseColors[phase]}20`,
        color: phaseColors[phase],
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: `${phaseColors[phase]}40`,
        },
      },
    };
  };

  const customEventPropGetter = (event) => {
    return {
      style: {
        backgroundColor: `${phaseColors[event.phase]}40`,
        borderColor: phaseColors[event.phase],
        color: phaseColors[event.phase],
      },
    };
  };

  const events = profile ? [
    {
      title: 'Current Phase',
      start: currentDate,
      end: currentDate,
      phase: getPhaseForDate(currentDate, profile.lastCycle, profile.cycleLength),
    },
  ] : [];

  return (
    <Paper
      elevation={5}
      sx={{
        p: 3,
        borderRadius: 4,
        bgcolor: 'rgba(255,255,255,0.95)',
        boxShadow: '0 8px 32px 0 rgba(140, 90, 180, 0.15)',
        minWidth: { xs: '90vw', sm: 500 },
        maxWidth: 600,
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Box display="flex" alignItems="center">
          <Typography variant="h5" fontWeight={700} color="#8e24aa">
            Your Cycle Calendar
          </Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <IconButton onClick={() => handleNavigate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}>
            <ArrowBackIosIcon />
          </IconButton>
          <Typography variant="h6" fontWeight={600} color="#6d4c41" mx={2}>
            {format(currentDate, 'MMMM yyyy')}
          </Typography>
          <IconButton onClick={() => handleNavigate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}>
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
      </Box>

      <Calendar
        localizer={localizer}
        events={events}
        date={currentDate}
        onNavigate={handleNavigate}
        onSelectSlot={({ start }) => {
          handleDateClick(start);
          handleMenuClick({ currentTarget: document.getElementById('calendar-actions') });
        }}
        selectable
        dayPropGetter={customDayPropGetter}
        eventPropGetter={customEventPropGetter}
        style={{ height: 500 }}
        components={{
          toolbar: () => null,
        }}
      />

      <Box id="calendar-actions" sx={{ display: 'none' }} />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <MenuItem onClick={() => handleActionClick('what-to-eat')}>
          <RestaurantMenuIcon sx={{ mr: 1 }} />
          What to Eat
        </MenuItem>
        <MenuItem onClick={() => handleActionClick('what-to-do')}>
          <EmojiObjectsIcon sx={{ mr: 1 }} />
          What to Do
        </MenuItem>
      </Menu>

      <Box mt={3} display="flex" flexWrap="wrap" gap={2} justifyContent="center">
        {Object.entries(phaseColors).map(([phase, color]) => (
          <Box key={phase} display="flex" alignItems="center">
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                bgcolor: color + '40',
                mr: 1
              }}
            />
            <Typography variant="caption" color="#6d4c41">
              {phase}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
} 