/* eslint-disable no-restricted-globals */


let loopId = 0
let loopTimer
let isPlay = true

const InitData = {
    shout: 0.5, 
    screen: {
        width: 1000,
        height: 100
    },
    degree: {
        alpha: 0,
        beta: 0,
        gamma: 0
    },
    ball: {
        size: [30, 30],
        speed: [0,0],
        acceleration: [0,0],
        position: [0,0]
    }
}

const data = {
    shout: 0.5, 
    screen: {
        width: 1000,
        height: 100
    },
    degree: {
        alpha: 0,
        beta: 0,
        gamma: 0
    },
    ball: {
        size: [30, 30],
        speed: [0,0],
        acceleration: [0,0],
        position: [0,0]
    }
}


// 시뮬레이션 코드
function simulation() {
    data.ball.acceleration[0] = data.degree.gamma * 0.005
    data.ball.acceleration[1] = data.degree.beta * 0.005

    data.ball.speed[0] += data.ball.acceleration[0]
    data.ball.speed[1] += data.ball.acceleration[1]

    data.ball.position[0] += data.ball.speed[0]
    data.ball.position[1] += data.ball.speed[1]

    if (data.ball.position[0] - data.ball.size[0]/2 <= -1 * data.screen.width / 2) {
        data.ball.position[0] -= 2*data.ball.speed[0]
        data.ball.speed[0] = -1 * data.ball.speed[0] * data.shout
    }

    if (data.ball.position[0] + data.ball.size[0]/2 >= data.screen.width / 2) {
        data.ball.position[0] -= 2*data.ball.speed[0]
        data.ball.speed[0] = -1 * data.ball.speed[0] * data.shout
    }

    if (data.ball.position[1] - data.ball.size[1]/2 <= -1 * data.screen.height / 2) {
        data.ball.position[1] -= 2*data.ball.speed[1]
        data.ball.speed[1] = -1 * data.ball.speed[1] * data.shout
    }

    if (data.ball.position[1] + data.ball.size[1]/2 >= 1 * data.screen.height / 2) {
        data.ball.position[1] -= 2*data.ball.speed[1]
        data.ball.speed[1] = -1 * data.ball.speed[1] * data.shout
    }

    return {
        ball: data.ball
    }
}


// 루프 관리
let updateRateCount = 0
let updateRateStartTime = new Date()
const loop = () => {
    if (updateRateCount === 0) updateRateStartTime = new Date()
    if (isPlay) {
        loopId++
        const result = simulation()
        self.postMessage({code: 'result', data: {
            loopId,
            result
        }})
    }
    updateRateCount++ 

    if (updateRateCount === 60) {
        updateRateCount = 0
        const updateRate = Math.round(60 / (new Date() - updateRateStartTime) * 1000)
        self.postMessage({code: 'ups', data: updateRate})
    }
}

// 리셋
const reset = () => {
    // 시뮬레이션 데이터 초기화
    data.ball = InitData.ball




    // 루프 초기화
    loopId = 0
    loopTimer && clearInterval(loopTimer)
    loopTimer = setInterval(loop, 16.6)
}
reset()

// IO
self.addEventListener('message', event => {
    switch (event.data.code) {

        // 기본 메세지
        case 'ping':
            self.postMessage({code: 'pong'})
            break

        case 'pause':
            isPlay = false
            break

        case 'play':
            isPlay = true
            break

        case 'reset':
            reset()
            break

        // 추가 메세지
        case 'degree':
            data.degree = event.data.data
            break

        case 'resize':
            data.screen = event.data.data
            console.log(data.screen)
            break

        default:
            console.error(`Wrong Command: '${event.data.code}' `)
    }
})
