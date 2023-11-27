// while the player is in a certain state, it will only react to certain inputs

// legend for readability
const states = {
    IDLE: 0,
    RUNNING: 1,
    JUMPING: 2,
    FALLING: 3
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
            console.log("Running Set in Idle triggered")
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
    }
}