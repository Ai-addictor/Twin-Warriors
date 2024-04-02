const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

//set canvas size 1024*576
canvas.width = 1024
canvas.height = 576


//set canvas background 
c.fillRect(0,0,canvas.width,canvas.height)

//generate bakground
const back = new Sprite({
    position:{
        x:0,
        y:0
    },
    imageSrc:'./img/background.png'
})

//generate shop image in background
const shop = new Sprite({
    position:{
        x:630,
        y:128
    },
    imageSrc:'./img/shop.png',
    scale:2.75,
    maxFrames:6
    
   
})

//Movement Constants
const gravity = 0.4  

//const to track lastkey pressed
const keys = {
    a:{pressed:false},
    d:{pressed:false},
    w:{pressed:false},
    ArrowRight:{pressed:false},
    ArrowLeft:{pressed:false}
}


//player 1
const player = new Fighter({
    position: { 
    x: 0,
    y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },  
    color:'blue',
    // offset:{
    //     x:0,
    //     y:0
    // },
    imageSrc:'./img/player/Idle.png',
    scale:2,
    maxFrames:8,
    offset:{
        x:150,
        y:97
    },
    sprites:{
        idle:{
            imageSrc:'./img/player/idle.png',
            maxFrames:8
        },
        run:{
            imageSrc:'./img/player/Run.png',
            maxFrames:8

        },
        jump:{
            imageSrc:'./img/player/jump.png',
            maxFrames:2

        },
        fall:{
            imageSrc:'./img/player/Fall.png',
            maxFrames:2
        },
        attack:{
            imageSrc:'./img/player/Attack1.png',
            maxFrames:6
        },
        death:{
            imageSrc:'./img/player/Death.png',
            maxFrames:6
        }
    },
    attackBox:{
        offset:{
            x:0,
            y:0
        },
        width:100,
        height:50
    }
})

//player 2
const enemy = new Fighter({
    position: { 
    x: 400,
    y: 0
    },
    velocity: {
        x: 0,
        y: 0
    } ,
    color:'red',
    offset:{
        x:50,
        y:0
    },
    imageSrc:'./img/enemy/idle.png',
    scale:2,
    maxFrames:4,
    offset:{
        x:150,
        y:105
    },
    sprites:{
        idle:{
            imageSrc:'./img/enemy/idle.png',
            maxFrames:4
        },
        run:{
            imageSrc:'./img/enemy/Run.png',
            maxFrames:8

        },
        jump:{
            imageSrc:'./img/enemy/jump.png',
            maxFrames:2

        },
        fall:{
            imageSrc:'./img/enemy/Fall.png',
            maxFrames:2
        },
        attack:{
            imageSrc:'./img/enemy/Attack1.png',
            maxFrames:4
        },
        death:{
            imageSrc:'./img/enemy/Death.png',
            maxFrames:7
        }
    }, 
    attackBox:{
        offset:{
            x:0,
            y:0
        },
        width:100,
        height:50
    } 
})


decreaseTimer()

//recursive animate function call to generate frames
function animate(){
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0,0,canvas.width,canvas.height)
    back.update()
    shop.update()
    player.update() //update call to start animation 
    enemy.update()

    player.velocity.x = 0 //set motion values to zero to stop movement when keyup 
    enemy.velocity.x = 0

    //player movement
    
    if(keys.a.pressed && player.lastkey === 'a'){
        player.velocity.x = -5
        player.swtichSprite('run')
    }
    else if(keys.d.pressed && player.lastkey === 'd'){
        player.velocity.x = 5
        player.swtichSprite('run')
    }
    else{
        player.swtichSprite('idle')
    }

    // playerjump
    if(player.velocity.y<0){
        player.swtichSprite('jump')

    }
    else if(player.velocity.y>0){
        player.swtichSprite('fall')
    }

    //enemy movement
    if(keys.ArrowLeft.pressed && enemy.lastkey === 'ArrowLeft'){
        enemy.velocity.x = -5
        enemy.swtichSprite('run')
    }
    else if(keys.ArrowRight.pressed && enemy.lastkey === 'ArrowRight'){
        enemy.velocity.x = 5
        enemy.swtichSprite('run')

    }
    else{
        enemy.swtichSprite('idle')
    }
    //enemy jump
    if(enemy.velocity.y<0){
        enemy.swtichSprite('jump')

    }
    else if(enemy.velocity.y>0){
        enemy.swtichSprite('fall')
    }

    if(colliding({rectangle1: player,rectangle2: enemy}) && player.isAttacking)
        { 
            player.isAttacking = false
            if(enemy.health<=0){
                enemy.swtichSprite('death')
            }
            else{
                enemy.health -= 20
            }
            document.querySelector('#enemyhealth').style.width = enemy.health + "%"
        
    }
    if(colliding({rectangle1: enemy,rectangle2: player}) && enemy.isAttacking)
        { 
            enemy.isAttacking = false
            if(player.health<=0){
                player.swtichSprite('death')
            }
            else{
                player.health -= 20
            }
            document.querySelector('#playerhealth').style.width = player.health + "%"
        
        }
    if(enemy.health<=0 || player.health<=0){
        determineWinner({player,enemy,timerid})
    }

    
}



animate() //animate function call to begin recursive call

//moving players using evnent listeners when key is pressed
window.addEventListener('keydown', (event)=>{
   if(!player.isDead){ 
    switch(event.key){
        //player movement
        case 'd':
            keys.d.pressed = true //move right
            player.lastkey = 'd'
            break
        case 'a':
            keys.a.pressed = true //move left
            player.lastkey = 'a'
            break
        case 'w': 
            player.velocity.y = -13 //jump
            break
        case ' ':
            player.attack()
            break
    }
} 
        //enemy movement
    if(!enemy.isDead){
        switch(event.key){    
            case 'ArrowRight':
                keys.ArrowRight.pressed = true //move right
                enemy.lastkey = 'ArrowRight'
                break
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true //move left
                enemy.lastkey = 'ArrowLeft'
                break
            case 'ArrowUp':
                enemy.velocity.y = -13 //jump
                break
            case 'ArrowDown':
                enemy.attack()
                break
    
        }
    }    
    
})

//event listener to stop player when key is released
window.addEventListener('keyup', (event)=>{
    //player movement
    switch(event.key){
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 'w':
            keys.w.pressed = false
            lastkey = 'w'
            break
    }
    //enemy movement
    switch(event.key){
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
        case 'ArrowUp':
            keys.ArrowUp.pressed = false
            enemy.lastkey = 'ArrowUp'
            break
    }
})
