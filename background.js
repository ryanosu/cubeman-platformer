// 5 parallax background layers

class Layer{
    constructor(game, width, height, backgroundSpeed, image){
        this.game = game
        this.width = width
        this.height = height
        this.backgroundSpeed = backgroundSpeed
        this.image = image
        this.x = 0
        this.y = 0
    }

    update(){
        // background layer is off the screen
        if (this.x = -this.width){
            this.x = 0
        }
        // move the position of that background layer
        else{
            this.x = this.game.speed * this.backgroundSpeed
        }
    }

    draw(context){
        // make images repeating
        context.drawImage(this.image, this.x, this.y, this.width, this.height)
        context.drawImage(this.image, this.x + this.width, this.y, this.width, this.height)
        context.drawImage(this.image, this.x + this.width + this.width, this.y, this.width, this.height) // needed?
    }
}

export class Background{
    constructor(game){
        this.game = game
        this.width = 1920 // original is 1920 width
        this.height = 1500 // original is 1080 height
        this.layer1image = document.getElementById('layer1')
        this.layer2image = document.getElementById('layer2')
        this.layer3image = document.getElementById('layer3')
        this.layer4image = document.getElementById('layer4')
        this.layer5image = document.getElementById('layer5')
        this.layer1 = new Layer(this.game, this.width, this.height, 0, this.layer1image)
        this.layer2 = new Layer(this.game, this.width, this.height, 0.2, this.layer2image)
        this.layer3 = new Layer(this.game, this.width, this.height, 0.4, this.layer3image)
        this.layer4 = new Layer(this.game, this.width, this.height, 0.8, this.layer4image)
        this.layer5 = new Layer(this.game, this.width, this.height, 1, this.layer5image)
        this.backgroundLayers = [this.layer1, this.layer2, this.layer3, this.layer4, this.layer5]
    }
    
    update(){
        this.backgroundLayers.forEach(layer =>{
            layer.update()
        })
    }
    
    draw(context){
        this.backgroundLayers.forEach(layer =>{
            layer.draw(context)
        })
    }
}