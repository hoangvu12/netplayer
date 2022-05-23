import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import editorTheme from 'prism-react-renderer/themes/nightOwl';
import Player from '../../.';

const initialCode = `
<Player
  sources={[
    {
      file:
        'https://www.googleapis.com/drive/v3/files/1Q6LsjpWgPoYIs6GaD8G6lNZRM2-VJXAY?alt=media&key=AIzaSyCFwU3MAtwS2TgPPEObV-hDXexH83ae1Fs',
      label: '1080p',
    },
    {
      file:
        'https://www.googleapis.com/drive/v3/files/1sKXS6VU8uUGeW8WPKDp2dXxwAJ96Tk9c?alt=media&key=AIzaSyCFwU3MAtwS2TgPPEObV-hDXexH83ae1Fs',
      label: '720p',
    },
  ]}
  subtitles={[
    {
      "lang": "en",
      "language": "English",
      "file": "https://subtitles.netpop.app/subtitles/20211116/1637057950304_国王排名 2_英语.srt",
    },
    {
      "lang": "vi",
      "language": "Tiếng Việt",
      "file": "https://subtitles.netpop.app/subtitles/20211116/1637057969656_国王排名 2_越南语.srt",
    }
  ]}
  className="object-contain w-full h-full"
/>
`;

const App = () => {
  return (
    <div className="text-white w-full h-full gap-4">
      <LiveProvider theme={editorTheme} scope={{ Player }} code={initialCode}>
        <div
          className="relative w-full h-[56.25vw] bg-black"
          style={{ maxHeight: 'calc(100vh - 100px)' }}
        >
          <div className="w-full h-full">
            <LivePreview />
          </div>
        </div>

        <LiveEditor
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 16,
          }}
          className="bg-[#0B0E14]"
        />
        <LiveError />
      </LiveProvider>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
