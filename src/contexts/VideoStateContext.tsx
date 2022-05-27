import React, { useContext, useEffect } from 'react';
import { Audio, Subtitle } from '../types';

interface VideoState {
  subtitles: Subtitle[];
  qualities: string[];
  currentQuality: string | null;
  currentSubtitle: Subtitle | null;
  isSubtitleDisabled: boolean;
  currentAudio: Audio | null;
  audios: Audio[];
}

type StateSelector = (currentState: VideoState) => Partial<VideoState>;

type UpdateStateAction = (stateSelector: StateSelector) => void;

interface VideoContextProps {
  state: VideoState;
  setState: UpdateStateAction;
}

interface VideoContextProviderProps {
  defaultState?: Partial<VideoState>;
}

const defaultVideoState: VideoState = {
  subtitles: [],
  qualities: [],
  audios: [],
  currentQuality: null,
  currentSubtitle: null,
  currentAudio: null,
  isSubtitleDisabled: false,
};

export const VideoStateContext = React.createContext<VideoContextProps>({
  state: defaultVideoState,
  setState: () => {},
});

export const VideoStateContextProvider: React.FC<VideoContextProviderProps> = ({
  defaultState = {},
  children,
}) => {
  const [state, setState] = React.useState<VideoState>({
    ...defaultVideoState,
    ...defaultState,
  });

  useEffect(() => {
    setState({ ...state, ...defaultState });
  }, [defaultState]);

  const updateState: UpdateStateAction = stateSelector => {
    setState(prev => ({ ...prev, ...stateSelector(prev) }));
  };

  return (
    <VideoStateContext.Provider value={{ state, setState: updateState }}>
      {children}
    </VideoStateContext.Provider>
  );
};

export const useVideoState = () => {
  return useContext(VideoStateContext);
};
