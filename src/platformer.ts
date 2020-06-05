import Player from "./player.js"
import Renderer from "./renderer.js"


export interface GameState {
  input: Input
  player: Player
  walls: Wall[]
}

export interface Wall {
  position: Vector2
  dimension: Vector2
}

export interface Vector2 {
  x: number
  y: number
}

export interface Input {
  left: InputType
  right: InputType
  up: InputType
}

type InputType = "up" | "down"
export type Context = CanvasRenderingContext2D


const canvas = document.getElementById("game") as HTMLCanvasElement
const backButton = document.getElementById("back") as HTMLButtonElement
const pausePlayButton = document.getElementById("pause-play") as HTMLButtonElement
const forwardButton = document.getElementById("forward") as HTMLButtonElement
const stepSizeElement = document.getElementById("step-size") as HTMLInputElement


const context = canvas.getContext("2d")

if (context) {
  let isPaused = false
  let gameStateIndex = 0
  let previousGameStates: GameState[] = []

  const renderer = new Renderer(context)

  const gameState: GameState = {
    input: {
      left: "up",
      right: "up",
      up: "up"
    },
    player: new Player(),
    walls: [
      {
        position: { x: 0, y: 0 },
        dimension: { x: 10, y: 0.25 }
      },
      {
        position: { x: 0, y: 0 },
        dimension: { x: 0.25, y: 10 }
      },
      {
        position: { x: 9.75, y: 0 },
        dimension: { x: 0.25, y: 10 }
      },
      {
        position: { x: 1 , y: 2 },
        dimension: { x: 4, y: 0.4 }
      },
      {
        position: { x: 6, y: 3.5 },
        dimension: { x: 0.4, y: 0.2 }
      },
      {
        position: { x: 4.8, y: 7 },
        dimension: { x: 0.4, y: 3 }
      }
    ]
  }

  let previousTime: DOMHighResTimeStamp

  pausePlayButton.addEventListener("click", () => {
    if (!isPaused) {
      gameStateIndex = 0
      isPaused = true
      pausePlayButton.innerText = "Play"
    } else {
      isPaused = false
      pausePlayButton.innerText = "Pause"
      previousTime = new Date().getTime()
      setTimeout(gameLoop, 0, context)
    }
  })

  backButton.addEventListener("click", () => {
    if (!isPaused) { return }
    gameStateIndex = Math.min(199, gameStateIndex + Number(stepSizeElement.value))
    renderer.render(previousGameStates[gameStateIndex])
  })

  forwardButton.addEventListener("click", () => {
    if (!isPaused) { return }
    gameStateIndex = Math.max(0, gameStateIndex - Number(stepSizeElement.value))
    renderer.render(previousGameStates[gameStateIndex])
  })

  requestAnimationFrame((timestamp) => gameLoop(timestamp, context))

  document.addEventListener("keydown", event => {
    if (event.key === "ArrowRight") {
      gameState.input.right = "down"
    }

    if (event.key === "ArrowLeft") {
      gameState.input.left = "down"
    }

    if (event.key === "ArrowUp" || event.key === " ") {
      gameState.input.up = "down"
    }
  })

  document.addEventListener("keyup", event => {
    if (event.key === "ArrowRight") {
      gameState.input.right = "up"
    }

    if (event.key === "ArrowLeft") {
      gameState.input.left = "up"
    }

    if (event.key === "ArrowUp" || event.key === " ") {
      gameState.input.up = "up"
    }
  })

  function gameLoop(timestamp: DOMHighResTimeStamp, context: Context) {
    if (isPaused) {
      return
    }

    if (!previousTime) {
      previousTime = timestamp
      requestAnimationFrame((timestamp) => gameLoop(timestamp, context))

      return
    }

    const deltaTime = (timestamp - previousTime) / 1000
    previousTime = timestamp

    gameState.player.update(deltaTime, gameState.walls, gameState.input)

    renderer.render(gameState)

    previousGameStates = [JSON.parse(JSON.stringify(gameState)), ...previousGameStates].slice(0, 200)

    requestAnimationFrame((timestamp) => gameLoop(timestamp, context))
  }
}
