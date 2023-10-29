import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { OrbitControls as OC } from 'three-stdlib'
import { useRef, useState, useEffect } from 'react'

import BlankCube from './BlankCube'
import InteractiveCube from './InteractiveCube'
import AnimatedCube, { AnimRef } from './AnimatedCube'

function App() {
  const animRef = useRef<AnimRef>(null)
  const controlRef = useRef<OC>(null)

  const [lock, setLock] = useState(false)
  const [mode, setMode] = useState("interactive")
  const [cubeData, setCubeData] = useState<Array<[string, string, string]>>([])
  const [sequence, setSequence] = useState<Array<string>>([])

  const [activeColor, setActiveColor] = useState("blue")

  useEffect(() => {
    if (controlRef.current) {
      controlRef.current.enabled = !lock
    }
  }, [lock])

  const reset = () => {
    setCubeData([])
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
      animRef.current.completeAnimation()
      animRef.current.stepforward()
      if(animRef.current.step + 1 === sequence.length) {
        setForDisable(true)
      } else {
        setBackDisable(false)
      }
    }
  }

  const [backDisable, setBackDisable] = useState(true)
  const stepBackward = () => {
    if (animRef.current) {
      animRef.current.completeAnimation()
      animRef.current.rollback()
      if(animRef.current.step - 1 === 0) {
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
        "Content-Type": "application/json"
      },
      body: JSON.stringify(cubeData)
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

  return (
    <>
      <h1>Rubiks Cube Solver</h1>
      {(mode === "interactive" || mode === "input") && <button onClick={solve}>Solve</button>}
      
      {mode === "interactive" && <button onClick={() => setMode("input")}>Toggle Input Mode</button>}

      {mode === "animation" && <button onClick={stepBackward} disabled={backDisable} >Previous</button>}
      {mode === "animation" && <button onClick={stepForward} disabled={forDisable}>Next</button>}
      {mode === "animation" && <button onClick={repeat} >Repeat</button>}
      
      {mode === "input" && <button onClick={() => setActiveColor("blue")}>Blue</button>}
      {mode === "input" && <button onClick={() => setActiveColor("red")}>Red</button>}
      {mode === "input" && <button onClick={() => setActiveColor("green")}>Green</button>}
      {mode === "input" && <button onClick={() => setActiveColor("orange")}>Orange</button>}
      {mode === "input" && <button onClick={() => setActiveColor("yellow")}>Yellow</button>}
      {mode === "input" && <button onClick={() => setActiveColor("white")}>White</button>}
      
      <button onClick={reset}>Reset</button>
      <div style={{ height: '80vh', width: '100vw', cursor: 'pointer' }}>
        <Canvas camera={{ position: [3, 3, 3] }} >
          <OrbitControls minPolarAngle={0} maxPolarAngle={Math.PI} ref={controlRef} enablePan={false} enableZoom={false}/>
          <ambientLight intensity={0.5}/>
          {mode === "interactive" && <InteractiveCube cubeData={cubeData} setLock={setLock} setCubeData={setCubeData}/> }
          {(mode === "animation" || mode === "loading") && <AnimatedCube cubeData={cubeData} sequence={sequence} ref={animRef}/> }
          {mode === "input" && <BlankCube setCubeData={setCubeData} activeColor={activeColor} />}
        </Canvas>
      </div>
    </>
  )
}

export default App
