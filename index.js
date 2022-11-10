const scoreEl = document.querySelector('#scoreEl')
const scoreGM = document.querySelector('#scoreGM')
const gameover = document.querySelector('#gameover')
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
console.log(window.location)
canvas.width = innerWidth
canvas.height = innerHeight
console.log(canvas.width)
console.log(canvas.height)
gameover.style.display = "none";

class Player {
    constructor() {


        this.velocity = {
            x:0,
            y:0,

        }
         
        this.rotation = 0
        this.opacity = 1

        const image = new Image()
        image.src = './img/spaceship.png'
        image.onload = () => {
            if( canvas.width < 500 || canvas.height < 900){
                this.scale = 0.75

            }else{
                this.scale = 0.5
            }
            console.log("player scale", this.scale)
            
            this.image = image
            this.width = image.width * this.scale
            this.height = image.height * this.scale

            this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height - this.height,
            }
        }

    }

    draw() {
        // c.fillStyle = 'red'
        // c.fillRect(this.position.x, this.position.y, this.width, this.height)
        c.save()
        c.globalAlpha = this.opacity
        c.translate(player.position.x + player.width / 2, player.position.y + player.height / 2)
        c.rotate(this.rotation)
        c.translate(-player.position.x - player.width / 2, -player.position.y - player.height / 2)

        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)

        c.restore()
    }

    update() {
        if (this.image) {
            this.draw()
            this.position.x += this.velocity.x
        }

    }
}

class Projectile {
    constructor({position, velocity}) {
        this.position = position
        this.velocity = velocity

        this.radius = 1

        const image = new Image()
        image.src = './img/rdf.jpg'
        image.onload = () => {

            this.image = image
            this.width = 20
            this.height = 40

            this.position = {
                x: position.x,
                y: position.y,
            }
        }
    }

    draw() {
        c.drawImage(this.image, this.position.x - this.width / 2, this.position.y, this.width, this.height)      

        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = '#3A3184'



        c.fill()
        
        c.closePath()
    }

    update() {
        if (this.image) {
            this.draw()
            this.position.x += this.velocity.x
            this.position.y += this.velocity.y
        }
    }
}


class InvaderProjectile {
    constructor({position, velocity}) {
        this.position = position
        this.velocity = velocity

        this.width = 3
        this.height = 10
    }

    draw() {
        c.fillStyle = 'white'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }


}

class Particle {
    constructor({position, velocity, radius, color}) {
        this.position = position
        this.velocity = velocity

        this.radius = radius
        this.color = color
        this.opacity = 1
    }

    draw() {
        c.save()
        c.globalAlpha = this.opacity
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = this.color
        c.fill()
        c.closePath()
        c.restore()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        this.opacity -= 0.01
    }
}

class Invader {
    constructor({position}) {


        this.velocity = {
            x:0,
            y:0,

        }
         
        const image = new Image()
        image.src = './img/Attack6.png'
        image.onload = () => {
            if( canvas.width < 500 || canvas.height < 900){
                this.scale = 2.5

            }else{
                this.scale = 1.5
            }
            console.log("invader scale", this.scale)
            this.image = image
            this.width = 30
            this.height = 60

            this.position = {
                x: position.x,
                y: position.y,
            }
        }

    }

    draw() {
        // c.fillStyle = 'red'
        // c.fillRect(this.position.x, this.position.y, this.width, this.height)

        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }

    update({velocity}) {
        if (this.image) {
            this.draw()
            this.position.x += velocity.x
            this.position.y += velocity.y
        }

    }

    shoot(invaderProjectiles) {
        invaderProjectiles.push(new InvaderProjectile({
            position: {
                x: this.position.x + this.width / 2,
                y: this.position.y + this.height
            },
            velocity: {
                x: 0,
                y: 5
            }
        }))
    }
}

class Grid {
    constructor() {
        this.position = {
            x: 0,
            y: 0
        }

        this.velocity = {
            x: 3,
            y: 0
        }

        this.invaders = []

        const columns = Math.floor(Math.random() * 10 + 5)
        const rows = Math.floor(Math.random() * 5 + 2)

        this.width = columns * 60

        for ( let x = 0; x < columns; x++) {
            for ( let y = 0; y < rows; y++){
                this.invaders.push(new Invader({position: {
                    x: x * 60 ,
                    y: y * 40
                }
            }
            ))}
        }
        console.log(this.invaders)
    }

    update() {
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        this.velocity.y = 0

        if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
            this.velocity.x = -this.velocity.x
            this.velocity.y = 30
        }
    }
}

const player = new Player()
const projectiles = []
const grids = []
const invaderProjectiles = []
const particles = []
const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    space: {
        pressed: false
    },
}

let frames = 0
let randomInterval = Math.floor(Math.random() * 500 + 500)
let game = {
    over: false,
    active: true,
}
let score = 0

function createParticles({object, color}) {
    for(let i = 0; i < 15; i++){
        particles.push(new Particle({
            position: {
                x: object.position.x + object.width / 2,
                y: object.position.y + object.height / 2
            },
            velocity: {
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2
            },
            radius: Math.random() * 3,
            color: color || 'yellow'
        }))
    }
}

