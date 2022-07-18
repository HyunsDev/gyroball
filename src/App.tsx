import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const Debug = styled.pre`
  position: fixed;
  left: 20px;
  bottom: 20px;
  background-color: #000;
  color: #fff;
  padding: 8px;
  border-radius: 4px;

`

function App() {
  const [debug, setDebug] = useState('')

  useEffect(() => {
    const callback = (e: DeviceOrientationEvent) => {
      console.log(e)
      setDebug(JSON.stringify({
        a: true,
        alpha: e.alpha,
        beta: e.beta,
        gamma: e.gamma
      }, null, 2))
    }

    window.addEventListener('deviceorientation', callback)
    return () => {
      window.removeEventListener('deviceorientation', callback)
    }
  }, [])



  return (
    <div className="App">
      <Debug>
        {debug}
      </Debug>
    </div>
  );
}

export default App;
