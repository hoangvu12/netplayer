import React, { useContext, useEffect, useMemo } from 'react';
import { Audio, Subtitle } from '../types';
import { isInArray } from '../utils';
import { useVideoProps } from './VideoPropsContext';

export interface VideoState {
  subtitles: Subtitle[];
  qualities: string[];
  currentQuality: string | null;
  currentSubtitle: string | null;
  isSubtitleDisabled: boolean;
  currentAudio: string | null;
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

const LOCALSTORAGE_KEY = 'netplayer_video_settings';

export const VideoStateContextProvider: React.FC<VideoContextProviderProps> = ({
  children,
}) => {
  const props = useVideoProps();

  const defaultQualities = useMemo(
    () =>
      props.sources.filter(source => source.label).map(source => source.label!),
    [props.sources]
  );

  const defaultState = useMemo(
    () => ({
      currentSubtitle: props.subtitles[0].lang,
      subtitles: props.subtitles,
      qualities: defaultQualities,
    }),
    [props.subtitles, defaultQualities]
  );

  const [state, setState] = React.useState<VideoState>({
    ...defaultVideoState,
    ...defaultState,
  });

  useEffect(() => {
    const rawSettings = localStorage.getItem(LOCALSTORAGE_KEY);

    if (!rawSettings) return;

    const settings: Partial<VideoState> = JSON.parse(rawSettings);

    const langAudios = state.audios.map(a => a.lang);
    const langSubtitles = state.subtitles.map(s => s.lang);
    const langQualities = state.qualities;

    const filteredSettings = {
      currentAudio: isInArray(settings?.currentAudio, langAudios)
        ? (settings.currentAudio as string)
        : null,
      currentQuality: isInArray(settings?.currentQuality, langQualities)
        ? (settings.currentQuality as string)
        : null,
      currentSubtitle: isInArray(settings?.currentSubtitle, langSubtitles)
        ? (settings.currentSubtitle as string)
        : null,
    };

    setState({
      ...defaultVideoState,
      ...defaultState,
      ...props?.defaultVideoState,
      ...filteredSettings,
    });
  }, [defaultState]);

  useEffect(() => {
    const {
      currentAudio,
      currentQuality,
      currentSubtitle,
      isSubtitleDisabled,
    } = state;

    localStorage.setItem(
      LOCALSTORAGE_KEY,
      JSON.stringify({
        currentAudio,
        currentQuality,
        currentSubtitle,
        isSubtitleDisabled,
      })
    );
  }, [state]);

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
