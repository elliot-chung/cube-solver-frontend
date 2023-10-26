import { Group } from 'three'
import { useState, useRef, useEffect, forwardRef, useMemo } from 'react'
import { ThreeEvent, useFrame } from '@react-three/fiber'

function RubiksCube({setLock}: {setLock: (lock: boolean) => void}) {
  const [activeFace, setActiveFace] = useState<string>("none")
  const [activeCubie, setActiveCubie] = useState<string>("none")
  const [turnDir, setTurnDir] = useState<string>("none")

  const faceRef = useRef<Group>(null)
  
  const edgeRefs = Array(12).fill(0).map(_ => useRef<Group>(null))
  const cornerRefs = Array(8).fill(0).map(_ => useRef<Group>(null))

  const iEdgeColors:Array<[string, string, string]> = [["purple", "blue", "yellow"],
                                                       ["orange", "blue", "purple"],
                                                       ["purple", "blue", "white"],
                                                       ["red", "blue", "purple"],
                                                       ["purple", "green", "yellow"],
                                                       ["orange", "green", "purple"],
                                                       ["purple", "green", "white"],
                                                       ["red", "green", "purple"],
                                                       ["orange", "purple", "yellow"],
                                                       ["red", "purple", "yellow"],
                                                       ["orange", "purple", "white"],
                                                       ["red", "purple", "white"]]

  const iCornerColors:Array<[string, string, string]> = [["orange", "blue", "yellow"],
                                                         ["orange", "blue", "white"],
                                                         ["red", "blue", "white"],
                                                         ["red", "blue", "yellow"],
                                                         ["orange", "green", "yellow"],
                                                         ["red", "green", "yellow"],
                                                         ["red", "green", "white"],
                                                         ["orange", "green", "white"]]

  const [edgeColors, setEdgeColors] = useState<Array<[string, string, string]>>(iEdgeColors)
  const [cornerColors, setCornerColors] = useState<Array<[string, string, string]>>(iCornerColors)

  const edgeCubies = useMemo(() => Array(12).fill(0).map((_, i) => <Cubie isCorner={false} positionId={i} colors={edgeColors[i]} key={"e" + i} setTurnDir={setTurnDir} setActiveCubie={setActiveCubie} setLock={setLock} ref={edgeRefs[i]}/>), [edgeColors])
  const cornerCubies = useMemo(() => Array(8).fill(0).map((_, i) => <Cubie isCorner={true} positionId={i} colors={cornerColors[i]} key={"c" + i} setTurnDir={setTurnDir} setActiveCubie={setActiveCubie} setLock={setLock} ref={cornerRefs[i]}/>) , [cornerColors])

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
    event.stopPropagation()
    setActiveCubie("none")
    setActiveFace("none")
    setTurnDir("none")
    setLock(false)
    if(faceRef.current) {
      const rot = faceRef.current.userData.rotation > 0 ? faceRef.current.userData.rotation % (2 * Math.PI) : (2 * Math.PI) + (faceRef.current.userData.rotation % (2 * Math.PI))
      
      const rotInd = Math.floor(rot / (Math.PI / 4))
      const face = faceRef.current.name
      const faceReorientation = face === "U" || face === "F" || face === "R" ? -1 : 1
      const rotation = rotInd == 0 || rotInd == 7 ? 0 : rotInd == 1 || rotInd == 2 ? (4-faceReorientation) : rotInd == 3 || rotInd == 4 ? 2 : (4+faceReorientation)
      
      if (rotation === 0) return

      const edges = faceEdges.get(face)!
      const corners = faceCorners.get(face)!

      const anchor = face === "U" || face === "D" ? 1 : face === "F" || face === "B" ? 2 : 0

      setEdgeColors((prev) => {
        const newColors = [...prev]
        for (let i = 0; i < 4; i++) {
          const colors = prev[edges[i]]
          const swap1 = (anchor + 1) % 3
          const swap2 = (anchor + 2) % 3
          const tmp = colors[swap1]
          if (rotation !== 2) {
            colors[swap1] = colors[swap2]
            colors[swap2] = tmp
          }
          newColors[edges[(i + rotation) % 4]] = colors
        }
        return newColors
      })
      setCornerColors((prev) => {
        const newColors = [...prev]
        for (let i = 0; i < 4; i++) {
          const colors = prev[corners[i]]
          const swap1 = (anchor + 1) % 3
          const swap2 = (anchor + 2) % 3
          const tmp = colors[swap1]
          if (rotation !== 2) {
            colors[swap1] = colors[swap2]
            colors[swap2] = tmp
          }
          newColors[corners[(i + rotation) % 4]] = colors
        }
        return newColors
      })
    }
  }

  useEffect(() => {
    window.addEventListener("pointerup", handlePointerUp)
  }, [])

  useFrame(() => {
    const dir = turnDir === "clockwise" ? 1 : turnDir === "counterclockwise" ? -1 : 0
    if (dir === 0) return 
    if (faceRef.current) {
      if (activeFace === "U") {
        faceRef.current.rotation.y -= 0.01 * dir
        faceRef.current.userData.rotation = faceRef.current.rotation.y
      } else if (activeFace === "D") {
        faceRef.current.rotation.y += 0.01 * dir
        faceRef.current.userData.rotation = faceRef.current.rotation.y
      } else if (activeFace === "F") {
        faceRef.current.rotation.z -= 0.01 * dir
        faceRef.current.userData.rotation = faceRef.current.rotation.z
      } else if ( activeFace === "B") {
        faceRef.current.rotation.z += 0.01 * dir
        faceRef.current.userData.rotation = faceRef.current.rotation.z
      } else if (activeFace === "L") {
        faceRef.current.rotation.x += 0.01 * dir
        faceRef.current.userData.rotation = faceRef.current.rotation.x
      } else if (activeFace === "R") {
        faceRef.current.rotation.x -= 0.01 * dir
        faceRef.current.userData.rotation = faceRef.current.rotation.x
      }
    }
  }, )

  
  return (<>
    {activeFace !== "none" && <group ref={faceRef} name={activeFace}>
      {edgeCubies.filter((_, i) => edges.includes(i))}
      {cornerCubies.filter((_, i) => corners.includes(i))}
    </group>}
    {edgeCubies.filter((_, i) => !edges.includes(i))}
    {cornerCubies.filter((_, i) => !corners.includes(i))}
  </>)
}

