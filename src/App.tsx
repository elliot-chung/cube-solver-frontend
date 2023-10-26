import { Canvas } from '@react-three/fiber'
import InteractiveCube from './InteractiveCube'

import { OrbitControls } from '@react-three/drei'
import { OrbitControls as OC } from 'three-stdlib'
import { useRef, useState, useEffect } from 'react'
import AnimatedCube from './AnimatedCube'
import { AnimRef } from './AnimatedCube'


function App() {
  const repeatRef = useRef<AnimRef>(null)
  const controlRef = useRef<OC>(null)
  const [lock, setLock] = useState(false)

  const [interactivity, setInteractivity] = useState(true)
  const [cubeData, setCubeData] = useState<Array<[string, string, string]>>([])
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (controlRef.current) {
      controlRef.current.enabled = !lock
    }
  }, [lock])

  const reset = () => {
    setCubeData([])
    setInteractivity(true)
  }

  const repeat = () => {
    if (repeatRef.current) {
      repeatRef.current.repeatAnimation()
    }
  }

  const sequence = Array(6).fill(0).map(_ => ["R", "U2", "R'", "U'"]).flat()

  return (
    <>
      <h1>Rubiks Cube Solver</h1>
      {interactivity && <button onClick={() => setInteractivity(!interactivity)}>Toggle Interactivity</button>}
      {!interactivity && <button onClick={() => setStep((step) => step + 1)}>Step</button>}
      {!interactivity && <button onClick={repeat}>Repeat</button>}
      <button onClick={reset}>Reset</button>
      <div style={{ height: '80vh', width: '100vw', cursor: 'pointer' }}>
        <Canvas >
          <OrbitControls minPolarAngle={0} maxPolarAngle={Math.PI} ref={controlRef} enablePan={false} enableZoom={false}/>
          <ambientLight intensity={0.5}/>
          {interactivity ? 
            <InteractiveCube cubeData={cubeData} setLock={setLock} setCubeData={setCubeData}/> :
            <AnimatedCube cubeData={cubeData} step={step} sequence={sequence} ref={repeatRef}/> }
        </Canvas>
      </div>
    </>
  )
}

export default App
