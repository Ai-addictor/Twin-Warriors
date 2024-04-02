function colliding({rectangle1,rectangle2}){
    return(rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x && //check if rectangle1 is colliding
    rectangle1.attackBox.position.x <= rectangle2.position.x+rectangle2.width && //stop when rectangle1 goes ahead of rectangle2
    rectangle1.attackBox.position.y+rectangle1.attackBox.height >= rectangle2.position.y && //rectangle1 attackbox should be level with rectangle2
    rectangle1.attackBox.position.y <= rectangle2.position.y+rectangle2.height //rectangle1 attack box is between rectangle2 height
    )
}

// function to determine winner
function determineWinner({player,enemy,timerid}){
    clearTimeout(timerid)
    document.querySelector('#displaywinner').style.display = 'flex'
    if(player.health === enemy.health){ 
        document.querySelector('#displaywinner').innerHTML = "Tie"
    }
    else if(player.health > enemy.health){
        document.querySelector('#displaywinner').innerHTML = "Player 1 won"
    }
    else if(player.health < enemy.health){
        document.querySelector('#displaywinner').innerHTML = "Player 2 won"
    }
}

let timer = 5
let timerid
function decreaseTimer(){
    timerid = setTimeout(decreaseTimer,1000)
    if(timer>0){
        timer--
        document.querySelector('#timer').innerHTML = timer
    }
    if(timer===0){

        player.isDead = true
        enemy.isDead = true
        determineWinner({player,enemy,timerid})
    }
}