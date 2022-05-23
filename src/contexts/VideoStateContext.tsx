import React, { useContext } from 'react';
import { Subtitle } from '../types';

interface VideoState {
  subtitles: Subtitle[];
  qualities: string[];
  currentQuality: string | null;
  currentSubtitle: Subtitle | null;
  isSubtitleDisabled: boolean;
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
  currentQuality: null,
  currentSubtitle: null,
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

  const updateState: UpdateStateAction = stateSelector => {
    const newState = stateSelector(state);

    setState({ ...state, ...newState });
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
