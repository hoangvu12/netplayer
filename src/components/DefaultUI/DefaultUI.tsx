import * as React from 'react';
import { useInteract } from '../../contexts/VideoInteractingContext';
import { Components, NetPlayerProps } from '../../contexts/VideoPropsContext';
import useDoubleTap from '../../hooks/useDoubleTap';
import useGlobalHotKeys from '../../hooks/useGlobalHotKeys';
import { clamp, classNames } from '../../utils';
import { isMobile } from '../../utils/device';
import { IndicatorRef } from '../Indicator/Indicator';
import styles from './DefaultUI.module.css';

import Controls, { MobileVolumeSlider } from '../Controls';
import MobileBackwardIndicator from '../Indicator/MobileBackwardIndicator';
import MobileForwardIndicator from '../Indicator/MobileForwardIndicator';
import MobileControls from '../MobileControls';
import MobileOverlay from '../MobileOverlay';
import Overlay from '../Overlay';
import Player from '../Player/Player';
import Subtitle from '../Subtitle';
import { PLAYER_CONTAINER_CLASS } from '../../constants';
import { useVideo } from '../../contexts';

const noop = () => {};

const defaultComponents: Components = {
  Controls,
  MobileControls,
  MobileBackwardIndicator,
  MobileForwardIndicator,
  MobileOverlay,
  Overlay,
  Player,
  Subtitle,
  MobileVolumeSlider,
};

