import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

interface DegreeType {
  alpha: number,
  beta: number,
  gamma: number
}

interface MotionType {
  x: number,
  y: number,
  z: number
}

const Debug = styled.pre`
  position: fixed;
  left: 20px;
  bottom: 20px;
  background-color: #000;
  color: #fff;
  padding: 8px;
  border-radius: 4px;
`

const Divver = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Circle1 = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  border: solid 4px #000;
  border-radius: 150px;
  
  display: flex;
  align-items: center;
  justify-content: center;
`


interface circleProps {
  pos: DegreeType
  motion: MotionType
}
const Circle2 = styled.div<circleProps>`
  margin-top: ${props => props.pos.beta * -5}px;
  margin-left: ${props => props.pos.gamma * -5}px;
  width: 64px;
  height: 64px;
  transform: scale(${props => 1 + ((props.motion.z - 9.8) / 2 - Math.abs(props.motion.x)) / 10}, ${props => 1 + ((props.motion.z - 9.8) / 2 - Math.abs(props.motion.y)) / 10});
  background-color: #000;
  border-radius: 100px;
`

const round = (num: number, digits: number) => {
  return Math.round(num * (10 ** digits)) / (10 ** digits)
} 

function App() {
  const [ debug, setDebug ] = useState('')
  const [degree, setDegree] = useState<DegreeType>({alpha: 0, beta: 0, gamma: 0})

  const [motion, setMotion] = useState({
    x: 0,
    y: 0,
    z: 0
  })

  // 각도
  useEffect(() => {
    const callback = (e: DeviceOrientationEvent) => {
      setDegree({
        alpha: round(e.alpha || 0, 1),
        beta: round(e.beta || 0, 1),
        gamma: round(e.gamma || 0, 1)
      })
    }

    window.addEventListener('deviceorientation', callback)
    return () => {
      window.removeEventListener('deviceorientation', callback)
    }
  }, [])

  // 가속도
  useEffect(() => {
    const callback = (e: DeviceMotionEvent) => {
      setMotion({
        x: round(e.accelerationIncludingGravity?.x || 0, 1),
        y: round(e.accelerationIncludingGravity?.y || 0, 1),
        z: round(e.accelerationIncludingGravity?.z || 0, 1)
      })
    }

    window.addEventListener('devicemotion', callback)
    return () => {
      window.removeEventListener('devicemotion', callback)
    }
  }, [])

  return (
    <Divver className="App">
      <Debug>
        {JSON.stringify(degree, null, 2)}
        <br />
        {JSON.stringify(motion, null, 2)}
        <br />
        { Math.round((1 + ((motion.z - 9.8) / 2 - Math.abs(motion.x)) / 10) * 100) / 100 }
        <br />
        { Math.round((1 + ((motion.z - 9.8) / 2 - Math.abs(motion.y)) / 10) * 100) / 100 }
        <br />
        <p onClick={() => {window.location.reload()}}>[ Reload ]</p>
      </Debug>
      <Circle1>
        <Circle2 pos={degree} motion={motion} />
      </Circle1>
    </Divver>
  );
}

export default App;
