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


const canvas = document.getElementById("game") as HTMLCanvasElement
const accelerationElement = document.getElementById("acceleration") as HTMLInputElement
const frictionElement = document.getElementById("friction") as HTMLInputElement
const context = canvas.getContext("2d")

if (context) {
  const renderer = new Renderer(context)

  const player: Player = {
    xPosition: 1,
    xVelocity: 0
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

    player.xVelocity += xAcceleration * deltaTime - Number(frictionElement.value) * player.xVelocity * deltaTime
    player.xPosition += player.xVelocity * deltaTime

    renderer.render(player)

    setTimeout(gameLoop, 0, context)
  }
}
