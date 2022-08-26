import React from 'react';
import { useVideo, useVideoProps } from '../../contexts';
import { download, randomString } from '../../utils';
import CameraIcon from '../icons/CameraIcon';
import ControlButton from './ControlButton';

const ScreenshotButton = () => {
  const { videoEl } = useVideo();
  const { i18n } = useVideoProps();

  const snapshot = function () {
    if (!videoEl) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    canvas.width = videoEl.videoWidth;
    canvas.height = videoEl.videoHeight;

    ctx.drawImage(videoEl, 0, 0);
    const fileName = randomString(10) + '.png';
    const imageUrl = canvas.toDataURL('image/png');

    download(imageUrl, fileName);
  };

  return (
    <ControlButton tooltip={i18n.controls.screenshot} onClick={snapshot}>
      <CameraIcon />
    </ControlButton>
  );
};

export default ScreenshotButton;
