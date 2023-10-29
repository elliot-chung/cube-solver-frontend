import { useState, useMemo, useCallback, useEffect } from 'react'
import { ThreeEvent } from '@react-three/fiber'

type BlankCubeProps = {
  setCubeData: (cubeData: Array<[string, string, string]>) => void
  activeColor: string
}

function BlankCube({ setCubeData, activeColor }: BlankCubeProps) {

  const centerColors: Array<[string, string, string]> = [["blue", "blue", "blue"],
                                                         ["green", "green", "green"],
                                                         ["yellow", "yellow", "yellow"],
                                                         ["white", "white", "white"],
                                                         ["red", "red", "red"],
                                                         ["orange", "orange", "orange"]]
  
    const iEdgeColors:Array<[string, string, string]> = 
                        [["black", "black", "black"],
                         ["black", "black", "black"],
                         ["black", "black", "black"],
                         ["black", "black", "black"],
                         ["black", "black", "black"],
                         ["black", "black", "black"],
                         ["black", "black", "black"],
                         ["black", "black", "black"],
                         ["black", "black", "black"],
                         ["black", "black", "black"],
                         ["black", "black", "black"],
                         ["black", "black", "black"]]

    const iCornerColors:Array<[string, string, string]> = 
                          [["black", "black", "black"],
                           ["black", "black", "black"],
                           ["black", "black", "black"],
                           ["black", "black", "black"],
                           ["black", "black", "black"],
                           ["black", "black", "black"],
                           ["black", "black", "black"],
                           ["black", "black", "black"]]

  
  const [edgeColors, setEdgeColors] = useState<Array<[string, string, string]>>(iEdgeColors)
  const [cornerColors, setCornerColors] = useState<Array<[string, string, string]>>(iCornerColors)

  const setColor = useCallback((type: string, id: number, normalAxis: string) => {
    if (type === "edge") {
      const newEdgeColors = [...edgeColors]
      newEdgeColors[id][normalAxis === "x" ? 0 : normalAxis === "y" ? 1 : 2] = activeColor
      setEdgeColors(newEdgeColors)
    } else if (type === "corner") {
      const newCornerColors = [...cornerColors]
      newCornerColors[id][normalAxis === "x" ? 0 : normalAxis === "y" ? 1 : 2] = activeColor
      setCornerColors(newCornerColors)
    }
  }, [edgeColors, cornerColors, activeColor])

  const edgeCubies = useMemo(() => Array(12).fill(0).map((_, i) => <Cubie type="edge" positionId={i} colors={edgeColors[i]} key={"e" + i} setColor={(axis: string) => setColor("edge", i, axis)} />), [edgeColors, activeColor])
  const cornerCubies = useMemo(() => Array(8).fill(0).map((_, i) => <Cubie type="corner" positionId={i} colors={cornerColors[i]} key={"c" + i}  setColor={(axis: string) => setColor("corner", i, axis)} />) , [cornerColors, activeColor])
  const centerCubies = Array(6).fill(0).map((_, i) => <Cubie type="center" positionId={i} colors={centerColors[i]} key={"m" + i} />)
  
  useEffect(() => {
    setCubeData([...edgeColors, ...cornerColors])
  }, [edgeColors, cornerColors])

  return (<>
    {edgeCubies}
    {cornerCubies}
    {centerCubies}
  </>)
}

type CubieProps = {
  positionId: number
  type: string
  colors: [string, string, string]
  setColor?: (color: string) => void
}


function Cubie({ positionId, type, colors, setColor=() => {} }: CubieProps) {
   const isCenter = type === "center"  
   const isCorner = type === "corner"
   const centerPos: Array<[number, number, number]> = [[0, 1, 0],
                                                      [0, -1, 0],
                                                      [0, 0, 1],
                                                      [0, 0, -1],
                                                      [-1, 0, 0],
                                                      [1, 0, 0]]

   const edgePos: Array<[number, number, number]> = [[0, 1, 1],
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

  const cornerPos: Array<[number, number, number]> = [[1, 1, 1],
                                                     [1, 1, -1],
                                                     [-1, 1, -1],
                                                     [-1, 1, 1],
                                                     [1, -1, 1],
                                                     [-1, -1, 1],
                                                     [-1, -1, -1],
                                                     [1, -1, -1]]

  const x = (isCorner && !isCenter) ? cornerPos[positionId][0] : isCenter ? centerPos[positionId][0] : edgePos[positionId][0]
  const y = (isCorner && !isCenter) ? cornerPos[positionId][1] : isCenter ? centerPos[positionId][1] : edgePos[positionId][1]
  const z = (isCorner && !isCenter) ? cornerPos[positionId][2] : isCenter ? centerPos[positionId][2] : edgePos[positionId][2]

  const xc1 = 0.06 * x
  const yc1 = 0
  const zc1 = 0

  const xc2 = 0
  const yc2 = 0.06 * y
  const zc2 = 0

  const xc3 = 0
  const yc3 = 0
  const zc3 = 0.06 * z

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    if (isCenter) {
      return
    }
   
    setColor(event.object.name)
  }

  return (
    <group position={[x, y, z]}>
      <mesh onClick={handleClick} name="x" position={[xc1, yc1, zc1]}>
        <boxGeometry args={[.9, .9, .9]} />
        <meshStandardMaterial color={colors[0]}/>
      </mesh>
      <mesh onClick={handleClick} name="y" position={[xc2, yc2, zc2]}>
        <boxGeometry args={[.9, .9, .9]} />
        <meshStandardMaterial color={colors[1]}/>
      </mesh>
      <mesh onClick={handleClick} name="z" position={[xc3, yc3, zc3]}>
        <boxGeometry args={[.9, .9, .9]} />
        <meshStandardMaterial color={colors[2]}/>
      </mesh>
      <mesh onPointerDown={(event) => event.stopPropagation()} position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="black"/>
      </mesh>
    </group>
  )
}


export default BlankCube