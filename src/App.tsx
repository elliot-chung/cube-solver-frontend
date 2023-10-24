import { Canvas } from '@react-three/fiber'
import RubiksCube from './RubiksCube'

function App() {
  

  return (
    <>
      <h1>Rubiks Cube Solver</h1>
      <div style={{ height: '80vh', width: '100vw' }}>
        <Canvas >
          <ambientLight intensity={0.5}/>
          <RubiksCube />
        </Canvas>
      </div>
    </>
  )
}

export default App
