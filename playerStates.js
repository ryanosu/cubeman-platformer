// while the player is in a certain state, it will only react to certain inputs

// legend for readability
const states = {
    IDLE: 0,
    RUNNING: 1,
    JUMPING: 2,
    FALLING: 3,
    ATTACKING: 4,
    BRUSING: 5
}

class State {
    constructor(state){
        this.state = state
    }
}

export class Idle extends State {
    constructor(player){
        super('IDLE')
        this.player = player
    }
    
    enter(){
        this.player.spriteFrameX = 0 // restart animation
        this.player.maxSpriteFrameX = 20
        this.player.spriteFrameY = 0 // IDLE row
    }
    
    handleInput(input){
        if (input.includes('ArrowLeft') || input.includes('ArrowRight')){
            this.player.setState(states.RUNNING, 1)
        }
    }
}

export class Running extends State {
    constructor(player){
        super('RUNNING')
        this.player = player
    }
    
    enter(){
        this.player.spriteFrameX = 0 // restart animation
        this.player.maxSpriteFrameX = 12
        this.player.spriteFrameY = 1 // RUNNING row
    }
    
    handleInput(input){
        if (input.includes('ArrowDown')){
            this.player.setState(states.IDLE, 0)
        }
        else if (input.includes('ArrowUp')){
            this.player.setState(states.JUMPING, 1)
        }
        else if (input.includes('Control')){
            this.player.setState(states.ATTACKING, 0)
        }
        // debug
        else if (input.includes('p')){
            this.player.setState(states.BRUSING, 0)
        }
    }
}

export class Jumping extends State {
    constructor(player){
        super('JUMPING')
        this.player = player
    }
    
    enter(){
        this.player.spriteFrameX = 0 // restart animation
        this.player.maxSpriteFrameX = 10
        if(this.player.onGround()){
            this.player.jump -= 30 // push upwards
        }
        this.player.spriteFrameY = 2 // JUMPING row
    }
    
    handleInput(input){
        if (this.player.jump > this.player.gravity){
            this.player.setState(states.FALLING, 1)
        }
        else if (input.includes('Control')){
            this.player.setState(states.ATTACKING, 0)
        }
    }
}

export class Falling extends State {
    constructor(player){
        super('FALLING')
        this.player = player
    }
    
    enter(){
        this.player.spriteFrameX = 0 // restart animation
        this.player.maxSpriteFrameX = 10
        this.player.spriteFrameY = 3 // FALLING row
    }
    
    handleInput(input){
        if (this.player.onGround()){
            this.player.setState(states.RUNNING, 1)
        }
        else if (input.includes('Control')){
            this.player.setState(states.ATTACKING, 0)
        }
    }
}

export class Attacking extends State{
    constructor(player){
        super('ATTACKING')
        this.player = player
    }

    enter(){
        this.player.spriteFrameX = 0 // restart animation
        this.player.maxSpriteFrameX = 15
        this.player.spriteFrameY = 5 // ATTACKING row
    }

    handleInput(input){
        if (input.includes('ArrowLeft') || input.includes('ArrowRight')){
            this.player.setState(states.RUNNING, 1)
        }
        // restrict to one animation
        if(this.player.spriteFrameX == 15){
            this.player.setState(states.IDLE, 0)
        }
    }
}

export class Brusing extends State{
    constructor(player){
        super('BRUSING')
        this.player = player
    }

    enter(){
        this.player.spriteFrameX = 0 // restart animation
        this.player.maxSpriteFrameX = 10
        this.player.spriteFrameY = 4 // BRUSING row
    }

    handleInput(){
        // restrict to one animation
        if(this.player.spriteFrameX == 10){
            this.player.setState(states.IDLE, 0)
        }
    }
}