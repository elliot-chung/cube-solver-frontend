import { Canvas } from '@react-three/fiber'
import InteractiveCube from './InteractiveCube'

import { OrbitControls } from '@react-three/drei'
import { OrbitControls as OC } from 'three-stdlib'
import { useRef, useState, useEffect } from 'react'
import AnimatedCube from './AnimatedCube'
import { AnimRef } from './AnimatedCube'


function App() {
  const seq = Array(6).fill(0).map(_ => ["R", "U", "F", "B'"]).flat()
  const animRef = useRef<AnimRef>(null)
  const controlRef = useRef<OC>(null)

  const [lock, setLock] = useState(false)
  const [interactivity, setInteractivity] = useState(true)
  const [cubeData, setCubeData] = useState<Array<[string, string, string]>>([])
  const [sequence, setSequence] = useState<Array<string>>(seq)

  useEffect(() => {
    if (controlRef.current) {
      controlRef.current.enabled = !lock
    }
  }, [lock])

  const reset = () => {
    setCubeData([])
    setInteractivity(true)
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
      console.log(animRef.current.step + 1)
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
      console.log(animRef.current.step - 1)
    }
  }

  
  

  return (
    <>
      <h1>Rubiks Cube Solver</h1>
      {interactivity && <button onClick={() => setInteractivity(!interactivity)}>Toggle Interactivity</button>}
      {!interactivity && <button onClick={stepBackward} disabled={backDisable} >Previous</button>}
      {!interactivity && <button onClick={stepForward} disabled={forDisable}>Next</button>}
      {!interactivity && <button onClick={repeat} >Repeat</button>}
      <button onClick={reset}>Reset</button>
      <div style={{ height: '80vh', width: '100vw', cursor: 'pointer' }}>
        <Canvas >
          <OrbitControls minPolarAngle={0} maxPolarAngle={Math.PI} ref={controlRef} enablePan={false} enableZoom={false}/>
          <ambientLight intensity={0.5}/>
          {interactivity ? 
            <InteractiveCube cubeData={cubeData} setLock={setLock} setCubeData={setCubeData}/> :
            <AnimatedCube cubeData={cubeData} sequence={sequence} ref={animRef}/> }
        </Canvas>
      </div>
    </>
  )
}

export default App
