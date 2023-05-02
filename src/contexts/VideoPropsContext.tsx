import * as React from 'react';
import { IndicatorRef } from '../components/Indicator/Indicator';
import { PlayerProps } from '../components/Player/Player';
import backwardHotKey from '../hotkeys/backward';
import forwardHotKey from '../hotkeys/forward';
import fullscreenHotKey from '../hotkeys/fullscreen';
import playPauseHotKey from '../hotkeys/playPause';
import volumeHotKey from '../hotkeys/volume';
import { HotKey, Shortcuts, Subtitle } from '../types';
import { mergeDeep } from '../utils';
import { VideoState } from './VideoStateContext';

interface I18nControls extends I18nField {
  play: string;
  pause: string;
  forward: string;
  backward: string;
  enableSubtitle: string;
  disableSubtitle: string;
  settings: string;
  enterFullscreen: string;
  exitFullscreen: string;
  muteVolume: string;
  unmuteVolume: string;
  sliderDragMessage: string;
}

interface I18nSettings extends I18nField {
  playbackSpeed: string;
  subtitle: string;
  quality: string;
  subtitleSettings: string;
  reset: string;
  off: string;
  none: string;
  subtitleTextStyle: string;
  subtitleBackgroundOpacity: string;
  subtitleFontOpacity: string;
  subtitleFontSize: string;
  audio: string;
}

type I18nField = { [k: string]: string | I18nField };
export interface I18n extends I18nField {
  controls: I18nControls;
  settings: I18nSettings;
}

export type Components = {
  Subtitle: React.FC;
  MobileBackwardIndicator: React.ForwardRefExoticComponent<
    React.RefAttributes<IndicatorRef>
  >;
  MobileForwardIndicator: React.ForwardRefExoticComponent<
    React.RefAttributes<IndicatorRef>
  >;
  MobileVolumeSlider: React.ForwardRefExoticComponent<
    React.RefAttributes<IndicatorRef>
  >;
  Player: React.ForwardRefExoticComponent<
    PlayerProps & React.RefAttributes<HTMLVideoElement>
  >;
  MobileOverlay: React.FC;
  Overlay: React.FC;
  Controls: React.FC;
  MobileControls: React.FC;
};

export interface NetPlayerProps extends PlayerProps {
  thumbnail?: string;
  i18n?: I18n;
  shortcuts?: Shortcuts;
  hotkeys?: HotKey[];
  subtitles?: Subtitle[];
  components?: Partial<Components>;
  defaultVideoState?: Pick<
    VideoState,
    'currentAudio' | 'currentQuality' | 'currentSubtitle' | 'isSubtitleDisabled'
  >;
  disableVolumeSlider?: Boolean;
}

const defaultI18n: I18n = {
  controls: {
    play: 'Play ({{shortcut}})',
    pause: 'Pause ({{shortcut}})',
    forward: 'Forward {{time}} seconds',
    backward: 'Backward {{time}} seconds',
    enableSubtitle: 'Enable subtitles',
    disableSubtitle: 'Disable subtitles',
    settings: 'Settings',
    enterFullscreen: 'Enter fullscreen ({{shortcut}})',
    exitFullscreen: 'Exit fullscreen ({{shortcut}})',
    muteVolume: 'Mute ({{shortcut}})',
    unmuteVolume: 'Unmute ({{shortcut}})',
    sliderDragMessage: 'Drag to seek video',
    screenshot: 'Screenshot',
  },
  settings: {
    audio: 'Audio',
    playbackSpeed: 'Playback speed',
    quality: 'Quality',
    subtitle: 'Subtitle',
    subtitleSettings: 'Subtitle settings',
    reset: 'Reset',
    none: 'None',
    off: 'Off',
    subtitleBackgroundOpacity: 'Background Opacity',
    subtitleFontOpacity: 'Font Opacity',
    subtitleFontSize: 'Font Size',
    subtitleTextStyle: 'Text Style',
  },
};

const defaultHotKeys: HotKey[] = [
  playPauseHotKey(),
  backwardHotKey(),
  forwardHotKey(),
  fullscreenHotKey(),
  volumeHotKey(),
];

const mergeHotkeys = (main: HotKey[], target: HotKey[]) => {
  for (const hotkey of target) {
    const index = main.findIndex((h) => h.hotKey === hotkey.hotKey);

    if (index !== -1) {
      main[index] = hotkey;
    } else {
      main.push(hotkey);
    }
  }

  return main;
};

export const VideoPropsContext =
  // @ts-ignore
  React.createContext<Required<NetPlayerProps>>(null);

export const VideoPropsProvider: React.FC<Partial<NetPlayerProps>> = ({
  children,
  ...props
}) => {
  const i18n = React.useMemo(
    () => mergeDeep(defaultI18n, props.i18n),
    [props.i18n]
  );
  const hotkeys = React.useMemo(
    () => mergeHotkeys(defaultHotKeys, props.hotkeys || []),
    [props.hotkeys]
  );

  return (
    // @ts-ignore
    <VideoPropsContext.Provider value={{ ...props, i18n, hotkeys }}>
      {children}
    </VideoPropsContext.Provider>
  );
};

export const useVideoProps = () => {
  return React.useContext(VideoPropsContext);
};

export default VideoPropsContext;
