export class AnimateCollision{
    constructor(game,x,y){
        this.game = game
        this.collisionImage = document.getElementById('collision_animation')
        this.spriteFrameX = 0
        this.maxSpriteFrameX = 8
        this.spriteFrameY = 4
        this.scaleSprite = 3
        this.spriteWidth = 64 // 704 / 11 = 64
        this.spriteHeight = 64 // 576 / 9 = 64
        this.scaledSpriteWidth = this.spriteWidth * this.scaleSprite
        this.scaledSpriteHeight = this.spriteHeight * this.scaleSprite
        this.x = x
        this.y = y
        this.fps = 20
        this.frameInterval = 1000/this.fps
        this.frameTimer = 0 // keep counting from frameTimer to frameInterval
    }

    update(deltaTime){
        this.x -= this.game.gameSpeed
        if (this.frameTimer >= this.frameInterval) {
            this.spriteFrameX++
            this.frameTimer = 0
        } else {
            this.frameTimer += deltaTime
        }

        if(this.spriteFrameX > this.maxSpriteFrameX){
            this.markedForDeletion = true
        }
    }

    // we already know when there is a collision, this class is to
    // display the animation when it is triggered
    draw(context){
        context.drawImage(
            this.collisionImage,
            this.spriteFrameX * this.spriteWidth, // origin
            this.spriteFrameY * this.spriteHeight, // origin
            this.spriteWidth, // origin
            this.spriteHeight, // origin
            this.x, // destination
            this.y, // destination
            this.scaledSpriteWidth, // destination
            this.scaledSpriteHeight // destination
        )
    }
}