export function calculateDemographic(dateOfBirth) {
  if (!dateOfBirth) return 'adult';

  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  // Adjust age if birthday hasn't occurred this year
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  if (age < 13) return 'child';
  if (age < 20) return 'teen';
  if (age < 30) return 'young adult';
  if (age < 50) return 'adult';
  if (age < 65) return 'middle aged';
  return 'senior';
} 