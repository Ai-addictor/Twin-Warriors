
//class that creates player1 and player2 sprite 
class Sprite{
    constructor({
        position, 
        imageSrc,
        scale = 1,
        maxFrames=1,
        currentFrame=0,
        framesElapsed=0,
        framesHold=10,
        offset = {x:0,y:0}
        }){
        this.position = position
        this.width = 50 
        this.height = 150 
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.maxFrames = maxFrames 
        this.currentFrame = currentFrame
        this.framesElapsed = framesElapsed
        this.framesHold = framesHold 
        this.offset = offset
       
    }

    //draw function to draw player body
    draw(){
        c.drawImage(
            this.image,
            this.currentFrame * (this.image.width/this.maxFrames),  //x-cordinate of crop window                                    //x-coordinate of crop window
            0,                                      //y-coordinate of crop window
            this.image.width/this.maxFrames,        //width of crop winow
            this.image.height,                      //height of crop window
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            (this.image.width/this.maxFrames)*this.scale,
            this.image.height*this.scale)
    }

    //update function to to move players on every frame
    update(){
        this.draw()
        this.animateFrames()  
    } 

    animateFrames(){
        this.framesElapsed++;
        if (this.framesElapsed % this.framesHold === 0) {
            if (this.currentFrame < this.maxFrames - 1) {
                this.currentFrame++;
            } else {
                this.currentFrame = 0;
            }
        }
    }
}

//fighter class is responsible for player generation
class Fighter extends Sprite{
    constructor({
        position, 
        velocity, 
        color,  
        imageSrc, 
        scale = 1, 
        maxFrames=1,
        offset = {x:0,y:0},
        sprites,
        
    }){ 
        super({
            position,
            imageSrc,
            scale,
            maxFrames,
            offset
        })
        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.health = 100
        this.lastkey
        this.sprites = sprites
        this.attackBox = {
            position: {
                x:this.position.x, //initial position
                y:this.position.y
            },
            width: 300,
            height: 50,
            offset
        }
        this.color = color,
        this.isAttacking =  false
        this.isDead = false

        for(const sprite in this.sprites){
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc 

        }
        console.log(this.sprites)

        
    }

    //draw function to draw player body
    

    //update function to to move players on every frame
    update(){
        this.draw()
        if(!this.isDead){        
            this.animateFrames()
        }
        this.attackBox.position.x = this.position.x-this.attackBox.offset.x //to make attackbox position relative to parent
        this.attackBox.position.y = this.position.y
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        if(this.position.y + this.height + this.velocity.y>=canvas.height-96){
            this.velocity.y = 0
        }
        else{
            this.velocity.y += gravity
        }
    }

    //This method will activate attack box
    attack(){
        this.isAttacking = true
        this.swtichSprite('attack')
        setTimeout(()=>{
            this.isAttacking = false
        },100)
    }
    swtichSprite(sprite){
        if(this.image === this.sprites.death.image){
            if(this.currentFrame===this.sprites.death.maxFrames-1){
                this.isDead = true
            }
            return
        }

        if(this.image === this.sprites.attack.image && this.currentFrame<this.sprites.attack.maxFrames-1){
            return
        }
        switch(sprite){
            case 'idle':
                if(this.image !== this.sprites.idle.image){
                    this.image = this.sprites.idle.image
                    this.maxFrames = this.sprites.idle.maxFrames
                    this.currentFrame = 0
                }
                break
            case 'run':
                if(this.image!==this.sprites.run.image){
                this.image = this.sprites.run.image
                this.maxFrames = this.sprites.run.maxFrames
                this.currentFrame = 0

                }
                break
            case 'jump':
                if(this.image!==this.sprites.jump.image){
                this.image = this.sprites.jump.image
                this.maxFrames = this.sprites.jump.maxFrames}
                this.currentFrame = 0
                break
            case 'fall':
                if(this.image!==this.sprites.fall.image){
                this.image = this.sprites.fall.image
                this.maxFrames = this.sprites.fall.maxFrames}
                this.currentFrame = 0
                break
            case 'attack':
            if(this.image!==this.sprites.attack.image){
                this.image = this.sprites.attack.image
                this.maxFrames = this.sprites.attack.maxFrames}
                this.currentFrame = 0
                break
            case 'death':
                if(this.image!==this.sprites.death.image){
                this.image = this.sprites.death.image
                this.maxFrames = this.sprites.death.maxFrames}
                this.currentFrame = 0
                break
        }
    }
}

