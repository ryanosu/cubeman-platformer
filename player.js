import { Idle, Running, Jumping, Falling, Attacking, Brusing} from "./playerStates.js"
import { AnimateCollision } from "./animateCollision.js"

// cubeman will go here

export class Player{
    constructor(game){
        this.game = game
        this.width = 1502 // 33,046/22 = 1,502
        this.height = 1005 // 6,030/6 = 1,005
        this.scale = 0.3
        this.widthScaled = this.width * this.scale
        this.heightScaled = this.height * this.scale
        this.x = 0
        this.y = this.game.height - 300 - this.game.groundMargin
        this.image = document.getElementById('player')
        this.spriteFrameX = 0
        this.spriteFrameY = 0
        this.maxSpriteFrameX = 20
        this.playerSpeed = 0
        this.fullSpeed = 10
        this.frameTimer = 0
        this.fps = 30
        this.frameInterval = 1000/this.fps
        this.gravity = 1.4
        this.jump = 0
        this.states = [new Idle(this), new Running(this), new Jumping(this), new Falling(this), new Attacking(this), new Brusing(this)]
        this.currentState = this.states[0] // default as IDLE
        this.currentState.enter() // performs enter() in playerStates.js, which updates this.player sprite params
    }

    update(input, deltaTime){
        
        // update player state
        this.currentState.handleInput(input)

        // horiztonal movement
        this.x += this.playerSpeed
        if (input.includes('ArrowRight')){
            this.playerSpeed = this.fullSpeed
        } else if (input.includes('ArrowLeft')){
            this.playerSpeed = -this.fullSpeed
        } else {
            this.playerSpeed = 0
        }

        // block character at boundaries
        // left boundary
        if (this.x < 0) {
            this.x = 0
        }
        // right boundary
        if (this.x > this.game.width - this.widthScaled){
            this.x = this.game.width - this.widthScaled
        }

        // vertical movement
        this.y += this.jump *2// jump starts at 0 and only increments in JUMPING state
        //this.y += this.jump // does not make the full jump without second one

        if(!this.onGround()){
            this.jump += this.gravity
        } else {
            this.jump = 0
        }

        // sprite animation
        // 1 frame interval complete
        if (this.frameTimer > this.frameInterval){
            this.frameTimer = 0
            
            // after 1 frame is complete, go to the next sprite or loop back to 0-index
            if (this.spriteFrameX < this.maxSpriteFrameX){
                this.spriteFrameX++
                
            } else {
                this.spriteFrameX = 0
            }
        }
        else {
            this.frameTimer += deltaTime
        }
    }

    draw(context){

        if(this.game.debug){
            context.lineWidth = 5; // Make lines thick
            context.strokeRect(this.x, this.y, this.widthScaled, this.heightScaled)
        }

        context.drawImage(
            this.image, // image that we draw
            this.spriteFrameX * this.width, // origin x-coordinate of top-left corner of source rect 
            this.spriteFrameY * this.height, // origin y-coordinate of top-left corner of source rect
            this.width, // origin size in width of image
            this.height, // origin size in height of image
            this.x, // destination x-coordinate on canvas
            this.y, // destination y-coordinate on canvas
            this.widthScaled, // destination rectangle width on canvas
            this.heightScaled // destination rectangle height on canvas
        )
    }

    setState(state, passedSpeed){
        this.currentState = this.states[state] // make the switch
        this.game.gameSpeed = this.game.fullGameSpeed * passedSpeed
        this.currentState.enter() // perform the action
    }

    onGround(){
        return this.y >= this.game.height - this.heightScaled - 30 - this.game.groundMargin
    }

    onPlatform(){
        // platform.y = this.game.height - this.game.groundMargin - 600
        // MUST ADD X COORDINATE?
        return this.y + this.heightScaled >= this.game.height - this.game.groundMargin - 600
    }

    checkCollisionEnemy(){
        // ENEMY COLLISION
        this.game.enemies.forEach(enemy => {

            // if Attacked enemy
            if(this.currentState instanceof Attacking && 
                enemy.x < this.x + 40 + this.widthScaled &&
                enemy.x + enemy.widthScaled > this.x &&
                enemy.y < this.y + this.heightScaled &&
                enemy.y + enemy.heightScaled > this.y){
                // collision detected
                this.game.score++
                this.game.collisions.push(new AnimateCollision(this.game, enemy.x, enemy.y))
                 // mark for deletion to be deleted soon after checking for markedForDeletion in main.js
                 enemy.markedForDeletion = true
            }
            
            // if non-attacking collision
            else if(enemy.x < this.x - 120 + this.widthScaled && // horizontal right
            enemy.x + enemy.widthScaled > this.x + 120 && // horizontal left
            enemy.y < this.y + this.heightScaled - 120 && // vertical up
            enemy.y + enemy.heightScaled > this.y){ // vertical down
                // accidental collision detected
                this.setState(5, 0) // BRUISING
                this.game.lives--
                this.game.collisions.push(new AnimateCollision(this.game, enemy.x, enemy.y))
                // mark for deletion to be deleted soon after checking for markedForDeletion in main.js
                enemy.markedForDeletion = true
            }
            else{
                // no collision detected
            }
        })
    }

    checkCollisionPlatform(){
        // PLATFORM COLLISION
        this.game.platforms.forEach(platform =>{

            if(this.x < platform.x + platform.platformWidthScaled && // this.x + 120
                this.x + this.widthScaled > platform.x && // this.x - 120
                this.y < platform.y + platform.platformHeightScaled && // platform.platformHeightScaled - 60
                this.y + this.heightScaled > platform.y){ // platform.y + 120
                    //console.log("PLATFORM HIT!")

                    // check if player is coming from above to land on top
                    if(this.y <= platform.y){
                        console.log("landing on top")
                        this.y = platform.y - this.heightScaled;
                        this.jump = 0
                    }

                    // player is doing anything other than coming from above
                    else{
                        console.log("Triggered NOT landing on top")
                        this.y = this.game.height - this.heightScaled - 30 - this.game.groundMargin
                        this.jump = 0
                        this.setState(3, 1) // FALLING
                    }
            }

            else{
                // no collision detected
                //console.log("no collision")
            }
        })
    }

    checkCollision(){

        this.checkCollisionEnemy()
        this.checkCollisionPlatform()
        
    }
}