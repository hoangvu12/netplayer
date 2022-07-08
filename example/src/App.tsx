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
          'https://play.vnupload.net/SB/up/q2v27484r214x2z2w2z2/r4q2a454v234v2u2s2v264t2y2/u27424h54494x203w2a4j5s294f41474v2x2b403t2a4t223z2l5i5x2v294a45484f584v2z284l5h5/573387355440192.m3u8'      }
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
    changeSourceUrl={(url, source) => {
      const encodedUrl = encodeURIComponent(url)

      const requestUrl =
        'http://localhost:3002/proxy?url=' +
        encodedUrl +
        '&appendReqHeaders=[["referer", "https://play.vnupload.net/"]]&ignoreReqHeaders=true'
    
      return requestUrl
    }}
    onHlsInit={(hls) => {
      hls.on("hlsFragLoading", (_, { frag }) => {
        const href = new URL(frag.baseurl);
        const targetUrl = href.searchParams.get("url");

        const url = buildAbsoluteURL(targetUrl, frag.relurl, {
          alwaysNormalize: true,
        });

        href.searchParams.set("url", url);

        frag.url = href.toString();
      });
    }}
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
