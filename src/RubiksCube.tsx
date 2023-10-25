import { Group, Vector3 } from 'three'
import { useState, useRef, useEffect, forwardRef } from 'react'
import { ThreeEvent, useFrame } from '@react-three/fiber'

function RubiksCube() {
  const [activeFace, setActiveFace] = useState<string>("none")
  const [activeCubie, setActiveCubie] = useState<string>("none")

  const faceRef = useRef<Group>(null)
  
  const edgeRefs = Array(12).fill(0).map(_ => useRef<Group>(null))
  const cornerRefs = Array(8).fill(0).map(_ => useRef<Group>(null))

  const iedgePos: Array<[number, number, number]> = 
                  [[0, 1, 1],
                   [1, 1, 0],
                   [0, 1, -1],
                   [-1, 1, 0], 
                   [0, -1, 1], 
                   [1, -1, 0], 
                   [0, -1, -1], 
                   [-1, -1, 0],
                   [1, 0, 1], 
                   [-1, 0, 1],
                   [1, 0, -1],
                   [-1, 0, -1]]
  const icornerPos: Array<[number, number, number]> = 
                    [[1, 1, 1],
                    [1, 1, -1],
                    [-1, 1, -1],
                    [-1, 1, 1],
                    [1, -1, 1],
                    [-1, -1, 1],
                    [-1, -1, -1],
                    [1, -1, -1]]
  const iedgeRots: Array<[number, number, number]> = Array(12).fill(0).map(_ => [0, 0, 0])
  const icornerRots: Array<[number, number, number]> = Array(8).fill(0).map(_ => [0, 0, 0])

  const [edgePos, setEdgePos] = useState<Array<[number, number, number]>>(iedgePos)
  const [cornerPos, setCornerPos] = useState<Array<[number, number, number]>>(icornerPos)
  const [edgeRots, setEdgeRots] = useState<Array<[number, number, number]>>(iedgeRots)
  const [cornerRots, setCornerRots] = useState<Array<[number, number, number]>>(icornerRots)

  const setCubieConfiguration = (position: [number, number, number], rotation: [number, number, number], isCorner: boolean, positionId: number) => {
    if (isCorner) {
      setCornerPos(cornerPos.map((pos, i) => i === positionId ? position : pos))
      setCornerRots(cornerRots.map((rot, i) => i === positionId ? rotation : rot))
    } else {
      setEdgePos(edgePos.map((pos, i) => i === positionId ? position : pos))
      setEdgeRots(edgeRots.map((rot, i) => i === positionId ? rotation : rot))
    }
  }

  const edgeCubies = Array(12).fill(0).map((_, i) => <Cubie key={"e" + i} ref={edgeRefs[i]} position={edgePos[i]} rotation={edgeRots[i]} isCorner={false} setActiveCubie={setActiveCubie} positionId={i} />)
  const cornerCubies = Array(8).fill(0).map((_, i) => <Cubie key={"c" + i} ref={cornerRefs[i]} position={cornerPos[i]} rotation={cornerRots[i]} isCorner={true} setActiveCubie={setActiveCubie} positionId={i} />)



  const edgeFaces = ["UF", "RU", "UB", "LU", "DF", "RD", "DB", "LD", "RF", "LF", "RB", "LB"]
  const cornerFaces = ["RUF", "RUB", "LUB", "LUF", "RDF", "LDF", "LDB", "RDB"]

  useEffect(() => {
    if (activeCubie === "none") {
      return
    }
    const type = activeCubie[0]
    const orientation = activeCubie[1]
    const id = parseInt(activeCubie.substring(2))

    if (type === "e") {
      const face1 = edgeFaces[id][0]
      const face2 = edgeFaces[id][1]

      if (orientation === "x") {
        if (face1 === "R" || face1 == "L") {
          setActiveFace(face1)
        } else if (face2 === "R" || face2 == "L") {
          setActiveFace(face2)
        }
      } else if (orientation === "y") {
        if (face1 === "U" || face1 == "D") {
          setActiveFace(face1)
        } else if (face2 === "U" || face2 == "D") {
          setActiveFace(face2)
        }
      } else if (orientation === "z") {
        if (face1 === "F" || face1 == "B") {
          setActiveFace(face1)
        } else if (face2 === "F" || face2 == "B") {
          setActiveFace(face2)
        }
      }
    } else if (type === "c") {
      const face1 = cornerFaces[id][0]
      const face2 = cornerFaces[id][1]
      const face3 = cornerFaces[id][2]

      if (orientation === "x") {
        if (face1 === "R" || face1 == "L") {
          setActiveFace(face1)
        } else if (face2 === "R" || face2 == "L") {
          setActiveFace(face2)
        } else if (face3 === "R" || face3 == "L") {
          setActiveFace(face3)
        }
      } else if (orientation === "y") {
        if (face1 === "U" || face1 == "D") {
          setActiveFace(face1)
        } else if (face2 === "U" || face2 == "D") {
          setActiveFace(face2)
        } else if (face3 === "U" || face3 == "D") {
          setActiveFace(face3)
        }
      } else if (orientation === "z") {
        if (face1 === "F" || face1 == "B") {
          setActiveFace(face1)
        } else if (face2 === "F" || face2 == "B") {
          setActiveFace(face2)
        } else if (face3 === "F" || face3 == "B") {
          setActiveFace(face3)
        }
      }
    }
  }, [activeCubie])

  const faceEdges = new Map([
    ["U", [0,  1,  2,  3]],
    ["D", [4,  7,  6,  5]],
    ["F", [0,  9,  4,  8]],
    ["B", [2, 10,  6, 11]],
    ["L", [3, 11,  7,  9]],
    ["R", [1,  8,  5, 10]],
    ["none" , []]])

  const faceCorners = new Map([ 
        ["U", [0,  1,  2,  3]],
        ["D", [4,  5,  6,  7]],
        ["F", [0,  3,  5,  4]],
        ["B", [2,  1,  7,  6]],
        ["L", [3,  2,  6,  5]],
        ["R", [1,  0,  4,  7]],
        ["none" , []]])

  const edges = faceEdges.get(activeFace)!
  const corners = faceCorners.get(activeFace)!

  const handlePointerUp = (event: MouseEvent) => {
    console.log(activeCubie)
    event.stopPropagation()
    
    if (faceRef.current) {
      edgeRefs.filter((_, i) => edges.includes(i)).forEach((cubie, i) => {
        if (cubie.current) {
          const pos = new Vector3()
          cubie.current.getWorldPosition(pos)
          const rot = cubie.current.rotation
          setCubieConfiguration([pos.x, pos.y, pos.z], [rot.x, rot.y, rot.z], false, i)
        }
      })
      cornerRefs.filter((_, i) => corners.includes(i)).forEach((cubie, i) => {
        if (cubie.current) {
          const pos = new Vector3()
          cubie.current.getWorldPosition(pos)
          const rot = cubie.current.rotation
          setCubieConfiguration([pos.x, pos.y, pos.z], [rot.x, rot.y, rot.z], true, i)
        }
      })
      faceRef.current.rotation.set(0, 0, 0)
    }
    setActiveCubie("none")
    setActiveFace("none")
  }

  useEffect(() => {
    console.log("reset")
    
  }, [edgePos, cornerPos, edgeRots, cornerRots])

  useEffect(() => {
    console.log(activeFace)
  }, [activeFace])

  useEffect(() => {
    window.addEventListener("pointerup", handlePointerUp)
  }, [])

  useFrame(() => {
    if (faceRef.current) {
      if (activeFace === "U") {
        faceRef.current.rotation.y -= 0.01
      } else if (activeFace === "D") {
        faceRef.current.rotation.y += 0.01
      } else if (activeFace === "F") {
        faceRef.current.rotation.z -= 0.01
      } else if ( activeFace === "B") {
        faceRef.current.rotation.z += 0.01
      } else if (activeFace === "L") {
        faceRef.current.rotation.x += 0.01
      } else if (activeFace === "R") {
        faceRef.current.rotation.x -= 0.01
      }
    }
  }, )

  
  return (<>
    <group ref={faceRef}>
      {edgeCubies.filter((_, i) => edges.includes(i))}
      {cornerCubies.filter((_, i) => corners.includes(i))}
    </group>
    {edgeCubies.filter((_, i) => !edges.includes(i))}
    {cornerCubies.filter((_, i) => !corners.includes(i))}
  </>)
}

