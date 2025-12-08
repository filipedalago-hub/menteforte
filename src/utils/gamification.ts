export function calculateLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

export function xpForNextLevel(currentLevel: number): number {
  return (currentLevel * currentLevel) * 100;
}

export function xpProgress(xp: number): { currentLevelXp: number; nextLevelXp: number; percentage: number } {
  const level = calculateLevel(xp);
  const currentLevelXp = xpForNextLevel(level - 1);
  const nextLevelXp = xpForNextLevel(level);
  const xpInCurrentLevel = xp - currentLevelXp;
  const xpNeededForLevel = nextLevelXp - currentLevelXp;
  const percentage = (xpInCurrentLevel / xpNeededForLevel) * 100;

  return {
    currentLevelXp: xpInCurrentLevel,
    nextLevelXp: xpNeededForLevel,
    percentage: Math.min(100, Math.max(0, percentage)),
  };
}

export function checkStreak(lastActivityDate: string | null): { streak: number; needsUpdate: boolean } {
  if (!lastActivityDate) {
    return { streak: 1, needsUpdate: true };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastDate = new Date(lastActivityDate);
  lastDate.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - lastDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return { streak: 0, needsUpdate: false };
  } else if (diffDays === 1) {
    return { streak: 1, needsUpdate: true };
  } else {
    return { streak: 1, needsUpdate: true };
  }
}
