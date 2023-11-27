// 5 parallax background layers

export class Background{
    constructor(game){
        this.game = game
        this.width = 0
        this.height = 0
        this.x = 0
        this.y = 0
    }
    
    update(){
    }
    
    draw(context){
        context.fillStyle = "green";
        context.fillRect(0, 0, this.game.width, this.game.height);
    }
}