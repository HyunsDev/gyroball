import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useData } from "../../hook/useData";
import { useToast } from "../../hook/useToast";
import { useWorker } from "../../hook/useWorker";

type vector = [number, number]

interface DegreeType {
    alpha: number,
    beta: number,
    gamma: number
}

interface resultData {
    result: {
        ball: {
            speed: vector,
            acceleration: vector,
            position: vector
        }
    },
    loopId: number
}

const Canvas = styled.canvas`
    /* cursor: crosshair; */
    position: absolute;
    left: 0;
    top: 0;
    user-select: none;
`

const Points = styled.div`
    margin-top: 150px;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 4px;
`

const Point1 = styled.div`
    font-size: 16px;
    color: #ffffff97;
`

const Point2 = styled.div`
    font-size: 32px;
    color: #fff;
`

const getPos = ([x, y]:vector):vector => {
    return [
        x + window.innerWidth / 2,
        y + window.innerHeight / 2
    ]
}

const round = (num: number, digits: number) => {
    return Math.round(num * (10 ** digits)) / (10 ** digits)
} 

let _point = 0
let _point2 = 0
let _point2_check = false
function DrawCanvas() {
    const toast = useToast()
    const data = useData()
    const worker = useWorker()

    const [point, setPoint] = useState(0)
    const [point2, setPoint2] = useState(0)

    const canvasRef = useRef<HTMLCanvasElement>(null)
    const requestAnimationRef = useRef<any>(null)

    // 각도
    useEffect(() => {
      const callback = (e: DeviceOrientationEvent) => {
        worker.requestWorker('degree', {
            alpha: round(e.alpha || 0, 1),
            beta: round(e.beta || 0, 1),
            gamma: round(e.gamma || 0, 1)
        })
      }
  
      window.addEventListener('deviceorientation', callback)
      return () => {
        window.removeEventListener('deviceorientation', callback)
      }
    }, [worker])

    useEffect(() => {
        const resize = () => {
            if (canvasRef.current) {
                canvasRef.current.width=window.innerWidth
                canvasRef.current.height=window.innerHeight
                worker.requestWorker('resize', {width: window.innerWidth, height: window.innerHeight})
            }
        }

        resize()
        window.addEventListener('resize', resize)
        return () => {
            window.removeEventListener('resize', resize)
        }
    }, [worker])

    const drawLine = useCallback((vector1: vector, vector2: vector, strokeColor: string = 'rgba(216, 216, 216, 0.3)') => {
        if (!canvasRef.current) return;
        const canvas: HTMLCanvasElement = canvasRef.current;
        const context = canvas.getContext('2d');
        if(!context) return

        context.strokeStyle = strokeColor;
        context.beginPath()
        context.moveTo(...getPos(vector1))
        context.lineTo(...getPos(vector2))
        context.stroke()
    }, [])

    const drawCircle = useCallback((vector: vector, radius: number, strokeColor: string = '#1C99F9', fillColor: string = '#051525') => {
        if (!canvasRef.current) return;
        const canvas: HTMLCanvasElement = canvasRef.current;
        const context = canvas.getContext('2d');
        if(!context) return

        context.beginPath()

        context.arc(...getPos(vector), radius, 0, 2*Math.PI) 
        context.fillStyle = fillColor
        context.fill()
    
        context.strokeStyle = strokeColor
        context.lineWidth = 1;
        context.stroke()
    }, [])

    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas: HTMLCanvasElement = canvasRef.current;
        const context = canvas.getContext('2d');
        if(!context) return

        let listener = worker.addListener('result', (result: resultData) => {
            context.clearRect(0, 0, canvas.width, canvas.height);

            // 그리기
            const isBallInCircle = Math.abs(result.result.ball.position[0]) < 20 && Math.abs(result.result.ball.position[1]) < 20
            drawCircle([0,0], 40, isBallInCircle ? '#1C99F9' : '#ffffff', 'rgba(0,0,0,0)')

            drawCircle(result.result.ball.position, 30)
            drawLine([0,0], result.result.ball.acceleration)

        })
        return () => {
            worker.removeListener(listener)
        }
    }, [data, drawCircle, drawLine, worker])

    useEffect(() => {
        let listener = worker.addListener('result', (result: resultData) => {
            const isBallInCircle = Math.abs(result.result.ball.position[0]) < 20 && Math.abs(result.result.ball.position[1]) < 20
            if (isBallInCircle) {
                _point += 1
                setPoint(_point)
                if (!_point2_check) {
                    _point2 = 0
                    _point2_check = true
                }
                _point2 += 1
                setPoint2(_point2)
            } else {
                _point2_check = false
            }
        })
        return () => {
            worker.removeListener(listener)
        }
    }, [worker])

    return (
        <>
            <Canvas ref={canvasRef} />
            <Points>
                <Point2>{Math.round(point2/10)}</Point2>
                <Point1>{Math.round(point/10)}</Point1>
            </Points>
        </>
        
    )
}

export {
    DrawCanvas
}