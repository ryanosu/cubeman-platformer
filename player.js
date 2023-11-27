import { Idle, Running} from "./playerStates.js"

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
        this.y = this.height
        this.image = document.getElementById('player')
        this.spriteFrameX = 0
        this.spriteFrameY = 0
        this.maxSpriteFrameX = 20
        this.playerSpeed = 0
        this.fullSpeed = 10
        this.frameTimer = 0
        this.fps = 30
        this.frameInterval = 1000/this.fps
        this.states = [new Idle(this), new Running(this)]
        this.currentState = this.states[0]
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

    setState(state, speed){
        this.currentState = this.states[state] // make the switch
        this.game.speed = this.game.maxSpeed * speed
        this.currentState.enter() // perform the action
    }
}