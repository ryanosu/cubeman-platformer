export class AnimateCollision{
    constructor(game){
        this.game = game
        this.collisionImage = document.getElementById('collision_animation')
    }

    // we already know when there is a collision, this class is to
    // display the animation when it is triggered
    draw(context){
        context.drawImage(this.collisionImage, this.game.player.x+20, this.game.player.y+20)
    }
}