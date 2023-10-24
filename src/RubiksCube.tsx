import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'


function RubiksCube() {
  const boxRef = useRef<THREE.Group>(null)
  useFrame(() => {
    if (boxRef.current) {
      boxRef.current.rotation.x += 0.01
    }
  })
  
  const cubies = Array(20).fill(0).map((_, i) => <Cubie positionId={i} />)

  return (
    <group ref={boxRef}>
      {cubies}
    </group>
  )
}

function Cubie({ positionId }: { positionId: number }) {
  const isCorner = positionId > 11
  const position = new THREE.Vector3()
  if (isCorner) { positionId -= 12 }
  
  if (isCorner) {
    if (positionId === 0) {
      position.set(1, 1, 1)
    } else if (positionId === 1) {
      position.set(1, 1, -1)
    } else if (positionId === 2) {
      position.set(-1, 1, -1)
    } else if (positionId === 3) {
      position.set(-1, 1, 1)
    } else if (positionId === 4) {
      position.set(1, -1, 1)
    } else if (positionId === 5) {
      position.set(-1, -1, 1)
    } else if (positionId === 6) {
      position.set(-1, -1, -1)
    } else if (positionId === 7) {
      position.set(1, -1, -1)
    }
  } else {
    if (positionId === 0) {
      position.set(0, 1, 1)
    } else if (positionId === 1) {
      position.set(1, 1, 0)
    } else if (positionId === 2) {
      position.set(0, 1, -1)
    } else if (positionId === 3) {
      position.set(-1, 1, 0)
    } else if (positionId === 4) {
      position.set(0, -1, 1)
    } else if (positionId === 5) {
      position.set(1, -1, 0)
    } else if (positionId === 6) {
      position.set(0, -1, -1)
    } else if (positionId === 7) {
      position.set(-1, -1, 0)
    } else if (positionId === 8) {
      position.set(1, 0, 1)
    } else if (positionId === 9) {
      position.set(1, 0, -1)
    } else if (positionId === 10) {
      position.set(-1, 0, -1)
    } else if (positionId === 11) {
      position.set(-1, 0, 1)
    }
  }

  return (
    <mesh position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial />
    </mesh>
  )
}

export default RubiksCube