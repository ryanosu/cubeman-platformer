class Platform{
    constructor(){
        this.markedForDeletion = false
    }

    update(deltaTime){
        this.x -= this.game.gameSpeed

        // check if any are off the screen and mark for deletion
        if(this.x + this.platformWidthScaled < 0){
            this.markedForDeletion = true
        }
    }

    draw(context){
        // draw randomly from 1/3 to 1/2 of screen size
        context.drawImage(
            this.platformImage,
            0, // origin x-corrdinate
            0, // origin y-coordinate
            this.platformWidth, // origin image width
            this.platformHeight, // origin image height
            this.x, // destination x-coordinate
            this.y, // destination y-coordinate
            this.platformWidthScaled, // destination image width
            this.platformHeightScaled // destination image height
        )
    }
}

export class MetalPlatform1 extends Platform{
    constructor(game){
        super()
        this.game = game
        this.platformImage = document.getElementById('metal_platform_1')
        this.platformWidth = 401
        this.platformHeight = 401
        this.platformScale = 0.4
        this.platformWidthScaled = this.platformWidth * this.platformScale
        this.platformHeightScaled = this.platformHeight * this.platformScale
        this.x = this.game.width // right-screen on canvas
        this.y = this.game.height - this.game.groundMargin - 600// right-screen of canvas
    }
}