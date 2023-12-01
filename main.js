import { Background } from "./background.js"
import { Player } from "./player.js"
import { InputHandler } from "./input.js"
import { Data } from "./data.js"
import { HairEnemy, DollGhostEnemy } from "./enemies.js"
import { AnimateCollision } from "./animateCollision.js"
import { MetalPlatform1 } from "./platforms.js"

window.addEventListener('load', function(){
        const canvas = this.document.getElementById('canvas1')
        const ctx = canvas.getContext('2d')
        canvas.width = 2250 // overall game width
        canvas.height = 1500 // overall game height

        let vol = document.getElementById('backgroundMusic')
        vol.volume = 0.1

        class Game{
            constructor(width, height){
                this.width = width
                this.height = height
                this.gameSpeed = 0
                this.fullGameSpeed = 3
                this.groundMargin = 50
                this.score = 0
                this.time = 0
                this.maxGameTime = 60000 // ms - 30 seconds
                this.lives = 3
                this.enemies = []
                this.collisions = []
                this.platforms = []
                this.enemyTimer = 0
                this.enemyInterval = 3000 // ms - 3 seconds
                this.platformTimer = 0
                this.platformInterval = 4000
                this.debug = false
                this.gameOver = false
                this.soundEffectTeleport = new Audio('assets/teleportEnemy.mp3')
                this.soundEffectTeleport.volume = 0.3
                this.soundEffectTeleport.playbackRate = 2.5
                this.background = new Background(this)
                this.player = new Player(this)
                this.input = new InputHandler(this)
                this.data = new Data(this)
            }
            
            update(deltaTime){
                // TIME TRACKER
                this.time += deltaTime
                
                // CHECK FOR GAME END
                if (this.lives == 0 || this.time > this.maxGameTime){
                    this.gameOver = true
                }

                // SCROLL PARALLAX BACKGROUND
                this.background.update()

                // ADD PLATFORMS TO QUEUE
                if (this.platformTimer > this.platformInterval){
                    this.addPlatforms()
                    this.platformTimer = 0
                }
                else {
                    this.platformTimer += deltaTime
                }
                
                // ADD ENEMIES TO QUEUE
                if (this.enemyTimer > this.enemyInterval){
                    this.addEnemies()
                    this.enemyTimer = 0
                }
                else {
                    this.enemyTimer += deltaTime
                }

                // REGISTER PLAYER INPUT AND MISC
                this.player.update(this.input.keys, deltaTime)

                // ENEMY COLLISIONS - UPDATE AND DELETE
                this.collisions.forEach((collision, index)=>{
                    collision.update(deltaTime)
                    if (collision.markedForDeletion) this.collisions.splice(index, 1)
                })

                // ENEMIES - UPDATE AND DELETE
                this.enemies.forEach(enemy =>{
                    if (enemy.markedForDeletion){
                        this.soundEffectTeleport.play()
                        this.enemies.splice(this.enemies.indexOf(enemy), 1)
                    }
                    enemy.update(deltaTime)
                })

                // PLATFORMS - UPDATE AND DELETE
                this.platforms.forEach(platform =>{
                    if (platform.markedForDeletion){
                        this.platforms.splice(this.platforms.indexOf(platform), 1)
                    }
                    platform.update(deltaTime)
                })

            }

            draw(context){
                this.background.draw(context)
                
                // DRAW PLATFORMS
                this.platforms.forEach(platform =>{
                    platform.draw(context)
                })

                // DRAW PLAYER
                this.player.draw(context)

                // DRAW ON-SCREEN DATA
                this.data.draw(context)

                // DRAW ENEMIES
                this.enemies.forEach(enemy =>{
                    enemy.draw(context)
                })
                
                // ENEMY COLLISION SPRITES
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

            addPlatforms(){
                if(this.gameSpeed > 0 && Math.random() > 0.5){
                    this.platforms.push(new MetalPlatform1(this))
                }
            }
        }

        // CREATE GAME INSTANCE
        const game = new Game(canvas.width, canvas.height)
        let prevTime = 0

        // ANIMATION LOOP
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