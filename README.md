# netplayer

<a href='https://www.npmjs.com/package/netplayer'>
  <img src='https://img.shields.io/npm/v/netplayer.svg' alt='Latest npm version'>
</a>

<p align='center'>
  A simple React component that provide good looking UI video player
</p>

## Usage

```bash
npm install netplayer # or yarn add netplayer
```

```jsx
import NetPlayer from 'netplayer';

<NetPlayer
  sources={[
    {
      file: 'https://www.googleapis.com/drive/v3/files/1Q6LsjpWgPoYIs6GaD8G6lNZRM2-VJXAY?alt=media&key=AIzaSyCFwU3MAtwS2TgPPEObV-hDXexH83ae1Fs',
      label: '1080p',
    },
    {
      file: 'https://www.googleapis.com/drive/v3/files/1sKXS6VU8uUGeW8WPKDp2dXxwAJ96Tk9c?alt=media&key=AIzaSyCFwU3MAtwS2TgPPEObV-hDXexH83ae1Fs',
      label: '720p',
    },
  ]}
  subtitles={[
    {
      lang: 'en',
      language: 'English',
      file: 'https://subtitles.netpop.app/subtitles/20211116/1637057950304_国王排名 2_英语.srt',
    },
    {
      lang: 'vi',
      language: 'Tiếng Việt',
      file: 'https://subtitles.netpop.app/subtitles/20211116/1637057969656_国王排名 2_越南语.srt',
    },
  ]}
/>;
```

Or [play](https://hoangvu12.github.io/netplayer/) around with this component

## Props

NetPlayer accepts video element props and these specific props

| Prop              | Type                                                                                                   | Description                                                 | Default                                                                                                         | Required |
| ----------------- | ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | -------- |
| `sources`         | [Source](https://github.com/hoangvu12/netplayer/blob/main/src/types.ts#L1)[]                           | An array of sources contain `file` and `label`              | `null`                                                                                                          | `true`   |
| `subtitles`       | [Subtitle](https://github.com/hoangvu12/netplayer/blob/main/src/types.ts#L6)[]                         | An array of subtitles contain `file`, `lang` and `language` | `null`                                                                                                          | `false`  |
| `hlsRef`          | `React.MutableRefObject<Hls \| null>`                                                                  | `hls.js` instance ref                                       | `React.createRef()`                                                                                             | `false`  |
| `hlsConfig`       | `Hls['config']`                                                                                        | `hls.js` config                                             | `{}`                                                                                                            | `false`  |
| `changeSourceUrl` | `(currentSourceUrl: string, source: Source): string`                                                   | A function that modify given source url (`hls` only)        | `() => null`                                                                                                    | `false`  |
| `onHlsInit`       | `(hls: Hls): void`                                                                                     | A function that called after hls.js initialization          | `() => null`                                                                                                    | `false`  |
| `onInit`          | `(videoEl: HTMLVideoElement): void`                                                                    | A function that called after video initialization           | `() => null`                                                                                                    | `false`  |
| `ref`             | `React.MutableRefObject<HTMLVideoElement \| null>`                                                     | `video` element ref                                         | `null`                                                                                                          | `false`  |
| `i18n`            | [I18n](https://github.com/hoangvu12/netplayer/blob/main/src/contexts/VideoPropsContext.tsx#L41)        | Translations                                                | [Default Translations](https://github.com/hoangvu12/netplayer/blob/main/src/contexts/VideoPropsContext.tsx#L69) | `false`  |
| `hotkeys`         | [Hotkey](https://github.com/hoangvu12/netplayer/blob/main/src/types.ts#L25)[]                          | Hotkeys (shortcuts)                                         | [Default Hotkeys](https://github.com/hoangvu12/netplayer/blob/main/src/contexts/VideoPropsContext.tsx#L99)      | `false`  |
| `components`      | [Component](https://github.com/hoangvu12/netplayer/blob/main/src/contexts/VideoPropsContext.tsx#L99)[] | See [Customization](#customization)                         | [Default components](https://github.com/hoangvu12/netplayer/blob/main/src/contexts/VideoPropsContext.tsx#L46)   | `false`  |

## Customization

You can customize the player by passing defined components with `components` props. See [defined components](https://github.com/hoangvu12/netplayer/blob/main/src/contexts/VideoPropsContext.tsx#L46)

By passing components, the passed components will override default existing components. Allow you to customize the player how you want it to be.

### Example

```jsx
import NetPlayer, { TimeIndicator } from 'netplayer';

<NetPlayer
  {...props}
  components={{
    Controls: () => {
      return (
        <div className="flex items-center justify-between">
          <p>A custom Controls component</p>

          <TimeIndicator />
        </div>
      );
    },
  }}
/>;
```

_Note: use built-in [hooks](https://github.com/hoangvu12/netplayer/tree/main/src/hooks) and [components](https://github.com/hoangvu12/netplayer/tree/main/src/components) for better customization_

### Override structure

NetPlayer use this [default structure](https://github.com/hoangvu12/netplayer/blob/main/src/components/DefaultUI/DefaultUI.tsx)

To override it, simply pass your own structure as NetPlayer's `children`

```jsx
import NetPlayer, { Controls, Player, Overlay } from 'netplayer';

<NetPlayer {...props}>
  <div>
    <div>
      <Player />
    </div>
    <div>
      <Controls />
    </div>
    <div>
      <Overlay />
    </div>
    <div>
      <p>Look I'm over here!</p>
    </div>
  </div>
</NetPlayer>;
```

## Methods

You can access to the `video` element by passing `ref` to NetPlayer and use all its methods.

## Supported formats

NetPlayer supports all `video` element supported formats and `HLS` format

## Contributing

See the [contribution guidelines](github.com/hoangvu12/netplayer/blob/main/CONTRIBUTING.md) before creating a pull request.

## Other video players

- [react-player](https://github.com/CookPete/react-player)
- [react-tuby](https://github.com/napthedev/react-tuby)
- [video-react](https://github.com/video-react/video-react)
- [plyr](https://github.com/sampotts/plyr)
- [video.js](https://github.com/videojs/video.js)
