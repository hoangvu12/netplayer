import * as React from 'react';
import { useVideoState } from '../../contexts/VideoStateContext';
import { Source } from '../../types';
import { parseNumberFromString } from '../../utils';
import styles from './Player.module.css';
import Hls from '../../types/hls.js';
import DashJS from '../../types/dashjs';
import loadScript from '../../utils/load-script';

const HLS_SCRIPT_URL =
  'https://cdn.jsdelivr.net/npm/hls.js@latest/dist/hls.min.js';
const HLS_VARIABLE_NAME = 'Hls';
const DASH_SCRIPT_URL =
  'https://cdn.jsdelivr.net/npm/dashjs@latest/dist/dash.all.min.js';
const DASH_VARIABLE_NAME = 'dashjs';

export interface PlayerProps extends React.HTMLAttributes<HTMLVideoElement> {
  sources: Source[];
  hlsRef?: React.MutableRefObject<Hls | null>;
  dashRef?: React.MutableRefObject<DashJS.MediaPlayerClass | null>;
  hlsConfig?: Hls['config'];
  changeSourceUrl?: (currentSourceUrl: string, source: Source) => string;
  onHlsInit?: (hls: Hls, currentSource: Source) => void;
  onDashInit?: (dash: DashJS.MediaPlayerClass, currentSource: Source) => void;
  onInit?: (videoEl: HTMLVideoElement) => void;
  autoPlay?: boolean;
  preferQuality?: (qualities: string[]) => string;
}

const shouldPlayHls = (source: Source) =>
  source.file.includes('m3u8') || source.type === 'hls';

const shouldPlayDash = (source: Source) =>
  source.file.includes('mpd') || source.type === 'dash';

const noop = () => {};

const Player = React.forwardRef<HTMLVideoElement, PlayerProps>(
  (
    {
      sources,
      children,
      hlsRef,
      dashRef,
      hlsConfig,
      changeSourceUrl,
      onHlsInit = noop,
      onDashInit = noop,
      onInit = noop,
      autoPlay = false,
      preferQuality,
      ...props
    },
    ref
  ) => {
    const innerRef = React.useRef<HTMLVideoElement>();
    const hls = React.useRef<Hls | null>(null);
    const dashjs = React.useRef<DashJS.MediaPlayerClass | null>(null);
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

          if (HlsSDK.isSupported()) {
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

            onHlsInit?.(_hls, source);

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

                const level = preferQuality?.(levels) || levels[0];

                setState(() => ({
                  qualities: levels,
                  currentQuality: level,
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
          } else if (
            innerRef.current?.canPlayType('application/vnd.apple.mpegurl')
          ) {
            innerRef.current.src = source.file;
          }
        }

        async function _initDashPlayer() {
          if (!innerRef.current) return;

          if (dashjs.current !== null) {
            dashjs.current.reset();
          }

          const DashSDK = await loadScript<typeof DashJS>(
            DASH_SCRIPT_URL,
            DASH_VARIABLE_NAME
          );

          const player = DashSDK.MediaPlayer().create();

          dashjs.current = player;

          if (dashRef) {
            dashRef.current = player;
          }

          innerRef.current.addEventListener('loadeddata', () => {
            const bitrates = player.getBitrateInfoListFor('video');

            const qualities = bitrates.map((birate) => birate.height + 'p');

            const bestQuality = (() => {
              const quality = bitrates.find((bitrate) => {
                const quality =
                  state.currentQuality || preferQuality?.(qualities);

                if (!quality) return false;

                return bitrate.height === parseNumberFromString(quality);
              });

              if (quality) return quality;

              return bitrates[bitrates.length - 1];
            })();

            player.setQualityFor('video', bestQuality.qualityIndex);

            setState(() => ({
              qualities,
              currentQuality: state?.currentQuality || bestQuality.height + 'p',
            }));
          });

          player.updateSettings({
            streaming: { abr: { autoSwitchBitrate: { video: false } } },
          });

          player.initialize();
          player.setAutoPlay(autoPlay || false);
          player.attachView(innerRef.current);
          player.attachSource(source.file);

          onDashInit?.(player, source);
        }

        if (!innerRef.current) return;

        onInit?.(innerRef.current);

        if (shouldPlayHls(source)) {
          _initHlsPlayer();
        } else if (shouldPlayDash(source)) {
          _initDashPlayer();
        } else {
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

      const source =
        sources.find((source) => source.label === state?.currentQuality) ||
        sources[0];

      initPlayer(source);

      // If the sources have multiple m3u8 urls, then we have to handle quality ourself (because hls.js only handle quality with playlist url).
      // Same with the sources that have multiple mp4 urls.
      if (!shouldPlayHls(source) || sources.length > 1) {
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

      const source =
        sources.find((source) => source.label === currentQuality) || sources[0];

      // If the sources contain only one m3u8 url, then it maybe is a playlist.
      if (shouldPlayHls(source) && sources.length === 1) {
        // Check if the playlist gave us qualities.
        if (!hls?.current?.levels?.length) return;
        if (!currentQuality) return;

        // Handle changing quality.
        const index = hls.current.levels.findIndex(
          (level) =>
            level.height === parseNumberFromString(state.currentQuality!)
        );

        if (index === -1) return;

        hls.current.currentLevel = index;

        return;
      }

      if (shouldPlayDash(source) && sources.length === 1) {
        if (!dashjs.current) return;

        const bitrates = dashjs.current.getBitrateInfoListFor('video');

        // Check if the playlist gave us qualities.
        if (!bitrates?.length) return;
        if (!currentQuality) return;

        const choseBitrate = bitrates.find(
          (bitrate) =>
            bitrate.height === parseNumberFromString(state.currentQuality!)
        );

        if (!choseBitrate?.qualityIndex && choseBitrate?.qualityIndex !== 0) {
          return;
        }

        // Handle changing quality.
        dashjs.current.setQualityFor('video', choseBitrate.qualityIndex);

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
        playsInline
        crossOrigin="anonymous"
        {...props}
      >
        {children}
      </video>
    );
  }
);

Player.displayName = 'Player';

export default Player;
