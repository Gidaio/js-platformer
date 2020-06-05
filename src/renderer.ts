import { Context, GameState, Vector2, Wall } from "./platformer.js"
import Player from "./player.js"


export default class Renderer {
  private static readonly CANVAS_WIDTH = 500
  private static readonly CANVAS_HEIGHT = 500

  private context: Context
  private pixelsPerMeterElement: HTMLInputElement

  public constructor(context: Context) {
    this.context = context
    this.pixelsPerMeterElement = document.getElementById("ppm") as HTMLInputElement
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
    this.drawRectangle({
      x: player.position.x - player.dimension.x / 2,
      y: player.position.y
    }, player.dimension)
  }

  private drawWall(wall: Wall): void {
    this.context.fillStyle = "#000"
    this.drawRectangle(wall.position, wall.dimension)
  }

  private drawRectangle(position: Vector2, dimension: Vector2): void {
    const ppm = Number(this.pixelsPerMeterElement.value)

    this.context.fillRect(
      position.x * ppm,
      Renderer.CANVAS_HEIGHT - (position.y + dimension.y) * ppm,
      dimension.x * ppm,
      dimension.y * ppm
    )
  }
}