const Cubie = forwardRef(function Cubie({ positionId, isCorner, setActiveCubie, position, rotation }: 
                                        { positionId: number, isCorner: boolean, 
                                          setActiveCubie: (cubie: string) => void, 
                                          position: [number, number, number], 
                                          rotation: [number, number, number]}, ref: any) {
  const colors = ["purple", "purple", "purple"]
  
  if (isCorner) {
    if (positionId === 0) {
      colors[0] = "orange"
      colors[1] = "blue"
      colors[2] = "yellow"
    } else if (positionId === 1) {
      colors[0] = "orange"
      colors[1] = "blue"
      colors[2] = "white"
    } else if (positionId === 2) {
      colors[0] = "red"
      colors[1] = "blue"
      colors[2] = "white"
    } else if (positionId === 3) {
      colors[0] = "red"
      colors[1] = "blue"
      colors[2] = "yellow"
    } else if (positionId === 4) {
      colors[0] = "orange"
      colors[1] = "green"
      colors[2] = "yellow"
    } else if (positionId === 5) {
      colors[0] = "red"
      colors[1] = "green"
      colors[2] = "yellow"
    } else if (positionId === 6) {
      colors[0] = "red"
      colors[1] = "green"
      colors[2] = "white"
    } else if (positionId === 7) {
      colors[0] = "orange"
      colors[1] = "green"
      colors[2] = "white"
    }
  } else {
    if (positionId === 0) {
      colors[1] = "blue"
      colors[2] = "yellow"
    } else if (positionId === 1) {
      colors[0] = "orange"
      colors[1] = "blue"
    } else if (positionId === 2) {
      colors[1] = "blue"
      colors[2] = "white"
    } else if (positionId === 3) {
      colors[0] = "red"
      colors[1] = "blue"
    } else if (positionId === 4) {
      colors[1] = "green"
      colors[2] = "yellow"
    } else if (positionId === 5) {
      colors[0] = "orange"
      colors[1] = "green"
    } else if (positionId === 6) {
      colors[1] = "green"
      colors[2] = "white"
    } else if (positionId === 7) {
      colors[0] = "red"
      colors[1] = "green"
    } else if (positionId === 8) {
      colors[0] = "orange"
      colors[2] = "yellow"
    } else if (positionId === 9) {
      colors[0] = "red"
      colors[2] = "yellow"
    } else if (positionId === 10) {
      colors[0] = "orange"
      colors[2] = "white"
    } else if (positionId === 11) {
      colors[0] = "red"
      colors[2] = "white"
    }
  }


  const x = position[0]
  const y = position[1]
  const z = position[2]

  const xc1 = 0.06 * x
  const yc1 = 0
  const zc1 = 0

  const xc2 = 0
  const yc2 = 0.06 * y
  const zc2 = 0

  const xc3 = 0
  const yc3 = 0
  const zc3 = 0.06 * z

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation()
    const type = isCorner ? "c" : "e"
    const orientation = event.object.name
    const name = `${type}${orientation}${positionId}`
    setActiveCubie(name)
  }

  return (
    <group ref={ref} position={[x, y, z]} rotation={rotation}>
      <mesh onPointerDown={handlePointerDown} name="x" position={[xc1, yc1, zc1]}>
        <boxGeometry args={[.9, .9, .9]} />
        <meshStandardMaterial color={colors[0]}/>
      </mesh>
      <mesh onPointerDown={handlePointerDown} name="y" position={[xc2, yc2, zc2]}>
        <boxGeometry args={[.9, .9, .9]} />
        <meshStandardMaterial color={colors[1]}/>
      </mesh>
      <mesh onPointerDown={handlePointerDown} name="z" position={[xc3, yc3, zc3]}>
        <boxGeometry args={[.9, .9, .9]} />
        <meshStandardMaterial color={colors[2]}/>
      </mesh>
      <mesh onPointerDown={(event) => event.stopPropagation()} position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="black"/>
      </mesh>
    </group>
  )
})


export default RubiksCube