class Renderer {
  private static readonly CANVAS_WIDTH = 500
  private static readonly CANVAS_HEIGHT = 500

  private context: Context
  private pixelsPerMeterElement: HTMLInputElement

  public constructor(context: Context) {
    this.context = context
    this.pixelsPerMeterElement = document.getElementById("ppm") as HTMLInputElement
  }

  public render(player: Player) {
    this.clearScreen()
    this.drawPlayer(player)
  }

  private clearScreen(): void {
    this.context.fillStyle = "#EEF"
    this.context.fillRect(0, 0, Renderer.CANVAS_WIDTH, Renderer.CANVAS_HEIGHT)
  }

  private drawPlayer(player: Player): void {
    this.context.fillStyle = "#000"
    this.drawRectangle(player.xPosition, 2, 0.5, 0.5)
  }

  private drawRectangle(xPos: number, yPos: number, width: number, height: number): void {
    const ppm = Number(this.pixelsPerMeterElement.value)

    this.context.fillRect(
      Math.floor(xPos * ppm),
      Math.floor(Renderer.CANVAS_HEIGHT - (yPos - height) * ppm),
      Math.floor(width * ppm),
      Math.floor(height * ppm)
    )
  }
}
