import React, { useMemo } from 'react'
import { PlayerProps } from '../components/Player/Player'
import { SubtitleSettingsProvider } from './SubtitleSettingsContext'
import { VideoInteractingContextProvider } from './VideoInteractingContext'
import { VideoPropsProvider } from './VideoPropsContext'
import { VideoStateContextProvider } from './VideoStateContext'

const GlobalContext: React.FC<PlayerProps> = ({
  sources,
  subtitles = [],
  children,
  ...props
}) => {
  const defaultQualities = useMemo(
    () =>
      sources.filter((source) => source.label).map((source) => source.label!),
    [sources]
  )

  return (
    <VideoStateContextProvider
      defaultState={{
        subtitles,
        qualities: defaultQualities,
        currentSubtitle: subtitles[0]
      }}
    >
      <VideoPropsProvider sources={sources} subtitles={subtitles} {...props}>
        <VideoInteractingContextProvider>
          <SubtitleSettingsProvider>{children}</SubtitleSettingsProvider>
        </VideoInteractingContextProvider>
      </VideoPropsProvider>
    </VideoStateContextProvider>
  )
}

export default GlobalContext
