import React, { useEffect, useRef, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { DrawCanvas } from '../components/canvas/drawCanvas';
import { ReactComponent as GithubSvg } from '../assets/github.svg'
import { ArrowClockwise } from 'phosphor-react';
import { useWorker } from '../hook/useWorker';
import { useToast } from '../hook/useToast';

const GithubIcon = styled(GithubSvg)`
    position: fixed;
    width: 24px;
    height: 24px;
    top: 36px;
    left: 36px;   
    user-select: none;
    fill: #ffffff;
`

const Divver = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const Reload = styled.div`
  position: fixed;
  width: 32px;
  bottom: 20px;
  left: calc(50vw - 16px);
`

function App() {
  return (
    <>
      <Divver className="App">
        <DrawCanvas />
      </Divver>
      <a href="https://github.com/HyunsDev/gyroball" target={"_blank"} rel="noreferrer">
        <GithubIcon /> 
      </a>
      <Reload>
        <ArrowClockwise size={28} color="#ffffff6f" weight="light" onClick={() => window.location.reload()} />
      </Reload>
    </>

  );
}

export default App;
