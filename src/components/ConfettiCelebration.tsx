import { useCallback, useRef } from 'react';
import ReactCanvasConfetti from 'react-canvas-confetti';

export function ConfettiCelebration() {
  const refAnimationInstance = useRef<confetti.CreateTypes | null>(null);

  const getInstance = useCallback((instance: confetti.CreateTypes | null) => {
    refAnimationInstance.current = instance;
  }, []);

  const makeShot = useCallback((particleRatio: number, opts: confetti.Options) => {
    refAnimationInstance.current?.({
      ...opts,
      origin: { y: 0.7 },
      particleCount: Math.floor(200 * particleRatio),
    });
  }, []);

  const fire = useCallback(() => {
    makeShot(0.25, {
      spread: 26,
      startVelocity: 55,
      colors: ['#00AEEF', '#14F1FF', '#0066FF', '#E6F1FF'],
    });

    makeShot(0.2, {
      spread: 60,
      colors: ['#00AEEF', '#14F1FF', '#0066FF'],
    });

    makeShot(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
      colors: ['#00AEEF', '#14F1FF'],
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
      colors: ['#14F1FF', '#0066FF'],
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 45,
      colors: ['#00AEEF'],
    });
  }, [makeShot]);

  return (
    <>
      <ReactCanvasConfetti
        refConfetti={getInstance}
        style={{
          position: 'fixed',
          pointerEvents: 'none',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          zIndex: 9999,
        }}
      />
      <button
        id="confetti-trigger"
        className="hidden"
        onClick={fire}
      />
    </>
  );
}

export const triggerConfetti = () => {
  const button = document.getElementById('confetti-trigger');
  button?.click();
};
