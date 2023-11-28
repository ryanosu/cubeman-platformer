import { Background } from "./background.js"
import { Player } from "./player.js"
import { InputHandler } from "./input.js"
import { Data } from "./data.js"
import { BlueAlien } from "./enemies.js"

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
                this.enemies = []
                this.enemyTimer = 0
                this.enemyInterval = 3000 // ms
                this.background = new Background(this)
                this.player = new Player(this)
                this.input = new InputHandler()
                this.data = new Data(this)
            }
            
            update(deltaTime){
                this.time += deltaTime
                this.background.update()
                this.player.update(this.input.keys, deltaTime)
                
                // update enemy timer
                if (this.enemyTimer > this.enemyInterval){
                    this.addEnemies()
                    this.enemyTimer = 0
                }
                else {
                    this.enemyTimer += deltaTime
                }
                
                // update enemies
                this.enemies.forEach(enemy =>{
                    enemy.update(deltaTime)
                })
            }

            draw(context){
                this.background.draw(context)
                this.player.draw(context)
                this.data.draw(context)

                this.enemies.forEach(enemy =>{
                    enemy.draw(context)
                })
            }

            addEnemies(){
                if(this.gameSpeed > 0){
                    this.enemies.push(new BlueAlien(this))
                }
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