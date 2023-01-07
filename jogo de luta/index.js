
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
    position:{
        x : 0,
        y : 0 
    },
    imageSrc: './img/background.png',
    scale: 1,
    framesMax: 1
})

const shop = new Sprite({
    position:{
        x : 500,
        y : 172 
    },
    imageSrc: './img/shop.png',
    scale: 2.6,
    framesMax: 6
})

const player = new Fighter ({
    position: {
    x:-100,
    y: 0
    },
    velocity: {
        x:0,
        y:3
    },
    offset: {
        x: 0  ,
        y: 0
    },
    imageSrc: './img/player1/Idle.png',
    framesMax: 8,
    scale: 2,
    offset: {
        x: 0,
        y: 95
    },
    sprites: {
        idle: {
            imageSrc: './img/player1/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './img/player1/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/player1/Jump.png',
            framesMax: 2
        },
        fall:{
            imageSrc: './img/player1/Fall.png',
            framesMax: 2
        },
        attack:{
            imageSrc: './img/player1/Attack.png',
            framesMax: 6
        },
        takeHit:{
            imageSrc: './img/player1/takehit.png',
            framesMax: 4
        },
        death:{
            imageSrc: './img/player1/Death.png',
            framesMax: 6
        }
    },
    attackBox:{
        offset:{
            x:275,
            y:70
        },
        width:120,
        height:50
    }
})

const enemy = new Fighter({
    position: {
        x:500,
        y: 0
    },
     velocity: {
            x:0,
            y:3
     }, 
     offset: {
        x: 0,
        y: 0
    },
    imageSrc: './img/player2/Idle.png',
    framesMax: 4,
    scale: 1.9,
    offset: {
        x: 200,
        y: 95
    },
    sprites: {
        idle: {
            imageSrc: './img/player2/Idle.png',
            framesMax: 4,
        },
        run: {
            imageSrc: './img/player2/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/player2/Jump.png',
            framesMax: 2
        },
        fall:{
            imageSrc: './img/player2/Fall.png',
            framesMax: 2
        },
        attack:{
            imageSrc: './img/player2/Attack.png',
            framesMax: 4
        },
        takeHit:{
            imageSrc: './img/player2/takehit.png',
            framesMax: 3
        },
        death:{
            imageSrc: './img/player2/Death.png',
            framesMax: 7
        }
    },
    attackBox:{
        offset:{
            x:-340,
            y:70
        },
        width: 120,
        height:50
    }
   
})

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    }
}

decreaseTimer()

function animate(){
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0


    //enemy moviments
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    }else {
        enemy.switchSprite('idle')
}
    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    } else if (enemy.velocity.y > 0 ) {
        enemy.switchSprite('fall')
    }

    //player moviments

    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
        player.switchSprite('run')
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }

    if (player.velocity.y < 0) {
        player.switchSprite('jump') 
    } else if(player.velocity.y > 0) {
        player.switchSprite('fall')
    } 

    //detect for collision
    if(
    rectangularColision({
        rectangle1: player,
        rectangle2: enemy
    }) &&
    player.isAttacking && 
    player.framesCurrent === 4
    ) {
        enemy.takeHit()
        player.isAttacking = false
        document.querySelector('#enemyHealth').style.width = enemy.health + '%';
    } 
    if ( 
    player.isAttacking &&
    player.framesCurrent === 4
    ){
    player.isAttacking = false
    }

    if(
    rectangularColision({
        rectangle1: enemy,
        rectangle2: player
    }) &&
     enemy.isAttacking &&
     enemy.framesCurrent === 2
    ) {
        player.takeHit()
        enemy.isAttacking = false
        document.querySelector('#playerHealth').style.width = player.health + '%';
    }if ( 
        enemy.isAttacking &&
        enemy.framesCurrent === 2
    ){
        enemy.isAttacking = false
    }

    //end game 
    if (player.health <= 0 || enemy.health <= 0){
        determineWinner({player, enemy, timerId})
    }
  
}

animate()

window.addEventListener('keydown', (event) =>{
    if(!player.dead && !enemy.dead){
        switch(event.key){
            case 'd': 
            keys.d.pressed = true
            player.lastKey = 'd'
            break
            case 'a': 
            keys.a.pressed = true
            player.lastKey = 'a'
            break
            case 'w': 
            keys.w.pressed = true
            player.velocity.y = -10
            break
            case ' ':
                player.attack()            
            break
            case 'ArrowRight': 
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break
            case 'ArrowLeft': 
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break
            case 'ArrowUp': 
            keys.ArrowUp.pressed = true
            enemy.velocity.y = -10
            break
            case '0':
                enemy.attack()
            break
        }
    }
})

window.addEventListener('keyup', (event) => {
    switch(event.key){
        case 'd': 
        keys.d.pressed = false
        break
        case 'a': 
        keys.a.pressed = false
        break
        case 'w': 
        keys.w.pressed = false
        break
        case 'ArrowRight': 
        keys.ArrowRight.pressed = false
        break
        case 'ArrowLeft': 
        keys.ArrowLeft.pressed = false
        break
        case 'ArrowUp': 
        keys.ArrowUp.pressed = false
        break
    }
 })