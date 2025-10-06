import { useEffect, useRef } from 'react';

export const useButtonSound = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Pre-load the audio for instant playback
    audioRef.current = new Audio('/sounds/toque-buttons.mp3');
    audioRef.current.preload = 'auto';
    audioRef.current.load();
  }, []);

  const playSound = () => {
    if (audioRef.current) {
      // Clone the audio to allow rapid successive clicks
      const sound = audioRef.current.cloneNode() as HTMLAudioElement;
      sound.volume = 0.3; // Adjust volume as needed
      sound.play().catch(() => {
        // Silently fail if audio can't play (e.g., user hasn't interacted with page yet)
      });
    }
  };

  return playSound;
};
