import { Background } from "./background.js"
import { Player } from "./player.js"

window.addEventListener('load', function(){
        const canvas = this.document.getElementById('canvas1')
        const ctx = canvas.getContext('2d')
        canvas.width = 2250 // overall game width
        canvas.height = 1500 // overall game height

        class Game{
            constructor(width, height){
                this.width = width
                this.height = height
                this.background = new Background(this)
                this.player = new Player(this)
            }
            
            update(){
            }

            draw(context){
                this.background.draw(context)
                this.player.draw(context)
            }
        }

        // create game instance
        const game = new Game(canvas.width, canvas.height)

        // animation loop
        function animate(){
            ctx.clearRect(0,0,canvas.width, canvas.height)
            game.draw(ctx)
            requestAnimationFrame(animate)
        }
        animate()
})