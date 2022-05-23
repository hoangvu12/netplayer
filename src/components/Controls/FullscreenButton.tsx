import React, { useCallback, useEffect, useState } from 'react';
import { PLAYER_CONTAINER_CLASS } from '../../constants';
import { useVideoProps } from '../../contexts/VideoPropsContext';
import useHotKey, { parseHotKey } from '../../hooks/useHotKey';
import { stringInterpolate } from '../../utils';
import screenfull from '../../utils/screenfull';
import FullscreenEnterIcon from '../icons/FullscreenEnterIcon';
import FullscreenExitIcon from '../icons/FullscreenExitIcon';
import ControlButton from './ControlButton';

const FullscreenButton = () => {
  const [isFullscreen, setIsFullscreen] = useState(screenfull.isFullscreen);
  const { i18n } = useVideoProps();
  const hotkey = useHotKey('fullscreen');

  const handleFullscreen = useCallback(() => {
    if (!screenfull.isEnabled) return;

    const containerEl = document.querySelector(PLAYER_CONTAINER_CLASS);

    if (!isFullscreen) {
      // @ts-ignore
      screenfull.request(containerEl);
      setIsFullscreen(true);
    } else {
      screenfull.exit();
      setIsFullscreen(false);
    }
  }, [isFullscreen]);

  useEffect(() => {
    const handleFullscreen = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    const containerEl = document.querySelector(PLAYER_CONTAINER_CLASS);

    containerEl?.addEventListener('fullscreenchange', handleFullscreen);

    return () => {
      containerEl?.removeEventListener('fullscreenchange', handleFullscreen);
    };
  }, []);

  return (
    <ControlButton
      tooltip={
        !isFullscreen
          ? stringInterpolate(i18n.controls.enterFullscreen, {
              shortcut: parseHotKey(hotkey?.hotKey),
            })
          : stringInterpolate(i18n.controls.exitFullscreen, {
              shortcut: parseHotKey(hotkey?.hotKey),
            })
      }
      onClick={handleFullscreen}
    >
      {!isFullscreen ? <FullscreenEnterIcon /> : <FullscreenExitIcon />}
    </ControlButton>
  );
};

export default FullscreenButton;
