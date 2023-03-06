// frame-per-second 每秒刷新频率

import { report } from '../utils/report'
import { MonitorType, PerformanceType } from '../types'

type FramesType = number[]
const frames: FramesType = []
const BLOCKING_FRAME = 20
const LAST = 3

export function getFps() {
  let frame = 0
  let lastTime = Date.now()
  function calculateFrame() {
    const now = Date.now()
    frame = frame + 1

    // 计算 1s 内帧频率
    if (lastTime + 1000 <= now) {
      const fps = Math.round(frame / (now - lastTime) / 1000)
      frames.push(fps)

      frame = 0
      lastTime = now
    }

    // 1 分钟上报一次
    if (frames.length >= 60) {
      report({
        type: MonitorType.Performance,
        subType: PerformanceType.FPS,
        frames,
        isBlocking: calculateBlocking(frames)
      })

      frames.length = 0
    }
  }

  requestAnimationFrame(calculateFrame)
}

// 连续3帧频率低于 20 则认为是卡顿
function calculateBlocking(frames: FramesType) {
  let count = 0
  for (const frame of frames) {
    count = frame < BLOCKING_FRAME ? count + 1 : 0
  }
  return count >= LAST
}
