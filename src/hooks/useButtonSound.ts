import { useEffect, useRef } from 'react';
import { useSettings } from '@/contexts/SettingsContext';

export const useButtonSound = () => {
  const { settings } = useSettings();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Pre-load the audio for instant playback
    audioRef.current = new Audio('/sounds/toque-buttons.mp3');
    audioRef.current.preload = 'auto';
    audioRef.current.load();
  }, []);

  const playSound = () => {
    if (audioRef.current && settings.soundEffects) {
      // Clone the audio to allow rapid successive clicks
      const sound = audioRef.current.cloneNode() as HTMLAudioElement;
      sound.volume = settings.soundVolume / 100; // Use volume from settings
      sound.play().catch(() => {
        // Silently fail if audio can't play (e.g., user hasn't interacted with page yet)
      });
    }
  };

  return playSound;
};
