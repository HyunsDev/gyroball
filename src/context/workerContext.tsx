import React, { createContext, useEffect, useRef, useCallback } from "react";

export const WorkerContext = createContext({
    requestWorker: (code: string, data?:any) => {},
    addListener: (code: string, callback: (data: any) => any):symbol => Symbol(),
    removeListener: (symbol: symbol) => {}
})

interface Listeners {
    [key: symbol]: {
        code: string,
        callback: Function
    }
}

const WorkerProvider = ({children}: {children: React.ReactNode}) => {
    const worker = useRef<Worker>();
    const listeners = useRef<Listeners>({})

    useEffect(() => {
        if (!worker.current) {
            worker.current = new Worker('./simulator.js')
        }
    }, [])

    useEffect(() => {
        // 메세지 수신
        if (!worker.current) {
            console.log('worker is unLoaded')
            return
        }
        worker.current.onmessage = (msg:any) => {
            for (let listenerSymbol of Object.getOwnPropertySymbols(listeners.current)) {
                const listener = listeners.current[listenerSymbol]
                if (listener.code === msg.data.code) {
                    listener.callback(msg.data.data)
                }
            }
        }
    }, [])

    // 워커 쓰레드에 요청
    const requestWorker = useCallback((code: string, data?:any) => {
        if (!worker.current) {
            console.log('worker is unLoaded')
            return
        }
        worker.current.postMessage({
            code,
            data
        })
    }, [])

    // 리스너 추가
    const addListener = useCallback((code: string, callback: Function):symbol => {
        const symbol = Symbol(code)
        listeners.current = {
            ...listeners.current,
            [symbol]: {
                code,
                callback
            }
        }
        return symbol
    }, [])

    // 리스너 지우기
    const removeListener = useCallback((symbol: symbol) => {
        const newListeners = listeners.current
        delete newListeners[symbol]
        listeners.current = newListeners
    }, [])

    return (
        <WorkerContext.Provider
            value={{
                requestWorker,
                addListener,
                removeListener
            }}
        >
            {children}
        </WorkerContext.Provider>
    )
}

export default WorkerProvider;
