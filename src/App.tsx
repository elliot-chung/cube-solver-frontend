import { Canvas } from '@react-three/fiber'
import RubiksCube from './RubiksCube'

import { OrbitControls } from '@react-three/drei'
import { OrbitControls as OC } from 'three-stdlib'
import { useRef, useState, useEffect } from 'react'


function App() {
  const controlRef = useRef<OC>(null)
  const [lock, setLock] = useState(false)
  
  useEffect(() => {
    if (controlRef.current) {
      controlRef.current.enabled = !lock
    }
  }, [lock])

  return (
    <>
      <h1>Rubiks Cube Solver</h1>
      <button onClick={() => setLock(!lock)}>Lock Camera</button>
      <div style={{ height: '80vh', width: '100vw', cursor: 'pointer' }}>
        <Canvas >
          <OrbitControls minPolarAngle={0} maxPolarAngle={Math.PI} ref={controlRef} enablePan={false} enableZoom={false}/>
          <ambientLight intensity={0.5}/>
          <RubiksCube />
        </Canvas>
      </div>
    </>
  )
}

export default App
