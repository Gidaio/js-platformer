import { Input, Vector2, Wall } from "./platformer.js"


interface CollisionSides {
  up: boolean
  down: boolean
  left: boolean
  right: boolean
}


const accelerationElement = document.getElementById("acceleration") as HTMLInputElement
const frictionElement = document.getElementById("friction") as HTMLInputElement
const gravityElement = document.getElementById("gravity") as HTMLInputElement
const jumpElement = document.getElementById("jump") as HTMLInputElement


export default class Player {
  private _position: Vector2 = { x: 5, y: 1 }

  public get position(): Vector2 {
    return { x: this._position.x, y: this._position.y }
  }

  public readonly dimension: Vector2 = { x: 0.5, y: 0.5 }
  private velocity: Vector2 = { x: 0, y: 0 }
  collisionSides: CollisionSides = {
    left: false,
    right: false,
    up: false,
    down: false
  }

  public update(deltaTime: number, walls: Wall[], input: Input): void {
    let xAcceleration = 0

    if (input.left === "down") {
      xAcceleration -= Number(accelerationElement.value)
    }

    if (input.right === "down") {
      xAcceleration += Number(accelerationElement.value)
    }

    if (input.up === "down" && this.collisionSides.down) {
      this.velocity.y += Number(jumpElement.value)
    }

    this.velocity.x += xAcceleration * deltaTime - Number(frictionElement.value) * this.velocity.x * deltaTime
    if (Math.abs(this.velocity.x) < 0.0001) {
      this.velocity.x = 0
    }

    this.velocity.y += Number(gravityElement.value) * deltaTime
    if (Math.abs(this.velocity.y) < 0.0001) {
      this.velocity.y = 0
    }

    this.collisionSides = {
      left: false,
      right: false,
      up: false,
      down: false
    }

    let bestTX = deltaTime
    let bestTY = deltaTime

    for (const wall of walls) {
      const minkowskiWall: Wall = {
        position: {
          x: wall.position.x - this.dimension.x / 2,
          y: wall.position.y - this.dimension.y
        },
        dimension: {
          x: wall.dimension.x + this.dimension.x,
          y: wall.dimension.y + this.dimension.y
        }
      }

      if (this.velocity.x !== 0) {
        let leftT = (minkowskiWall.position.x - this._position.x) / this.velocity.x

        if (
          leftT > 0 && leftT < bestTX &&
          this._position.y >= minkowskiWall.position.y &&
          this._position.y <= minkowskiWall.position.y + minkowskiWall.dimension.y
        ) {
          bestTX = leftT
          // Left side of the wall, right side of the player.
          this.collisionSides.right = true
        }

        let rightT = (minkowskiWall.position.x + minkowskiWall.dimension.x - this._position.x) / this.velocity.x

        if (
          rightT > 0 && rightT < bestTX &&
          this._position.y >= minkowskiWall.position.y &&
          this._position.y <= minkowskiWall.position.y + minkowskiWall.dimension.y
        ) {
          bestTX = rightT
          this.collisionSides.left = true
        }
      }

      if (this.velocity.y !== 0) {
        let bottomT = (minkowskiWall.position.y - this._position.y) / this.velocity.y

        if (
          bottomT > 0 && bottomT < bestTY &&
          this._position.x >= minkowskiWall.position.x &&
          this._position.x <= minkowskiWall.position.x + minkowskiWall.dimension.x
        ) {
          bestTY = bottomT
          this.collisionSides.up = true
        }

        let topT = (minkowskiWall.position.y + minkowskiWall.dimension.y - this._position.y) / this.velocity.y

        if (
          topT > 0 && topT < bestTY &&
          this._position.x >= minkowskiWall.position.x &&
          this._position.x <= minkowskiWall.position.x + minkowskiWall.dimension.x
        ) {
          bestTY = topT
          this.collisionSides.down = true
        }
      }
    }

    this._position.x += this.velocity.x * bestTX - Math.sign(this.velocity.x) * 0.0001
    if (bestTX < deltaTime) {
      this.velocity.x = 0
    }

    this._position.y += this.velocity.y * bestTY - Math.sign(this.velocity.y) * 0.0001
    if (bestTY < deltaTime) {
      this.velocity.y = 0
    }
  }
}