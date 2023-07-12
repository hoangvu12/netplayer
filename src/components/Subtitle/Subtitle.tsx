import { parse } from '@plussub/srt-vtt-parser';
import React, { useEffect, useMemo, useState } from 'react';
import { buildAbsoluteURL } from 'url-toolkit';
import { useSubtitleSettings } from '../../contexts/SubtitleSettingsContext';
import { useVideo } from '../../contexts/VideoContext';
import { useInteract } from '../../contexts/VideoInteractingContext';
import { useVideoState } from '../../contexts/VideoStateContext';
import useTextScaling from '../../hooks/useTextScaling';
import { classNames, isValidUrl } from '../../utils';
import { isDesktop } from '../../utils/device';
import styles from './Subtitle.module.css';

const textStyles = {
  none: '',
  outline: `black 0px 0px 3px, black 0px 0px 3px, black 0px 0px 3px, black 0px 0px 3px, black 0px 0px 3px`,
};

const BASE_FONT_SIZE = 16;
const LINE_HEIHT_RATIO = 1.333;
const PADDING_X_RATIO = 0.5;
const PADDING_Y_RATIO = 0.25;

const M3U8_SUBTITLE_REGEX = /.*\.(vtt|srt)/g;

const requestSubtitle = async (url: string): Promise<string | null> => {
  if (url.includes('vtt') || url.includes('srt')) {
    const response = await fetch(url);
    const text = await response.text();

    return text;
  }

  if (url.includes('m3u8')) {
    const response = await fetch(url);
    const text = await response.text();

    const matches = text.match(M3U8_SUBTITLE_REGEX);

    if (!matches?.length) return null;

    if (!matches[0]) return null;

    const nextUrl = isValidUrl(matches[0])
      ? matches[0]
      : buildAbsoluteURL(url, matches[0]);

    return requestSubtitle(nextUrl);
  }

  return null;
};

const Subtitle = () => {
  const { state } = useVideoState();
  const { state: subtitleSettings } = useSubtitleSettings();
  const { moderateScale } = useTextScaling();
  const { videoEl } = useVideo();
  const { isInteracting } = useInteract();
  const [currentText, setCurrentText] = useState<string>('');
  const [subtitleText, setSubtitleText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const subtitle = useMemo(
    () => state.subtitles?.find((sub) => sub.lang === state.currentSubtitle),
    [state.subtitles, state.currentSubtitle]
  );

  useEffect(() => {
    if (!subtitle?.file) return;

    const getSubtitle = async () => {
      setIsLoading(true);

      const text = await requestSubtitle(subtitle.file);

      setIsLoading(false);

      if (!text) return;

      setSubtitleText(text);
    };

    getSubtitle();
  }, [subtitle]);

  useEffect(() => {
    if (!subtitleText) return;
    if (!videoEl) return;

    const { entries = [] } = parse(subtitleText);

    const handleSubtitle = () => {
      const currentTime = videoEl.currentTime * 1000;
      const currentEntry = entries.find(
        (entry) => entry.from <= currentTime && entry.to >= currentTime
      );

      setCurrentText(currentEntry?.text || '');
    };

    videoEl.addEventListener('timeupdate', handleSubtitle);

    return () => {
      videoEl.removeEventListener('timeupdate', handleSubtitle);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtitleText]);

  const fontSize = useMemo(() => {
    return moderateScale(subtitleSettings.fontSize * BASE_FONT_SIZE);
  }, [moderateScale, subtitleSettings.fontSize]);

  const padding = useMemo(() => {
    return {
      horizontal: fontSize * PADDING_X_RATIO,
      vertical: fontSize * PADDING_Y_RATIO,
    };
  }, [fontSize]);

  const lineHeight = useMemo(() => {
    return fontSize * LINE_HEIHT_RATIO;
  }, [fontSize]);

  if (isLoading || !subtitle?.file || !currentText || state.isSubtitleDisabled)
    return null;

  return (
    <div
      className={classNames(
        styles.container,
        isInteracting && isDesktop && styles.interacting
      )}
    >
      <p
        className={classNames(styles.text)}
        style={{
          paddingLeft: padding.horizontal + 'px',
          paddingRight: padding.horizontal + 'px',
          paddingTop: padding.vertical + 'px',
          paddingBottom: padding.vertical + 'px',
          fontSize: fontSize + 'px',
          lineHeight: lineHeight + 'px',
          backgroundColor: `rgba(0, 0, 0, ${subtitleSettings.backgroundOpacity})`,
          color: `rgba(255, 255, 255, ${subtitleSettings.fontOpacity})`,
          textShadow: textStyles[subtitleSettings.textStyle],
        }}
        dangerouslySetInnerHTML={{
          __html: currentText,
        }}
      ></p>
    </div>
  );
};

export default Subtitle;
