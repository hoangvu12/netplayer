import Hls, { Events } from 'hls.js';
import React, { useCallback, useContext, useEffect } from 'react';

interface VideoState {
  currentTime: number;
  duration: number;
  ended: boolean;
  paused: boolean;
  volume: number;
  buffering: boolean;
  error: string | null;
  seeking: boolean;
}

interface VideoContextProps {
  videoEl: HTMLVideoElement | null;
  videoState: VideoState;
  setVideoState: (state: Partial<VideoState>) => void;
}

interface VideoContextProviderProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  hlsRef: React.RefObject<Hls>;
}

const defaultState: VideoState = {
  currentTime: 0,
  buffering: true,
  duration: 0,
  ended: false,
  paused: true,
  volume: 1,
  seeking: false,
  error: '',
};

export const VideoContext = React.createContext<VideoContextProps>({
  videoEl: null,
  videoState: defaultState,
  setVideoState: () => {},
});

export const VideoContextProvider: React.FC<VideoContextProviderProps> = ({
  videoRef,
  hlsRef,
  children,
}) => {
  const [videoState, setVideoState] = React.useState<VideoState>(defaultState);
  const [videoEl, setVideoEl] = React.useState<HTMLVideoElement | null>(null);
  const [hls, setHls] = React.useState<Hls | null>(null);

  const updateState = useCallback((state: Partial<VideoState>) => {
    setVideoState(prev => ({ ...prev, ...state }));
  }, []);

  useEffect(() => {
    if (!videoRef?.current) return;

    setVideoEl(videoRef.current);
  }, []);

  useEffect(() => {
    if (!hlsRef?.current) return;

    setHls(hlsRef.current);
  }, []);

  useEffect(() => {
    if (!videoEl) return;

    const handleError = () => {
      updateState({
        error: videoEl.error?.message || 'Something went wrong with video',
      });
    };

    const handleWaiting = () => {
      updateState({
        buffering: true,
      });
    };

    const handleloadeddata = () => {
      updateState({
        currentTime: videoEl.currentTime,
        duration: videoEl.duration,
        buffering: false,
        error: null,
      });
    };

    const handlePlay = () => {
      updateState({
        paused: false,
        buffering: false,
      });
    };

    const handlePause = () => {
      updateState({
        paused: true,
      });
    };

    const handleTimeupdate = () => {
      updateState({
        currentTime: videoEl.currentTime,
        duration: videoEl.duration,
        buffering: false,
        error: null,
        paused: false,
      });
    };

    const handleEnded = () => {
      updateState({ ended: true, paused: true });
    };

    const handleVolumeChange = () => {
      updateState({ volume: videoEl.volume });
    };

    videoEl.addEventListener('waiting', handleWaiting);
    videoEl.addEventListener('loadeddata', handleloadeddata);
    videoEl.addEventListener('play', handlePlay);
    videoEl.addEventListener('playing', handlePlay);
    videoEl.addEventListener('pause', handlePause);
    videoEl.addEventListener('timeupdate', handleTimeupdate);
    videoEl.addEventListener('ended', handleEnded);
    videoEl.addEventListener('volumechange', handleVolumeChange);
    videoEl.addEventListener('error', handleError);

    return () => {
      videoEl.removeEventListener('waiting', handleWaiting);
      videoEl.removeEventListener('loadeddata', handleloadeddata);
      videoEl.removeEventListener('play', handlePlay);
      videoEl.removeEventListener('playing', handlePlay);
      videoEl.removeEventListener('pause', handlePause);
      videoEl.removeEventListener('timeupdate', handleTimeupdate);
      videoEl.removeEventListener('ended', handleEnded);
      videoEl.removeEventListener('volumechange', handleVolumeChange);
      videoEl.removeEventListener('error', handleError);
    };
  }, [videoEl]);

  useEffect(() => {
    if (!hls) return;

    hls.on(Events.ERROR, (_, data) => {
      updateState({
        error: data.details,
      });
    });
  }, [hls]);

  return (
    <VideoContext.Provider
      value={{ videoEl, videoState, setVideoState: updateState }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export const useVideo = () => {
  return useContext(VideoContext);
};
