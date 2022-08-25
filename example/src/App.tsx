import React from 'react'
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live'
import editorTheme from 'prism-react-renderer/themes/nightOwl'
import Player from 'netplayer'
import { buildAbsoluteURL } from 'url-toolkit'

const initialCode = `
  <Player
    sources={[
      {
        file: 'https://artplayer.org/assets/sample/video.mp4'
      }
    ]}
    subtitles={[
      {
        lang: 'jp',
        language: 'Japanese',
        file: 'https://artplayer.org/assets/sample/subtitle.jp.srt'
      },
      {
        lang: 'cn',
        language: 'Chinese',
        file: 'https://artplayer.org/assets/sample/subtitle.cn.srt'
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
