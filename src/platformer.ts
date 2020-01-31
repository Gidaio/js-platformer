interface Player {
  x: number
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
const context = canvas.getContext("2d")

if (context) {
  const player: Player = {
    x: 20
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

    if (input.left === "down") {
      player.x -= 100 * deltaTime
    }

    if (input.right === "down") {
      player.x += 100 * deltaTime
    }

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
    drawRectangle(context, player.x, 30, 25, 25)
  }

  function drawRectangle(context: Context, xPos: number, yPos: number, width: number, height: number): void {
    context.fillRect(xPos, HEIGHT - yPos - height, width, height)
  }
}
