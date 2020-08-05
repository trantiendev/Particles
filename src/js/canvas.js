import p5 from 'p5'

//Define constant
const containerElement = document.querySelector('body');
const MAX_SIZE = 40
const MIN_SIZE = 20
let canvas
let particlesPosition = []
let imagesBubble = []

export default class Particles extends p5 {
  // TODO: refactor variable
  constructor(sketch = ()=>{}, node = containerElement, sync = false) {
    super(sketch, node, sync)

    this.parallaxDelta = 0
    this.toggleRotation = true
    this.particlesLength = 0;
    this.setup = this.setup.bind(this)
    this.draw = this.draw.bind(this)
    // this.preload = this.preload.bind(this)
    this.windowResized = this.windowResized.bind(this)
  }

  setup() {
    canvas = this.createCanvas(window.innerWidth, document.body.offsetHeight)
    canvas.style('z-index', '-1')
    this.pos = []
    this.vel = []
    this.randomSize = []
    // this.colorMode(this.HSB, 100)
    this.blendMode(this.ADD)

    // Init particles
    while (this.particlesLength <= Math.floor(this.width / 50)) {
      this.addParticle()
    }

    // Start rotation to add & remove particle
    setInterval(() => {
      if (this.particlesLength == MAX_SIZE) this.toggleRotation = false
      if (this.particlesLength == MIN_SIZE) this.toggleRotation = true
      this.toggleRotation ? this.addParticle() : this.removeParticle()
    }, 1000);
  }

  addParticle() {
    this.particlesLength++
    this.pos.push(this.createVector(this.random(this.width), this.random(this.height)))
    this.vel.push(this.createVector(this.random(-1,1), this.random(-1,1)))
    this.randomSize.push(this.random(30, 100))
    this.randomImg = Math.floor(this.random(1, 7))
    particlesPosition.push(this.pos[this.pos.length - 1])
  }

  removeParticle() {
    this.particlesLength--
    this.pos.pop()
    this.vel.pop()
    this.randomSize.pop()
    particlesPosition.pop()
  }

  windowResized() {
    this.resizeCanvas(window.innerWidth, document.body.offsetHeight)
  }

  update(postition, velocity) {
    postition.add(velocity)
    this.edges(postition, velocity)
  }

  draw() {
    this.clear()
    this.background('rgba(0, 0, 0, 0.9)')
    this.render()
  }

  render() {
    let counter = 0
    this.noStroke()
    this.fill('rgba(255, 255, 255, .1)')

    for(let i = 0; i < this.particlesLength; i++) {
      counter++
      if (counter > imagesBubble.length) counter = 1

      this.update(this.pos[i], this.vel[i])
      this.connectParticles(this.pos[i], particlesPosition.slice(i + 1))
      this.circle(this.pos[i].x, this.pos[i].y, this.randomSize[i], this.randomSize[i])
      this.circle(this.pos[i].x + 3, this.pos[i].y + 3, this.randomSize[i]/1.1, this.randomSize[i])
      this.circle(this.pos[i].x - 3, this.pos[i].y - 3, this.randomSize[i], this.randomSize[i])
      this.circle(this.pos[i].x, this.pos[i].y - 3, this.randomSize[i], this.randomSize[i])
      this.circle(this.pos[i].x - 3, this.pos[i].y, this.randomSize[i], this.randomSize[i])

      // this.imageMode(this.CENTER)
      // this.image(imagesBubble[counter - 1], this.pos[i].x, this.pos[i].y, this.randomSize[i], this.randomSize[i])
    }
    // this.blendMode(this.NORMAL)

  }

  // preload() {
  //   for (let i = 0; i < 7; i++) {
  //     imagesBubble[i] = this.loadImage(`images/${i + 1}.png`)
  //   }
  // }

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