const DefaultUI = React.forwardRef<HTMLVideoElement, NetPlayerProps>(
  ({ hlsRef = React.createRef(), components, ...props }, ref) => {
    const videoRef = React.useRef<HTMLVideoElement | null>(null);
    const { setIsInteracting } = useInteract();
    const { videoEl } = useVideo();
    const interactingTimeout = React.useRef<NodeJS.Timeout>();
    const backIndicatorRef = React.useRef<IndicatorRef>(null);
    const forwardIndicatorRef = React.useRef<IndicatorRef>(null);

    const volumeSliderRef = React.useRef<IndicatorRef>(null);

    const isVolumeSliding = React.useRef(false);
    const moveTouchYRef = React.useRef(0);
    const touchYRef = React.useRef(0);
    const initialVolumeRef = React.useRef(0);

    const resetInteractingCycle = React.useCallback(() => {
      setIsInteracting(true);

      if (interactingTimeout.current) {
        clearTimeout(interactingTimeout.current);
      }

      interactingTimeout.current = setTimeout(() => {
        setIsInteracting(false);
      }, 3000);
    }, [setIsInteracting]);

    const uiComponents = React.useMemo(
      () => ({
        Controls: components?.Controls || defaultComponents.Controls,
        MobileControls:
          components?.MobileControls || defaultComponents.MobileControls,
        MobileBackwardIndicator:
          components?.MobileBackwardIndicator ||
          defaultComponents.MobileBackwardIndicator,
        MobileForwardIndicator:
          components?.MobileForwardIndicator ||
          defaultComponents.MobileForwardIndicator,
        MobileOverlay:
          components?.MobileOverlay || defaultComponents.MobileOverlay,
        Overlay: components?.Overlay || defaultComponents.Overlay,
        Player: components?.Player || defaultComponents.Player,
        Subtitle: components?.Subtitle || defaultComponents.Subtitle,
        MobileVolumeSlider:
          components?.MobileVolumeSlider ||
          defaultComponents.MobileVolumeSlider,
      }),
      [components]
    );

    const handleDoubleTap: React.DOMAttributes<HTMLDivElement>['onTouchStart'] =
      React.useCallback((e) => {
        if (!videoRef.current) return;

        const { clientX } = e.changedTouches[0];

        const widthPercent = 45;
        const width = (window.innerWidth * widthPercent) / 100;

        if (clientX < width) {
          backIndicatorRef?.current?.show();
          videoRef.current.currentTime = videoRef.current.currentTime - 10;
        } else if (clientX > window.innerWidth - width) {
          forwardIndicatorRef?.current?.show();
          videoRef.current.currentTime = videoRef.current.currentTime + 10;
        }
      }, []);

    const handleTap: React.DOMAttributes<HTMLDivElement>['onTouchStart'] =
      React.useCallback(
        (e) => {
          touchYRef.current = 0;
          moveTouchYRef.current = 0;

          if (isVolumeSliding.current) {
            isVolumeSliding.current = false;

            return;
          }

          const target = e.target as HTMLDivElement;
          const videoOverlay = document.querySelector('.mobile-overlay');

          if (!videoOverlay) {
            resetInteractingCycle();

            return;
          }

          const shouldCloseControls =
            target.classList.contains('mobile-overlay');

          if (shouldCloseControls) {
            setIsInteracting(false);

            return;
          }

          resetInteractingCycle();
        },
        [resetInteractingCycle, setIsInteracting]
      );

    const onTap = useDoubleTap({
      onDoubleTap: handleDoubleTap,
      onTap: handleTap,
      tapThreshold: 250,
    });

    const handleTouchMove: React.TouchEventHandler<HTMLDivElement> =
      React.useCallback(
        (e) => {
          const { clientX, clientY } = e.touches[0];

          const widthPercent = 45;
          const width = (window.innerWidth * widthPercent) / 100;

          if (clientX > window.innerWidth - width) {
            if (!touchYRef?.current) return;

            volumeSliderRef.current?.show(false);

            const sliderElement = document.querySelector(
              '.mobile-volume-slider'
            );

            if (!sliderElement) return;
            if (!videoEl) return;

            const sliderHeight = sliderElement.clientHeight;

            const draggedHeight = clientY - touchYRef.current;

            const draggedVolume = Math.abs(draggedHeight / sliderHeight);

            let draggedValue = 0;

            touchYRef.current = clientY;

            if (clientY > moveTouchYRef.current) {
              initialVolumeRef.current =
                initialVolumeRef.current - draggedVolume;

              draggedValue = initialVolumeRef.current - draggedVolume;
            } else {
              initialVolumeRef.current =
                initialVolumeRef.current + draggedVolume;

              draggedValue = initialVolumeRef.current + draggedVolume;
            }

            moveTouchYRef.current = clientY;

            videoEl.volume = clamp(draggedValue, 0, 1);

            isVolumeSliding.current = true;
          }
        },
        [videoEl]
      );

    const handleTouchStart: React.TouchEventHandler<HTMLDivElement> =
      React.useCallback(
        (e) => {
          touchYRef.current = e.touches[0].clientY;
          initialVolumeRef.current = videoEl?.volume ?? 1;
        },
        [videoEl?.volume]
      );

    useGlobalHotKeys(videoRef.current!);

    const playerRef = React.useCallback(
      (node) => {
        videoRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLVideoElement>).current = node;
        }
      },
      [ref]
    );

    return (
      <div
        onClick={!isMobile ? resetInteractingCycle : noop}
        onMouseMove={!isMobile ? resetInteractingCycle : noop}
        onTouchStart={isMobile ? handleTouchStart : noop}
        onTouchEnd={isMobile ? onTap : noop}
        onTouchMove={isMobile ? handleTouchMove : noop}
        className={classNames(PLAYER_CONTAINER_CLASS, styles.container)}
      >
        <uiComponents.MobileBackwardIndicator ref={backIndicatorRef} />
        <uiComponents.MobileForwardIndicator ref={forwardIndicatorRef} />
        <uiComponents.MobileVolumeSlider ref={volumeSliderRef} />

        <uiComponents.Subtitle />

        <div className={styles.playerContainer}>
          <uiComponents.Player ref={playerRef} hlsRef={hlsRef} {...props} />
        </div>

        <div className={styles.overlayContainer}>
          {isMobile ? <uiComponents.MobileOverlay /> : <uiComponents.Overlay />}
        </div>

        <div className={styles.controlsContainer}>
          {isMobile ? (
            <uiComponents.MobileControls />
          ) : (
            <uiComponents.Controls />
          )}
        </div>
      </div>
    );
  }
);

DefaultUI.displayName = 'DefaultUI';

export default React.memo(DefaultUI);
