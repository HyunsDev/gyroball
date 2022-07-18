import React, { useEffect, useRef, useState } from 'react';
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
  width: 256px;
  height: 256px;
  border: solid 4px #000;
  border-radius: 150px;
  
  display: flex;
  align-items: center;
  justify-content: center;
`


interface circleProps {
  pos: DegreeType
}
const Circle2 = styled.div`
  position: absolute;
  width: 64px;
  height: 64px;
  background-color: #000;
  border-radius: 100px;
`

const round = (num: number, digits: number) => {
  return Math.round(num * (10 ** digits)) / (10 ** digits)
} 

function App() {
  const [degree, setDegree] = useState<DegreeType>({alpha: 0, beta: 0, gamma: 0})
  const circle1Ref = useRef<HTMLDivElement>(null)

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

  return (
    <Divver className="App">
      <Debug>
        {JSON.stringify(degree, null, 2)}
        <br />
        <p onClick={() => {window.location.reload()}}>[ Reload ]</p>
      </Debug>
      <Circle1 ref={circle1Ref}>
        <Circle2 style={{
          top: 128 - 32 + degree.beta * -5,
          left: 128 - 32 + degree.gamma * -5
        }} />
      </Circle1>
    </Divver>
  );
}

export default App;
