// all enemies and their behavior will go here

class Enemy{
    constructor(){
        this.spriteFrameX = 0
        this.spriteFrameY = 0
        this.fps = 20
        this.frameInterval = 1000/this.fps
        this.frameTimer = 0
    }

    update(deltaTime){
        // movement
        this.x -= this.enemySpeedX + this.game.gameSpeed
        //this.y += this.enemySpeedY
        if(this.frameTimer > this.frameInterval){
            this.frameTimer = 0
            if(this.spriteFrameX < this.maxSpriteFrameX)this.spriteFrameX++
            else this.spriteFrameX = 0
        }
        else{
            this.frameTimer += deltaTime
        }
    }

    draw(context){
        context.drawImage(
            this.enemyImage, // image that we draw
            this.spriteFrameX * this.enemyWidth, // origin x-coordinate of top-left corner of source rect 
            0, // origin y-coordinate of top-left corner of source rect
            this.enemyWidth, // origin size in width of image
            this.enemyHeight, // origin size in height of image
            this.x, // destination x-coordinate on canvas
            this.y, // destination y-coordinate on canvas
            this.widthScaled, // destination rectangle width on canvas
            this.heightScaled // destination rectangle height on canvas
        )
    }
}

export class BlueAlien extends Enemy{
    constructor(game){
        super()
        this.game = game
        this.enemyImage = document.getElementById('hair_enemy')
        this.enemyWidth = 946 // 12,298 / 13 = 946 
        this.enemyHeight = 821
        this.blueAlienScaled = 0.4
        this.widthScaled = this.enemyWidth * this.blueAlienScaled
        this.heightScaled = this.enemyHeight * this.blueAlienScaled
        this.x = this.game.width
        this.y = this.game.height - this.heightScaled - this.game.groundMargin
        //this.spriteFrameX = 0
        //this.spriteFrameY = 1 // WALKING row
        this.enemySpeedX = 0
        this.enemySpeedY = 0
        this.maxSpriteFrameX = 12
    }

    update(deltaTime){
        super.update(deltaTime) // runs Enemy.update()
        this.x -= 1
    }
}