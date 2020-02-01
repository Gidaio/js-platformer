interface GameState {
  player: Player
  walls: Wall[]
}

interface Player {
  position: Vector2
  dimension: Vector2
  velocity: Vector2
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
}

type InputType = "up" | "down"
type Context = CanvasRenderingContext2D


const canvas = document.getElementById("game") as HTMLCanvasElement
const accelerationElement = document.getElementById("acceleration") as HTMLInputElement
const frictionElement = document.getElementById("friction") as HTMLInputElement
const context = canvas.getContext("2d")


let previousRightT: number


if (context) {
  const renderer = new Renderer(context)

  const gameState: GameState = {
    player: {
      position: { x: 5, y: 1 },
      dimension: { x: 0.5, y: 0.5 },
      velocity: { x: 0, y: 0 }
    },
    walls: [
      // {
      //   position: { x: 1, y: 0 },
      //   dimension: { x: 8, y: 1 }
      // },
      {
        position: { x: 0, y: 0 },
        dimension: { x: 1, y: 3 }
      },
      {
        position: { x: 9, y: 0 },
        dimension: { x: 1, y: 3 }
      }
    ]
  }

  const input: Input = {
    left: "up",
    right: "up"
  }

  let previousTime = new Date().getTime()

  setTimeout(gameLoop, 0, context)

  document.addEventListener("keydown", event => {
    if (event.key === "ArrowRight") {
      input.right = "down"
    }

    if (event.key === "ArrowLeft") {
      input.left = "down"
    }
  })

  document.addEventListener("keyup", event => {
    if (event.key === "ArrowRight") {
      input.right = "up"
    }

    if (event.key === "ArrowLeft") {
      input.left = "up"
    }
  })

  function gameLoop(context: Context) {
    const now = new Date().getTime()
    const deltaTime = (now - previousTime) / 1000
    previousTime = now

    let xAcceleration = 0

    if (input.left === "down") {
      xAcceleration -= Number(accelerationElement.value)
    }

    if (input.right === "down") {
      xAcceleration += Number(accelerationElement.value)
    }

    const player = gameState.player

    player.velocity.x += xAcceleration * deltaTime - Number(frictionElement.value) * player.velocity.x * deltaTime
    if (Math.abs(player.velocity.x) < 0.0001) {
      player.velocity.x = 0
    }

    let bestT = deltaTime

    if (player.velocity.x !== 0) {
      for (const wall of gameState.walls) {
        let leftT = (wall.position.x - player.dimension.x / 2 - player.position.x) / player.velocity.x

        if (
          leftT > 0 && leftT < bestT &&
          player.position.y >= wall.position.y &&
          player.position.y <= wall.position.y + wall.dimension.y
        ) {
          bestT = leftT
        }

        let rightT = (wall.position.x + wall.dimension.x + player.dimension.x / 2 - player.position.x) / player.velocity.x

        if (
          rightT > 0 && rightT < bestT &&
          player.position.y >= wall.position.y &&
          player.position.y <= wall.position.y + wall.dimension.y
        ) {
          bestT = rightT
        }
      }
    }

    player.position.x += player.velocity.x * bestT - Math.sign(player.velocity.x) * 0.0001

    renderer.render(gameState)

    setTimeout(gameLoop, 0, context)
  }
}
