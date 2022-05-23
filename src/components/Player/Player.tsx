import Hls from 'hls.js';
import * as React from 'react';
import { useVideoState } from '../../contexts/VideoStateContext';
import { Source, Subtitle } from '../../types';
import { parseNumberFromString } from '../../utils';
import styles from './Player.module.css';

export interface PlayerProps extends React.HTMLAttributes<HTMLVideoElement> {
  sources: Source[];
  subtitles?: Subtitle[];
  hlsRef?: React.MutableRefObject<Hls | null>;
  hlsConfig?: Hls['config'];
  changeSourceUrl?: (currentSourceUrl: string, source: Source) => string;
  onHlsInit?: (hls: Hls) => void;
  autoPlay?: boolean;
}

const Player = React.forwardRef<HTMLVideoElement, PlayerProps>(
  (
    {
      sources,
      subtitles,
      children,
      hlsRef,
      hlsConfig,
      changeSourceUrl,
      onHlsInit,
      autoPlay,
      ...props
    },
    ref
  ) => {
    const innerRef = React.useRef<HTMLVideoElement>();
    const hls = React.useRef<Hls | null>(null);
    const { state, setState } = useVideoState();

    const playerRef = React.useCallback(
      node => {
        innerRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLVideoElement>).current = node;
        }
      },
      [ref]
    );

    const initQuality = React.useCallback(() => {
      const sortedQualities = sources
        .filter(src => !!src.label)
        .map(src => src.label as string)
        .sort((a, b) => parseNumberFromString(b) - parseNumberFromString(a));

      const notDuplicatedQualities: string[] = [
        ...Array.from(new Set<string>(sortedQualities)),
      ];

      setState(() => ({
        qualities: notDuplicatedQualities,
        currentQuality: sortedQualities[0],
      }));
    }, [sources]);

    const initPlayer = React.useCallback(
      async (source: Source) => {
        async function _initHlsPlayer() {
          if (hls.current !== null) {
            hls.current.destroy();
          }

          let _hls: Hls = new Hls({
            xhrSetup: (xhr, url) => {
              let requestUrl = changeSourceUrl?.(url, source) || url;

              xhr.open('GET', requestUrl, true);
            },
            ...hlsConfig,
          });

          if (hlsRef) {
            hlsRef.current = _hls;
          }

          hls.current = _hls;

          if (innerRef.current != null) {
            _hls.attachMedia(innerRef.current);
          }

          _hls.on(Hls.Events.MEDIA_ATTACHED, () => {
            _hls.loadSource(source.file);

            _hls.on(Hls.Events.MANIFEST_PARSED, _ => {
              if (autoPlay) {
                innerRef?.current
                  ?.play()
                  .catch(() =>
                    console.error(
                      'User must interact before playing the video.'
                    )
                  );
              }

              if (sources.length > 1) return;
              if (!_hls.levels?.length) return;

              const levels: string[] = _hls.levels
                .sort((a, b) => b.height - a.height)
                .filter(level => level.height)
                .map(level => `${level.height}p`);

              setState(() => ({
                qualities: levels,
                currentQuality: levels[0],
              }));
            });
          });

          _hls.on(Hls.Events.ERROR, function(event, data) {
            console.log('ERROR:', event, data);

            if (data.fatal) {
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  _hls.startLoad();
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                  _hls.recoverMediaError();

                  break;
              }
            }
          });

          onHlsInit?.(_hls);
        }

        if (source.file.includes('m3u8')) {
          _initHlsPlayer();
        } else {
          if (!innerRef.current) return;

          if (innerRef.current.src) {
            innerRef.current.pause();
          }

          innerRef.current.src = source.file;

          innerRef.current.load();
        }
      },
      [sources]
    );

    React.useEffect(() => {
      let _hls = hls.current;

      initPlayer(sources[0]);

      // If the sources have multiple m3u8 urls, then we have to handle quality ourself (because hls.js only handle quality with playlist url).
      // Same with the sources that have multiple mp4 urls.
      if (!sources[0].file.includes('m3u8') || sources.length > 1) {
        initQuality();
      }

      return () => {
        if (_hls !== null) {
          _hls.destroy();
        }
      };
    }, [sources]);

    React.useEffect(() => {
      const videoRef = innerRef.current;

      if (!videoRef) return;
      if (!state?.qualities.length) return;

      const currentQuality = state?.currentQuality;

      // If the sources contain only one m3u8 url, then it maybe is a playlist.
      if (sources[0].file.includes('m3u8') && sources.length === 1) {
        // Check if the playlist gave us qualities.
        if (!hls?.current?.levels?.length) return;
        if (!currentQuality) return;

        // Handle changing quality.
        hls.current.currentLevel = hls.current.levels.findIndex(
          level => level.height === Number(currentQuality.replace('p', ''))
        );

        return;
      }

      const beforeChangeTime = videoRef.currentTime;

      const qualitySource = sources.find(
        source => source.label === state.currentQuality
      );

      if (!qualitySource) return;

      initPlayer(qualitySource);

      const handleQualityChange = () => {
        videoRef.currentTime = beforeChangeTime;
        videoRef.play();
      };

      videoRef.addEventListener('canplay', handleQualityChange, {
        once: true,
      });

      return () => {
        videoRef.removeEventListener('canplay', handleQualityChange);
      };
    }, [state?.currentQuality]);

    return (
      <video
        ref={playerRef}
        autoPlay={autoPlay}
        preload="auto"
        className={styles.video}
        {...props}
      >
        {children}
      </video>
    );
  }
);

export default Player;
