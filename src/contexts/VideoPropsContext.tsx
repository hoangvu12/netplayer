import * as React from 'react';
import { IndicatorRef } from '../components/Indicator/Indicator';
import { PlayerProps } from '../components/Player/Player';
import backwardHotKey from '../hotkeys/backward';
import forwardHotKey from '../hotkeys/forward';
import fullscreenHotKey from '../hotkeys/fullscreen';
import playPauseHotKey from '../hotkeys/playPause';
import volumeHotKey from '../hotkeys/volume';
import { HotKey, Shortcuts } from '../types';
import { mergeDeep } from '../utils';

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
  Player: React.ForwardRefExoticComponent<
    PlayerProps & React.RefAttributes<HTMLVideoElement>
  >;
  MobileOverlay: React.FC;
  Overlay: React.FC;
  Controls: React.FC;
  MobileControls: React.FC;
};
export interface NetPlayerProps extends PlayerProps {
  i18n?: I18n;
  shortcuts?: Shortcuts;
  hotkeys?: HotKey[];
  components?: Partial<Components>;
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

// @ts-ignore
export const VideoPropsContext = React.createContext<
  Required<NetPlayerProps>
>();

export const VideoPropsProvider: React.FC<Partial<NetPlayerProps>> = ({
  children,
  ...props
}) => {
  const i18n = React.useMemo(() => mergeDeep(defaultI18n, props.i18n), [
    props.i18n,
  ]);
  const hotkeys = React.useMemo(
    () => mergeDeep(defaultHotKeys, props.hotkeys),
    [props.hotkeys]
  );

  return (
    // @ts-ignore
    <VideoPropsContext.Provider value={{ i18n, hotkeys, ...props }}>
      {children}
    </VideoPropsContext.Provider>
  );
};

export const useVideoProps = () => {
  return React.useContext(VideoPropsContext);
};

export default VideoPropsContext;
