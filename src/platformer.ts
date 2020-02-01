interface Player {
  xPosition: number
  xVelocity: number
}

interface Input {
  left: InputType
  right: InputType
}

type InputType = "up" | "down"
type Context = CanvasRenderingContext2D

const WIDTH = 500
const HEIGHT = 500

const canvas = document.getElementById("game") as HTMLCanvasElement
const accelerationElement = document.getElementById("acceleration") as HTMLInputElement
const frictionElement = document.getElementById("friction") as HTMLInputElement
const context = canvas.getContext("2d")

if (context) {
  const player: Player = {
    xPosition: 20,
    xVelocity: 0
  }

  const input = {
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

    player.xVelocity += xAcceleration * deltaTime - Number(frictionElement.value) * player.xVelocity * deltaTime
    player.xPosition += player.xVelocity * deltaTime

    clearScreen(context)
    drawPlayer(context, player)

    setTimeout(gameLoop, 0, context)
  }


  function clearScreen(context: Context): void {
    context.fillStyle = "#EEF"
    context.fillRect(0, 0, WIDTH, HEIGHT)
  }

  function drawPlayer(context: Context, player: Player): void {
    context.fillStyle = "#000"
    drawRectangle(context, player.xPosition, 30, 25, 25)
  }

  function drawRectangle(context: Context, xPos: number, yPos: number, width: number, height: number): void {
    context.fillRect(xPos, HEIGHT - yPos - height, width, height)
  }
}
