// on-screen data such as health, lives, score, and timer

export class Data{
    constructor(game){
        this.game = game
        this.fontSize = 50
        this.fontFamily = 'Halvetica'
        this.healthImage = document.getElementById('health')
        this.healthScale = 0.3
    }
    
    update(){

    }

    draw(context){
        context.fillStyle = "#00BFFF" // sky blue
        context.font = this.fontSize + 'px ' + this.fontFamily
        context.textAlign = 'left'
        // score
        context.fillText('Score: ' + this.game.score, 20, 50)
        // time
        context.fillText('Time: ' + (this.game.time * 0.001).toFixed(1), 20, 110)
        // health
        for(let i = 0; i < this.game.lives; i++){

            context.drawImage(
                this.healthImage,
                0, // origin x-coordinate of top-left corner of source rect 
                0, // origin y-coordinate of top-left corner of source rect
                1500, // origin size in width of image
                1001, // origin size in height of image
                -20 + (i * 100), // destination x-coordinate on canvas
                120, // destination y-coordinate on canvas
                150, // destination rectangle width on canvas
                100 // destination rectangle height on canvas
            )
        }

        // game over messages
        if (this.game.gameOver){
            
            context.fillStyle = "#FF0000" // red
            context.shadowOffsetX = 2
            context.shadowOffsetY = 2
            context.shadowColor = 'white'
            context.shadowBlur = 0
            context.shadowColor = 'white'
            context.textAlign = 'center'
            context.font = this.fontSize * 10 + 'px ' + this.fontFamily
            
            // win
            if (this.game.score > 5){
                context.fillText(
                    'You Win!',
                    this.game.width * 0.5,
                    this.game.height * 0.5 - 20
                )
                
                context.font = this.fontSize * 0.9 + 'px ' + this.fontFamily
                context.fillText(
                    'Refresh page to restart', 
                    this.game.width * 0.5,
                    this.game.height * 0.5 + 20
                )
            }

            // lose
            else{
                context.fillText(
                    'You Lose!',
                    this.game.width * 0.5,
                    this.game.height * 0.5 - 20
                )

                context.font = this.fontSize * 0.9 + 'px ' + this.fontFamily
                context.fillText(
                    'Refresh page to restart', 
                    this.game.width * 0.5,
                    this.game.height * 0.5 + 20
                )
            }

        }
    }
}