import p5 from 'p5'

let canvas
let particlesPosition = []
let imagesBubble = []

export default class Particles extends p5 {

  constructor(sketch = ()=>{}, node = false, sync = false) {
    super(sketch, node, sync)
    // Size
    this.size = 30
    this.setup = this.setup.bind(this)
    this.draw = this.draw.bind(this)
    this.preload = this.preload.bind(this)
    this.windowResized = this.windowResized.bind(this)
  }

  setup() {
    canvas = this.createCanvas(window.innerWidth, document.body.offsetHeight)
    this.particlesLength = Math.floor(this.width / 50)
    this.pos = []
    this.vel = []
    this.randomSize = []

    for (let i = 0; i < this.particlesLength; i++) {
      this.pos[i] = this.createVector(this.random(this.width), this.random(this.height))
      this.vel[i] = this.createVector(this.random(-2,2), this.random(-2,2))
      this.randomSize[i] = this.random(50, 100)
      this.randomImg = Math.floor(this.random(1, 7))
      particlesPosition.push(this.pos[i])
    }
  }

  windowResized() {
    this.resizeCanvas(window.innerWidth, document.body.offsetHeight)
  }

  update(postition, velocity) {
    postition.add(velocity)
    this.edges(postition, velocity)
  }

  draw() {
    this.background('rgba(0, 0, 0, .7)')
    this.render()
  }

  render() {
    let counter = 0

    for (let i = 0; i < this.particlesLength; i++) {
      counter++
      if (counter > imagesBubble.length) counter = 1

      this.update(this.pos[i], this.vel[i])
      this.connectParticles(this.pos[i], particlesPosition.slice(i + 1))
      this.imageMode(this.CENTER)
      this.image(imagesBubble[counter - 1], this.pos[i].x, this.pos[i].y, this.randomSize[i], this.randomSize[i])
    }
  }

  preload() {
    for (let i = 0; i < 7; i++) {
      imagesBubble[i] = this.loadImage(`images/${i + 1}.png`)
    }
  }

  edges(postition, velocity) {
    if(postition.x < 0 || postition.x > this.windowWidth) velocity.x *= -1
    if(postition.y < 0 || postition.y > document.body.offsetHeight) velocity.y *= -1
  }

  connectParticles(position, particles) {
    particles.forEach(particle => {
      const distance = this.dist(position.x, position.y, particle.x,particle.y)

      if (distance < 200) {
        this.stroke(`rgba(255, 255, 255, 0.5)`)
        this.line(position.x, position.y, particle.x,particle.y)
      }
    })
  }
}
