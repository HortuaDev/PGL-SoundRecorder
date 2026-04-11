import { useEffect, useState } from "react";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";

interface AudioPlaybackState {
  playingId: string | null;
  handlePlay: (id: string, uri: string) => void;
  stopPlayback: () => void;
}

export function useAudioPlayback(): AudioPlaybackState {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [playingUri, setPlayingUri] = useState<string | null>(null);
  const [shouldPlay, setShouldPlay] = useState<boolean>(false);

  const player = useAudioPlayer(playingUri ? { uri: playingUri } : null);
  const playerStatus = useAudioPlayerStatus(player);

  useEffect(() => {
    if (playerStatus.isLoaded && shouldPlay) {
      player.play();
      setShouldPlay(false);
    }
  }, [playerStatus.isLoaded, shouldPlay]);

  useEffect(() => {
    if (playerStatus.didJustFinish) {
      setPlayingId(null);
      setShouldPlay(false);
    }
  }, [playerStatus.didJustFinish]);

  const handlePlay = (id: string, uri: string): void => {
    // Si hay otro audio reproduciéndose, pararlo primero
    if (playingId !== null && playingId !== id) {
      player.pause();
      setPlayingUri(null);
      setShouldPlay(false);
      // Pequeño delay para que React procese el estado antes de cargar el nuevo
      setTimeout(() => {
        setPlayingId(id);
        setPlayingUri(uri);
        setShouldPlay(true);
      }, 50);
      return;
    }

    setPlayingId(id);

    if (playingUri === uri) {
      // Mismo audio ya cargado
      player.seekTo(0);
      player.play();
    } else {
      // Audio nuevo
      setPlayingUri(uri);
      setShouldPlay(true);
    }
  };

  const stopPlayback = (): void => {
    if (playingId !== null) {
      player.pause();
    }
    setPlayingId(null);
    setPlayingUri(null);
    setShouldPlay(false);
  };

  return { playingId, handlePlay, stopPlayback };
}