function animate() {
    if (!game.active) return
    requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    particles.forEach((particle, index) => {
        if (particle.opacity <= 0){
            setTimeout(() => {
                particles.splice(index, 1)
            }, 0)
        } else particle.update()
        
    })
    invaderProjectiles.forEach((invaderProjectile, index) => {
        if (invaderProjectile.position.y + invaderProjectile.height >= canvas.height){
            setTimeout(() => {
                invaderProjectiles.splice(index, 1)
            }, 0)
        } else invaderProjectile.update()

        if (invaderProjectile.position.y + invaderProjectile.height >= player.position.y && invaderProjectile.position.x + invaderProjectile.width >= player.position.x && invaderProjectile.position.x <= player.position.x + player.width) {
            setTimeout(() => {
                invaderProjectiles.splice(index, 1)
                player.opacity = 0
                game.over = true
            }, 0)

            setTimeout(() => {

                game.active = false
            }, 2000)
            createParticles({
                object: player,
                color: 'red'  
            })

            gameover.style.display = "block";
            
            
            // var menu = window.location.origin + "/pvtprj/space_invaders/menu.html"
            // console.log("go to menu", menu)
            // window.location.href = menu;
             
            
            console.log("you lose")
        }
        
    })
    projectiles.forEach((projectile, index) => {
        if(projectile.position.y + projectile.radius <= 0){
            setTimeout(() => {
                projectiles.splice(index, 1)
            }, 0)
        }else {
            projectile.update()
        }
    })
    grids.forEach((grid, gridIndex) => {
        grid.update()
        if (frames % 100 === 0 && grid.invaders.length > 0) {
            grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(invaderProjectiles)            
        }
        grid.invaders.forEach((invader, i) => {
            invader.update({velocity: grid.velocity})

            projectiles.forEach((projectile, j) => {
                if (projectile.position.y - projectile.radius <= invader.position.y + invader.height && projectile.position.x + projectile.radius >= invader.position.x && projectile.position.x - projectile.radius <= invader.position.x + invader.width && projectile.position.y + projectile.radius >= invader.position.y){

                    setTimeout(() => {
                        const invaderFound = grid.invaders.find(
                            invader_2 => invader_2 === invader
                        )

                        const projectileFound = projectiles.find(
                            projectile_2 => projectile_2 === projectile
                        )

                        if (invaderFound && projectileFound) {
                            score += 10
                            scoreEl.innerHTML = score
                            scoreGM.innerHTML = score
                            console.log("score",score)
                            createParticles({
                                object: invader,  
                            })
                            grid.invaders.splice(i, 1)
                            projectiles.splice(j, 1)

                            if (grid.invaders.length > 0) {
                                const firstInvader = grid.invaders[0]
                                const lastInvader = grid.invaders[grid.invaders.length - 1]

                                grid.width = lastInvader.position.x - firstInvader.position.x + lastInvader.width
                                grid.position.x = firstInvader.position.x
                            } else {
                                grid.splice(gridIndex, 1)
                            }
                        }
                    },0)   
                }
            })
        })
    })
    if (keys.a.pressed && player.position.x > 0) {
        console.log(player.position.x)
        player.velocity.x = -5
        player.rotation = - 0.15
    } else if (keys.d.pressed && player.position.x + player.width <= canvas.width){
        player.velocity.x = 5
        player.rotation =  0.15

    } else {
        player.velocity.x = 0
        player.rotation =  0

    }

    if (frames % randomInterval === 0) {
        grids.push(new Grid())
        randomInterval = Math.floor(Math.random() * 500 + 500)
        frames = 0
    }

    

    frames++
}

animate()



addEventListener('keydown', ({ key }) => {
    if (game.over) return

    switch (key) {
        case 'a':
            keys.a.pressed = true
            break

        case 'A':
        keys.a.pressed = true
        break

        case 'd':
            keys.d.pressed = true
            break

        case 'D':
            keys.d.pressed = true
            break

        case ' ':
            console.log()

            break
    }
})


addEventListener('keyup', ({ key }) => {
    
    switch (key) {
        case 'a':
            console.log("left")
            player.velocity.x = -5 
            keys.a.pressed = false
            break
        
        case 'A':
            console.log("left")
            player.velocity.x = -5 
            keys.a.pressed = false
            break    

        case 'd':
            console.log("right")
            keys.d.pressed = false
            break

        case 'D':
            console.log("right")
            keys.d.pressed = false
            break

        case ' ':
            console.log("shot")
            projectiles.push(new Projectile({
                position: {
                    x: player.position.x + player.width / 2,
                    y: player.position.y
                },
                velocity: {
                    x: 0,
                    y: -10
                }
            }))
            break
    }
})




canvas.addEventListener("touchstart", e => {
    const point = e.changedTouches[0].clientX
    console.log("point", point)
    if(point <= canvas.width / 2){
        keys.a.pressed = true
    }else{
        keys.d.pressed = true
        
    }
})

canvas.addEventListener("touchend", e => {
    const point = e.changedTouches[0].clientX
    console.log("point", point)
    if(point <= canvas.width / 2){
        keys.a.pressed = false
    }else{
        keys.d.pressed = false
        
    }
})

const shootButton = document.getElementById('shoot-button');
shootButton.addEventListener('touchstart', e => {
    keys.d.pressed = true;
    projectiles.push(new Projectile({
        position: {
            x: player.position.x + player.width / 2,
            y: player.position.y
        },
        velocity: {
            x: 0,
            y: -10
        }
    }))
    keys.d.pressed = false
});

shootButton.addEventListener('mouseup', e => {
    projectiles.push(new Projectile({
        position: {
            x: player.position.x + player.width / 2,
            y: player.position.y
        },
        velocity: {
            x: 0,
            y: -10
        }
    }))
});

