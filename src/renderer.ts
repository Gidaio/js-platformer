import { Context, GameState, Vector2, Wall } from "./platformer.js"
import Player from "./player.js"


export default class Renderer {
  private static readonly CANVAS_WIDTH = 500
  private static readonly CANVAS_HEIGHT = 500

  private context: Context
  private pixelsPerMeterElement: HTMLInputElement
  private ppm: number

  public constructor(context: Context) {
    this.context = context
    this.pixelsPerMeterElement = document.getElementById("ppm") as HTMLInputElement

    this.pixelsPerMeterElement.addEventListener("input", () => {
      this.ppm = this.pixelsPerMeterElement.valueAsNumber
    })

    this.ppm = this.pixelsPerMeterElement.valueAsNumber
  }

  public render(gameState: GameState) {
    this.clearScreen()

    for (const wall of gameState.walls) {
      this.drawWall(wall)
    }

    this.drawPlayer(gameState.player)
  }

  private clearScreen(): void {
    this.context.fillStyle = "#EEF"
    this.context.fillRect(0, 0, Renderer.CANVAS_WIDTH, Renderer.CANVAS_HEIGHT)
  }

  private drawPlayer(player: Player): void {
    this.context.fillStyle = "#22E"
    const xScale = (player.velocity.y / 40) + 1
    const yScale = 1 / xScale

    const dimensionX = player.dimension.x * xScale
    const dimensionY = player.dimension.y * yScale

    const xShift = player.velocity.x / 50

    const leftX = player.position.x - dimensionX / 2
    const rightX = player.position.x + dimensionX / 2
    const bottomY = player.position.y
    const topY = player.position.y + dimensionY

    this.drawPath([
      { x: leftX, y: bottomY },
      { x: leftX - xShift, y: topY },
      { x: rightX - xShift, y: topY },
      { x: rightX, y: bottomY }
    ])
  }

  private drawWall(wall: Wall): void {
    this.context.fillStyle = "#000"
    this.drawRectangle(wall.position, wall.dimension)
  }

  private drawRectangle(position: Vector2, dimension: Vector2): void {
    this.context.fillRect(
      position.x * this.ppm,
      Renderer.CANVAS_HEIGHT - (position.y + dimension.y) * this.ppm,
      dimension.x * this.ppm,
      dimension.y * this.ppm
    )
  }

  private drawPath(points: Vector2[]): void {
    const canvasPoints: Vector2[] = points.map(point => ({
      x: point.x * this.ppm,
      y: Renderer.CANVAS_HEIGHT - point.y * this.ppm
    }))
    this.context.beginPath()
    for (let i = 0; i < canvasPoints.length; i++) {
      this.context.lineTo(canvasPoints[i].x, canvasPoints[i].y)
    }
    this.context.fill()
  }
}
