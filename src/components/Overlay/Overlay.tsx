import * as React from 'react';
import { useVideo } from '../../contexts/VideoContext';
import styles from './Overlay.module.css';

const Overlay = () => {
  const { videoEl } = useVideo();

  const handleToggleVideo = () => {
    if (!videoEl) return;

    if (videoEl.paused) {
      videoEl.play();
    } else {
      videoEl.pause();
    }
  };

  return (
    <div onClick={handleToggleVideo} className={styles.overlayContainer}></div>
  );
};

export default Overlay;
