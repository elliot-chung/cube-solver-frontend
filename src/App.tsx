import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { OrbitControls as OC } from 'three-stdlib'
import { useRef, useState, useEffect } from 'react'

import BlankCube from './BlankCube'
import InteractiveCube from './InteractiveCube'
import AnimatedCube, { AnimRef } from './AnimatedCube'
import * as THREE from 'three'

function App() {
  const seq = Array(6).fill(0).map(_ => ["R", "U", "R'", "U'"]).flat()
  const animRef = useRef<AnimRef>(null)
  const controlRef = useRef<OC>(null)

  const [lock, setLock] = useState(false)
  const [mode, setMode] = useState("interactive")
  const [cubeData, setCubeData] = useState<Array<[string, string, string]>>([])
  const [sequence, setSequence] = useState<Array<string>>(seq)

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

  const defCameraPos = new THREE.Vector3(3, 3, 3)

  return (
    <>
      <h1>Rubiks Cube Solver</h1>
      {mode !== "animation" && <button onClick={() => setMode("animation")}>Toggle Interactivity</button>}
      
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
          <OrbitControls minPolarAngle={0} maxPolarAngle={Math.PI} position0={defCameraPos} ref={controlRef} enablePan={false} enableZoom={false}/>
          <ambientLight intensity={0.5}/>
          {mode === "interactive" && <InteractiveCube cubeData={cubeData} setLock={setLock} setCubeData={setCubeData}/> }
          {mode === "animation" && <AnimatedCube cubeData={cubeData} sequence={sequence} ref={animRef}/> }
          {mode === "input" && <BlankCube setCubeData={setCubeData} activeColor={activeColor} />}
        </Canvas>
      </div>
    </>
  )
}

export default App
