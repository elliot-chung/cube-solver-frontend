import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { OrbitControls as OC } from "three-stdlib"
import { useRef, useState, useEffect } from "react"

import BlankCube from "./components/BlankCube"
import InteractiveCube from "./components/InteractiveCube"
import AnimatedCube, { AnimRef } from "./components/AnimatedCube"

import ResetIcon from "./assets/reset.svg?react"
import InputIcon from "./assets/input.svg?react"
import ScrambleIcon from "./assets/scramble.svg?react"

function App() {
  const animRef = useRef<AnimRef>(null)
  const controlRef = useRef<OC>(null)

  const [lock, setLock] = useState(false)
  const [mode, setMode] = useState("interactive")
  const [cubeData, setCubeData] = useState<Array<[string, string, string]>>([])
  const [sequence, setSequence] = useState<Array<string>>([])
  const [step, setStep] = useState(0)

  const [activeColor, setActiveColor] = useState("blue")

  useEffect(() => {
    if (controlRef.current) {
      controlRef.current.enabled = !lock
    }
  }, [lock])

  const reset = () => {
    setCubeData([])
    setSequence([])
    setMode("interactive")
    setBackDisable(true)
    setForDisable(sequence.length === 0)
  }

  const repeat = () => {
    if (animRef.current) {
      animRef.current.repeatAnimation()
    }
  }

  const [forDisable, setForDisable] = useState(sequence.length === 0)
  const stepForward = () => {
    if (animRef.current) {
      animRef.current.stepforward()
      setStep(animRef.current.step + 1)
      if (animRef.current.step + 1 === sequence.length) {
        setForDisable(true)
      } else {
        setBackDisable(false)
      }
    }
  }

  const [backDisable, setBackDisable] = useState(true)
  const stepBackward = () => {
    if (animRef.current) {
      animRef.current.rollback()
      setStep(animRef.current.step - 1)
      if (animRef.current.step - 1 === 0) {
        setBackDisable(true)
      } else {
        setForDisable(false)
      }
    }
  }

  const solve = async () => {
    setMode("loading")
    const data = await fetch("http://localhost:8080/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cubeData),
    })
    const res = await data.json()

    if (typeof res === "string") {
      alert(res)
      setMode("input")
      return
    }
    setSequence(res)
    setMode("animation")
  }

  useEffect(() => {
    setForDisable(sequence.length === 0)
  }, [sequence])

  const scramble = () => {
    const moves = ["F", "B", "R", "L", "U", "D"]
    const scramble = []
    for (let i = 0; i < 20; i++) {
      const move = moves[Math.floor(Math.random() * moves.length)]
      const dir = Math.random() > 0.5 ? "" : "'"
      scramble.push(move + dir)
    }
    setSequence(scramble)
    setMode("scramble")
  }

  const finishScramble = () => {
    setMode("interactive")
  }

  return (
    <div className="h-screen w-screen bg-gray-100 dark:bg-slate-900">
      <div className="flex h-fit flex-row items-center justify-evenly pt-8">
        {mode === "interactive" && (
          <button
            className="hover:scale-110 active:scale-105"
            title="Input Mode"
            onClick={() => setMode("input")}
          >
            <InputIcon />
          </button>
        )}
        {mode === "interactive" && (
          <button
            className="hover:scale-110 active:scale-105"
            title="Scramble"
            onClick={scramble}
          >
            <ScrambleIcon />
          </button>
        )}

        <button className="hover:scale-110 active:scale-105" title="Reset" onClick={reset}>
          <ResetIcon />
        </button>
      </div>

      {mode === "input" && <button onClick={() => setActiveColor("blue")}>Blue</button>}
      {mode === "input" && <button onClick={() => setActiveColor("red")}>Red</button>}
      {mode === "input" && <button onClick={() => setActiveColor("green")}>Green</button>}
      {mode === "input" && <button onClick={() => setActiveColor("orange")}>Orange</button>}
      {mode === "input" && <button onClick={() => setActiveColor("yellow")}>Yellow</button>}
      {mode === "input" && <button onClick={() => setActiveColor("white")}>White</button>}
      <div className="h-3/5 cursor-pointer">
        <Canvas camera={{ position: [3, 3, 3] }}>
          <OrbitControls
            minPolarAngle={0}
            maxPolarAngle={Math.PI}
            ref={controlRef}
            enablePan={false}
            enableZoom={false}
          />
          <ambientLight intensity={0.5} />
          {mode === "interactive" && (
            <InteractiveCube cubeData={cubeData} setLock={setLock} setCubeData={setCubeData} />
          )}
          {(mode === "animation" || mode === "loading") && (
            <AnimatedCube
              cubeData={cubeData}
              sequence={sequence}
              playFull={false}
              ref={animRef}
              setCubeData={setCubeData}
            />
          )}
          {mode === "input" && (
            <BlankCube setCubeData={setCubeData} activeColor={activeColor} />
          )}
          {mode === "scramble" && (
            <AnimatedCube
              cubeData={cubeData}
              sequence={sequence}
              playFull={true}
              finishSequence={finishScramble}
              ref={animRef}
              setCubeData={setCubeData}
            />
          )}
        </Canvas>
      </div>
      {(mode === "interactive" || mode === "input") && (
        <div className="mx-auto w-fit">
          <button
            className="rounded-md bg-white px-8 py-3 font-semibold shadow-lg hover:scale-105 active:bg-gray-50 dark:bg-stone-800 dark:text-white"
            onClick={solve}
          >
            Solve
          </button>
        </div>
      )}

      {mode === "animation" && (
        <div className="flex flex-row justify-evenly">
          <button onClick={stepBackward} disabled={backDisable}>
            Previous
          </button>
          <button onClick={repeat}>Repeat</button>
          <button onClick={stepForward} disabled={forDisable}>
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default App
