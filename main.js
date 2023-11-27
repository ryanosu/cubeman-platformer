import { Background } from "./background.js"
import { Player } from "./player.js"
import { InputHandler } from "./input.js"
import { Data } from "./data.js"

window.addEventListener('load', function(){
        const canvas = this.document.getElementById('canvas1')
        const ctx = canvas.getContext('2d')
        canvas.width = 2250 // overall game width
        canvas.height = 1500 // overall game height

        class Game{
            constructor(width, height){
                this.width = width
                this.height = height
                this.gameSpeed = 0
                this.fullGameSpeed = 3
                this.groundMargin = 50
                this.score = 0
                this.time = 0
                this.lives = 3
                this.background = new Background(this)
                this.player = new Player(this)
                this.input = new InputHandler()
                this.data = new Data(this)
            }
            
            update(deltaTime){
                this.time += deltaTime
                this.background.update()
                this.player.update(this.input.keys, deltaTime)
            }

            draw(context){
                this.background.draw(context)
                this.player.draw(context)
                this.data.draw(context)
            }
        }

        // create game instance
        const game = new Game(canvas.width, canvas.height)
        let prevTime = 0

        // animation loop
        function animate(timeStamp){
            const deltaTime = timeStamp - prevTime
            prevTime = timeStamp
            ctx.clearRect(0,0,canvas.width, canvas.height)
            game.update(deltaTime)
            game.draw(ctx)
            requestAnimationFrame(animate)
        }
        animate(0)
})