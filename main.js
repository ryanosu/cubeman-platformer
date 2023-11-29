import { Background } from "./background.js"
import { Player } from "./player.js"
import { InputHandler } from "./input.js"
import { Data } from "./data.js"
import { HairEnemy, DollGhostEnemy } from "./enemies.js"
import { AnimateCollision } from "./animateCollision.js"

window.addEventListener('load', function(){
        const canvas = this.document.getElementById('canvas1')
        const ctx = canvas.getContext('2d')
        canvas.width = 2250 // overall game width
        canvas.height = 1500 // overall game height

        // const audio = document.querySelector("audio");
        // audio.volume = 0.2;
        // audio.play();
        document.getElementById('backgroundMusic').volume = 0.3

        class Game{
            constructor(width, height){
                this.width = width
                this.height = height
                this.gameSpeed = 0
                this.fullGameSpeed = 3
                this.groundMargin = 50
                this.score = 0
                this.time = 0
                this.maxGameTime = 30000 // ms
                this.lives = 3
                this.enemies = []
                this.collisions = []
                this.enemyTimer = 0
                this.enemyInterval = 3000 // ms
                this.debug = false
                this.gameOver = false
                this.background = new Background(this)
                this.player = new Player(this)
                this.input = new InputHandler(this)
                this.data = new Data(this)
            }
            
            update(deltaTime){
                this.time += deltaTime

                if (this.lives == 0 || this.time > this.maxGameTime){
                    this.gameOver = true
                }

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
                this.player.checkCollision()

                // this.collision.update(deltaTime)
                 // handle collision sprites
                this.collisions.forEach((collision, index)=>{
                    collision.update(deltaTime)
                    if (collision.markedForDeletion) this.collisions.splice(index, 1)
                })

                this.enemies.forEach(enemy =>{
                    if (enemy.markedForDeletion){
                        this.enemies.splice(this.enemies.indexOf(enemy), 1)
                    }
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
                
                // display animation
                // this.collision.draw(context)
                this.collisions.forEach(collision =>{
                    collision.draw(context)
                })
            }

            addEnemies(){
                if(this.gameSpeed > 0 && Math.random() > 0.5){
                    this.enemies.push(new HairEnemy(this))
                }
                else if(this.gameSpeed > 0){
                    this.enemies.push(new DollGhostEnemy(this))
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