import { useRef } from "react"
import { fonts, themes } from './lib/options'
import { cn } from './lib/utils'
import useStore from './services/store'
import CodeEditor from './components/CodeEditor'

function App() {
  const theme = useStore(state => state.theme);
  const padding = useStore(state => state.padding);
  const fontStyle = useStore(state => state.fontStyle);
  const showBackground = useStore(state => state.showBackground);
  const editorRef = useRef(null);

  return (
    <main className='dark min-h-screen flex justify-center items-center bg-neutral-950 text-white'>
      <link rel='stylesheet' href={themes[theme as keyof typeof themes].theme} crossOrigin='anonymous' />
      <link rel='stylesheet' href={fonts[fontStyle as keyof typeof fonts].src} crossOrigin='anonymous' />

      <div
        className={cn(
          "overflow-hidden mb-2 transition-all ease-out",
          showBackground ? themes[theme as keyof typeof themes].background : "ring ring-neutral-900"
        )}
        style={{ padding }}
        ref={editorRef}
      >
        <CodeEditor />
      </div>
    </main>
  )
}

export default App
