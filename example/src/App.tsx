import React from 'react'
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live'
import editorTheme from 'prism-react-renderer/themes/nightOwl'
import Player from 'netplayer'
import { buildAbsoluteURL } from 'url-toolkit'

const initialCode = `
  <Player
    sources={[
      {
        file:
          'https://dash.akamaized.net/dash264/TestCasesHD/2b/qualcomm/1/MultiResMPEG2.mpd', type: 'dash'      }
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
    autoPlay
  />
`

const App: React.FC = () => {
  return (
    <div className="text-white w-full h-full gap-4">
      <LiveProvider
        theme={editorTheme}
        scope={{ Player, buildAbsoluteURL }}
        code={initialCode}
      >
        <div
          className="relative w-full h-[56.25vw] bg-black"
          style={{ maxHeight: 'calc(100vh - 100px)' }}
        >
          <LivePreview className="w-full h-full" />
        </div>

        <LiveEditor
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 16
          }}
          className="bg-[#0B0E14]"
        />
        <LiveError />
      </LiveProvider>
    </div>
  )
}

export default App
