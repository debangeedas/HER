// Utility to calculate the user's current menstrual cycle phase
// profile = { lastCycle: 'YYYY-MM-DD', cycleLength: number }
// today = Date or ISO string

export function getCurrentCyclePhase(profile, today = new Date()) {
  if (!profile?.lastCycle || !profile?.cycleLength) return null;
  const startDate = new Date(profile.lastCycle);
  const cycleLength = Number(profile.cycleLength);
  if (isNaN(startDate.getTime()) || isNaN(cycleLength) || cycleLength < 15) return null;

  const now = (typeof today === 'string') ? new Date(today) : today;
  // Calculate days since last cycle start
  const diffTime = now.setHours(0,0,0,0) - startDate.setHours(0,0,0,0);
  const daysSinceStart = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  if (daysSinceStart < 0) return null;
  const cycleDay = (daysSinceStart % cycleLength) + 1;

  if (cycleDay >= 1 && cycleDay <= 5) return 'Menstrual';
  if (cycleDay >= 6 && cycleDay <= 13) return 'Follicular';
  if (cycleDay >= 14 && cycleDay <= 17) return 'Ovulatory';
  if (cycleDay >= 18 && cycleDay <= cycleLength) return 'Luteal';
  return null;
}