const Cubie = forwardRef(function Cubie({ positionId, isCorner, setActiveCubie, setTurnDir, setLock, colors }: 
                                        { positionId: number, isCorner: boolean, 
                                          setActiveCubie: (cubie: string) => void, 
                                          setTurnDir: (dir: string) => void,
                                          setLock: (lock: boolean) => void,
                                          colors: [string, string, string]}, ref: any) {
    const edgePos: Array<[number, number, number]> = 
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
  const cornerPos: Array<[number, number, number]> = 
                    [[1, 1, 1],
                    [1, 1, -1],
                    [-1, 1, -1],
                    [-1, 1, 1],
                    [1, -1, 1],
                    [-1, -1, 1],
                    [-1, -1, -1],
                    [1, -1, -1]]
  



  const x = isCorner ? cornerPos[positionId][0] : edgePos[positionId][0]
  const y = isCorner ? cornerPos[positionId][1] : edgePos[positionId][1]
  const z = isCorner ? cornerPos[positionId][2] : edgePos[positionId][2]

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
    if (event.buttons === 1) {
      setTurnDir("clockwise")
    } else if (event.buttons === 2) {
      setTurnDir("counterclockwise")
    } else {
      return
    }
    const type = isCorner ? "c" : "e"
    const orientation = event.object.name
    const name = `${type}${orientation}${positionId}`
    setActiveCubie(name)
    setLock(true)
  }

  return (
    <group ref={ref} position={[x, y, z]}>
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