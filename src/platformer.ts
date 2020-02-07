interface GameState {
  input: Input
  player: Player
  walls: Wall[]
}

interface Player {
  position: Vector2
  dimension: Vector2
  velocity: Vector2
  collisionSides: {
    left: boolean
    right: boolean
    up: boolean
    down: boolean
  }
}

interface Wall {
  position: Vector2
  dimension: Vector2
}

interface Vector2 {
  x: number
  y: number
}

interface Input {
  left: InputType
  right: InputType
  up: InputType
}

type InputType = "up" | "down"
type Context = CanvasRenderingContext2D


const canvas = document.getElementById("game") as HTMLCanvasElement
const accelerationElement = document.getElementById("acceleration") as HTMLInputElement
const frictionElement = document.getElementById("friction") as HTMLInputElement
const gravityElement = document.getElementById("gravity") as HTMLInputElement
const jumpElement = document.getElementById("jump") as HTMLInputElement
const context = canvas.getContext("2d")


if (context) {
  const renderer = new Renderer(context)

  const gameState: GameState = {
    input: {
      left: "up",
      right: "up",
      up: "up"
    },
    player: {
      position: { x: 5, y: 1 },
      dimension: { x: 0.5, y: 0.5 },
      velocity: { x: 0, y: 0 },
      collisionSides: {
        left: false,
        right: false,
        up: false,
        down: false
      }
    },
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

  let previousTime = new Date().getTime()

  setTimeout(gameLoop, 0, context)

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

  function gameLoop(context: Context) {
    const now = new Date().getTime()
    const deltaTime = (now - previousTime) / 1000
    previousTime = now

    let xAcceleration = 0
    const player = gameState.player

    if (gameState.input.left === "down") {
      xAcceleration -= Number(accelerationElement.value)
    }

    if (gameState.input.right === "down") {
      xAcceleration += Number(accelerationElement.value)
    }

    if (gameState.input.up === "down" && player.collisionSides.down) {
      player.velocity.y += Number(jumpElement.value)
    }

    player.velocity.x += xAcceleration * deltaTime - Number(frictionElement.value) * player.velocity.x * deltaTime
    if (Math.abs(player.velocity.x) < 0.0001) {
      player.velocity.x = 0
    }

    player.velocity.y += Number(gravityElement.value) * deltaTime
    if (Math.abs(player.velocity.y) < 0.0001) {
      player.velocity.y = 0
    }

    player.collisionSides = {
      left: false,
      right: false,
      up: false,
      down: false
    }

    let bestTX = deltaTime
    let bestTY = deltaTime

    for (const wall of gameState.walls) {
      const minkowskiWall: Wall = {
        position: {
          x: wall.position.x - player.dimension.x / 2,
          y: wall.position.y - player.dimension.y
        },
        dimension: {
          x: wall.dimension.x + player.dimension.x,
          y: wall.dimension.y + player.dimension.y
        }
      }

      if (player.velocity.x !== 0) {
        let leftT = (minkowskiWall.position.x - player.position.x) / player.velocity.x

        if (
          leftT > 0 && leftT < bestTX &&
          player.position.y >= minkowskiWall.position.y &&
          player.position.y <= minkowskiWall.position.y + minkowskiWall.dimension.y
        ) {
          bestTX = leftT
          // Left side of the wall, right side of the player.
          player.collisionSides.right = true
        }

        let rightT = (minkowskiWall.position.x + minkowskiWall.dimension.x - player.position.x) / player.velocity.x

        if (
          rightT > 0 && rightT < bestTX &&
          player.position.y >= minkowskiWall.position.y &&
          player.position.y <= minkowskiWall.position.y + minkowskiWall.dimension.y
        ) {
          bestTX = rightT
          player.collisionSides.left = true
        }
      }

      if (player.velocity.y !== 0) {
        let bottomT = (minkowskiWall.position.y - player.position.y) / player.velocity.y

        if (
          bottomT > 0 && bottomT < bestTY &&
          player.position.x >= minkowskiWall.position.x &&
          player.position.x <= minkowskiWall.position.x + minkowskiWall.dimension.x
        ) {
          bestTY = bottomT
          player.collisionSides.up = true
        }

        let topT = (minkowskiWall.position.y + minkowskiWall.dimension.y - player.position.y) / player.velocity.y

        if (
          topT > 0 && topT < bestTY &&
          player.position.x >= minkowskiWall.position.x &&
          player.position.x <= minkowskiWall.position.x + minkowskiWall.dimension.x
        ) {
          bestTY = topT
          player.collisionSides.down = true
        }
      }
    }

    player.position.x += player.velocity.x * bestTX - Math.sign(player.velocity.x) * 0.0001
    if (bestTX < deltaTime) {
      player.velocity.x = 0
    }

    player.position.y += player.velocity.y * bestTY - Math.sign(player.velocity.y) * 0.0001
    if (bestTY < deltaTime) {
      player.velocity.y = 0
    }

    renderer.render(gameState)

    setTimeout(gameLoop, 0, context)
  }
}
