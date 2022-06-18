import * as React from 'react';
import { useVideoState } from '../../contexts/VideoStateContext';
import { Source, Subtitle } from '../../types';
import { parseNumberFromString } from '../../utils';
import styles from './Player.module.css';
import Hls from '../../types/hls.js';
import loadScript from '../../utils/load-script';

const HLS_SCRIPT_URL =
  'https://cdn.jsdelivr.net/npm/hls.js@latest/dist/hls.min.js';
const HLS_VARIABLE_NAME = 'Hls';

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
      (node) => {
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
        .filter((src) => !!src.label)
        .map((src) => src.label as string)
        .sort((a, b) => parseNumberFromString(b) - parseNumberFromString(a));

      const notDuplicatedQualities: string[] = [
        ...Array.from(new Set<string>(sortedQualities)),
      ];

      setState(() => ({
        qualities: notDuplicatedQualities,
        currentQuality: sortedQualities[0],
      }));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sources]);

    const initPlayer = React.useCallback(
      async (source: Source) => {
        async function _initHlsPlayer() {
          if (hls.current !== null) {
            hls.current.destroy();
          }

          const HlsSDK = await loadScript<typeof Hls>(
            HLS_SCRIPT_URL,
            HLS_VARIABLE_NAME
          );

          const _hls: Hls = new HlsSDK({
            xhrSetup: (xhr, url) => {
              const requestUrl = changeSourceUrl?.(url, source) || url;

              xhr.open('GET', requestUrl, true);
            },
            ...hlsConfig,
          });

          _hls.subtitleTrack = -1;
          _hls.subtitleDisplay = false;

          if (hlsRef) {
            hlsRef.current = _hls;
          }

          hls.current = _hls;

          if (innerRef.current != null) {
            _hls.attachMedia(innerRef.current);
          }

          _hls.on(Hls.Events.MEDIA_ATTACHED, () => {
            _hls.loadSource(source.file);

            _hls.on(Hls.Events.MANIFEST_PARSED, () => {
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
                .filter((level) => level.height)
                .map((level) => `${level.height}p`);

              setState(() => ({
                qualities: levels,
                currentQuality: levels[0],
              }));
            });
          });

          _hls.on(Hls.Events.SUBTITLE_TRACKS_UPDATED, (_, event) => {
            const modifiedSubtitles = event.subtitleTracks.map(
              (track, index) => ({
                file: track.details?.fragments?.[0].url || track.url,
                lang: track.lang || index.toString(),
                language: track.name,
              })
            );

            setState(() => ({
              subtitles: modifiedSubtitles,
              currentSubtitle: modifiedSubtitles[0]?.lang,
            }));
          });

          _hls.on(Hls.Events.AUDIO_TRACKS_UPDATED, (_, event) => {
            const modifiedAudios = event.audioTracks.map((track, index) => ({
              lang: track.lang || index.toString(),
              language: track.name,
            }));

            setState(() => ({
              audios: modifiedAudios,
              currentAudio:
                modifiedAudios[_hls.audioTrack >= 0 ? _hls.audioTrack : 0]
                  ?.lang,
            }));
          });

          _hls.on(Hls.Events.ERROR, function (event, data) {
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [sources]
    );

    React.useEffect(() => {
      const _hls = hls.current;

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
      // eslint-disable-next-line react-hooks/exhaustive-deps
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
          (level) => level.height === Number(currentQuality.replace('p', ''))
        );

        return;
      }

      const beforeChangeTime = videoRef.currentTime;

      const qualitySource = sources.find(
        (source) => source.label === state.currentQuality
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state?.currentQuality]);

    React.useEffect(() => {
      const videoRef = innerRef.current;

      if (!videoRef) return;
      if (!state?.audios.length) return;
      if (!hls?.current) return;

      const currentAudio = state?.currentAudio;

      if (!currentAudio) return;

      const currentAudioTrack = state.audios.findIndex(
        (audio) => audio.lang === currentAudio
      );

      hls.current.audioTrack = currentAudioTrack;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state?.currentAudio]);

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

Player.displayName = 'Player';

export default Player;
