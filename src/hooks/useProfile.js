import { useState, useEffect } from 'react';

export function getProfile() {
  try {
    const stored = localStorage.getItem('her_profile');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function setProfile(profile) {
  localStorage.setItem('her_profile', JSON.stringify(profile));
}

export function useProfile() {
  const [profile, setProfileState] = useState(getProfile());

  useEffect(() => {
    function handleStorage() {
      setProfileState(getProfile());
    }
    function handleProfileUpdated() {
      setProfileState(getProfile());
    }
    window.addEventListener('storage', handleStorage);
    window.addEventListener('profileUpdated', handleProfileUpdated);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('profileUpdated', handleProfileUpdated);
    };
  }, []);

  // Optionally provide a way to update profile
  const updateProfile = (newProfile) => {
    setProfile(newProfile);
    setProfileState(newProfile);
    window.dispatchEvent(new Event('profileUpdated'));
  };

  return [profile, updateProfile];
}
