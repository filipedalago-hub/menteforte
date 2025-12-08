import { describe, it, expect } from 'vitest';
import { calculateLevel, xpForNextLevel, xpProgress } from '../gamification';

describe('Gamification Utils', () => {
  describe('calculateLevel', () => {
    it('returns level 1 for 0 XP', () => {
      expect(calculateLevel(0)).toBe(1);
    });

    it('returns level 2 for 100 XP', () => {
      expect(calculateLevel(100)).toBe(2);
    });

    it('returns level 3 for 400 XP', () => {
      expect(calculateLevel(400)).toBe(3);
    });
  });

  describe('xpForNextLevel', () => {
    it('returns 100 for level 1', () => {
      expect(xpForNextLevel(1)).toBe(100);
    });

    it('returns 400 for level 2', () => {
      expect(xpForNextLevel(2)).toBe(400);
    });
  });

  describe('xpProgress', () => {
    it('calculates progress correctly', () => {
      const progress = xpProgress(150);
      expect(progress.percentage).toBeGreaterThan(0);
      expect(progress.percentage).toBeLessThanOrEqual(100);
    });

    it('returns 0% for start of level', () => {
      const progress = xpProgress(100);
      expect(progress.percentage).toBe(0);
    });
  });
});
