import React from 'react';
import { SubtitleSettingsProvider } from './SubtitleSettingsContext';
import { VideoInteractingContextProvider } from './VideoInteractingContext';
import { NetPlayerProps, VideoPropsProvider } from './VideoPropsContext';
import { VideoStateContextProvider } from './VideoStateContext';

const GlobalContext: React.FC<NetPlayerProps> = ({
  sources,
  subtitles = [],
  children,
  ...props
}) => {
  return (
    <VideoPropsProvider sources={sources} subtitles={subtitles} {...props}>
      <VideoStateContextProvider>
        <VideoInteractingContextProvider>
          <SubtitleSettingsProvider>{children}</SubtitleSettingsProvider>
        </VideoInteractingContextProvider>
      </VideoStateContextProvider>
    </VideoPropsProvider>
  );
};

export default GlobalContext;
