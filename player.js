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
        this.y = this.game.height - this.heightScaled - this.game.groundMargin
        this.image = document.getElementById('player')
        this.spriteFrameX = 0
        this.spriteFrameY = 0
        this.maxSpriteFrameX = 20
        this.playerSpeed = 0
        this.fullSpeed = 10
        this.frameTimer = 0
        this.fps = 30
        this.frameInterval = 1000/this.fps
        this.gravity = 0.9
        this.jump = 0
        this.onPlatformProperty = false
        this.globalFrameCounter = 0
        this.soundEffectAttack = new Audio('assets/attack.wav');
        this.soundEffectAttack.volume = 0.3
        this.soundEffectJump = new Audio('assets/jump.wav')
        this.soundEffectJump.volume = 0.3
        this.soundEffectHurt = new Audio('assets/hurt.wav')
        this.soundEffectHurt.volume = 0.3
        this.states = [new Idle(this), new Running(this), new Jumping(this), new Falling(this), new Attacking(this), new Brusing(this)]
        this.currentState = this.states[0] // default as IDLE
        this.currentState.enter() // performs enter() in playerStates.js, which updates this.player sprite params
    }

    update(input, deltaTime){

        // CHECK FOR COLLISIONS
        this.checkAllCollisions()

        // UPDATE PLAYER STATE
        this.currentState.handleInput(input)

        // HORIZONTAL MOVEMENT
        this.x += this.playerSpeed
        if (input.includes('ArrowRight')){
            this.playerSpeed = this.fullSpeed
        } else if (input.includes('ArrowLeft')){
            this.playerSpeed = -this.fullSpeed
        } else {
            this.playerSpeed = 0
        }

        // HORIZONTAL BOUNDARIES
        // left boundary
        if (this.x < 0) {
            this.x = 0
        }
        // right boundary
        if (this.x > this.game.width - this.widthScaled){
            this.x = this.game.width - this.widthScaled
        }

        // VERTICAL MOVEMENT
        this.y += this.jump *2

        // VERTICAL BOUNDARIES
        // bottom boundary
        if (this.y > this.game.height - this.heightScaled - this.game.groundMargin){
             this.y = this.game.height - this.heightScaled - this.game.groundMargin
        }
        // no top boundary

        // TOGGLE GRAVITY
        // start gravity incrementing
        if(!this.onGround() && this.onPlatformProperty === false){
            this.jump += this.gravity
        }
        // stop gravity from moving player through the ground and platform
        else {
            this.jump = 0
        }

        // SPRITE ANIMATIONS
        // 1 frame interval complete
        if (this.frameTimer > this.frameInterval){
            this.frameTimer = 0
            // after 1 frame is complete, go to the next animation sprite or loop back to 0-index
            if (this.spriteFrameX < this.maxSpriteFrameX){
                this.spriteFrameX++
            } 
            else {
                this.spriteFrameX = 0
            }
        }
        // 1 frame not yet complete
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
        return this.y >= this.game.height - this.heightScaled - this.game.groundMargin
    }

    onPlatform(){
        // 600 comes from Platform Class
        // MUST ADD X COORDINATE?
        return this.y >= this.game.height - this.heightScaled - this.game.groundMargin - 600

        // PLATFORM COLLISION
        // this.game.platforms.forEach(platform =>{
        //     if(this.x < platform.x + platform.platformWidthScaled && // this.x + 120 (TOP-LEFT CORNER OF CUBEMAN MUST HAVE LOWER X-VALUE THAN TOP-RIGHT CORNER OF PLATFORM)
        //     this.x + this.widthScaled > platform.x && // this.x - 120 (TOP-RIGHT CORNER OF CUBEMAN MUST HAVE HIGHER X VALUE THAN TOP-LEFT OF PLATFORM)
        //     this.y < platform.y + platform.platformHeightScaled && // platform.platformHeightScaled - 60 (TOP-LEFT CORNER OF CUBEMAN MUST HAVE LOWER Y-VALUE THAN BOTTOM-LEFT CORNER OF PLATFORM)
        //     this.y + this.heightScaled > platform.y && // platform.y + 120 (BOTTOM-LEFT CORNER OF CUBEMAN MUST HAVE HIGHER Y-VALUE THAN TOP-LEFT CORNER OF PLATFORM)
        //     this.y <= platform.y){ // LANDED ON PLATFORM FROM ABOVE
        //         return true
        //     }
        //     else{
        //         return false
        //     }
        // })
    }

    checkCollisionEnemy(){
        // ENEMY COLLISION
        this.game.enemies.forEach(enemy => {

            // IF ATTACKING ENEMY COLLISION
            if(this.currentState instanceof Attacking && 
                enemy.x < this.x + 40 + this.widthScaled && // we want our right-punching animation to extend slightly futher than hitbox
                enemy.x + enemy.widthScaled > this.x &&
                enemy.y < this.y + this.heightScaled &&
                enemy.y + enemy.heightScaled > this.y &&
                this.spriteFrameX >= 7){ // time push animation with enemy collision animation
                    this.game.score++
                    this.game.collisions.push(new AnimateCollision(this.game, enemy.x, enemy.y))
                    enemy.markedForDeletion = true
            }
            
            // IF NON-ATTACKING COLLISION (BRUISING)
            else if(enemy.x < this.x - 120 + this.widthScaled && // make smaller than full animation frame
                    enemy.x + enemy.widthScaled > this.x + 120 && // make smaller than full animation frame
                    enemy.y < this.y + this.heightScaled - 120 && // make smaller than full animation frame
                    enemy.y + enemy.heightScaled > this.y){
                        this.setState(5, 0) // BRUISING
                        this.game.lives--
                        this.game.collisions.push(new AnimateCollision(this.game, enemy.x, enemy.y))
                        enemy.markedForDeletion = true
            }

            // NO COLLISION DETECTED
            else{
                // continue
            }
        })
    }

    checkCollisionPlatform(){
        // PLATFORM COLLISION
        this.game.platforms.forEach(platform =>{

            // PLATFORM COLLISION FOUND
            if(this.x < platform.x + platform.platformWidthScaled - 120 && // make smaller than full animation frame
                this.x + this.widthScaled > platform.x + 120 && // make smaller than full animation frame
                this.y < platform.y + platform.platformHeightScaled &&
                this.y + this.heightScaled > platform.y){

                    // COLLISION - LANDED ON PLATFORM
                    if(this.y + this.heightScaled - 30 <= platform.y && !this.onPlatformProperty){
                        this.onPlatformProperty = true
                        this.y = platform.y - this.heightScaled; // stay on platform
                        this.jump = 0 // stop rising
                        //this.setState(0,0)
                    }

                    // COLLISION - ANYTHING BUT LANDED ON PLATFORM
                    else{
                        this.onPlatformProperty = false
                        this.y = this.game.height - this.heightScaled - this.game.groundMargin // fall to ground
                        this.jump = 0 // stop rising
                        this.setState(3, 1) // FALLING
                    }
            }
            else{
                // SKIP - NO COLLISION DETECTED
                this.onPlatformProperty = false
            }
        })
    }

    checkAllCollisions(){
        this.checkCollisionEnemy()
        this.checkCollisionPlatform()
    }
}