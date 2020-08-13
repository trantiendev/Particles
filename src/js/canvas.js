import p5 from 'p5'

//Define constant
const MAX_SIZE = 15
const MIN_SIZE = 10
let particlesPosition = []
let imagesBubble = []
let sizeSpeed = .01

export default class Particles extends p5 {
  // TODO: refactor variable
  constructor(sketch = ()=>{}, node = document.querySelector('body'), sync = false) {
    super(sketch, node, sync)

    this.disableFriendlyErrors = true
    this.parallaxDelta = 0
    this.toggleRotation = true
    this.particlesLength = 0
    this.setup = this.setup.bind(this)
    this.draw = this.draw.bind(this)
    // this.preload = this.preload.bind(this)
    this.windowResized = this.windowResized.bind(this)
  }

  setup() {
    const canvas = this.createCanvas(window.innerWidth, document.body.offsetHeight)
    canvas.style('z-index', '-1')
    this.pos = []
    this.vel = []
    this.opacities = []
    this.randomSize = []
    // this.blendMode(this.BLEND)

    // Init particles
    while (this.particlesLength <= Math.floor(this.width / 150)) {
      this.addParticle()
    }

    // Start rotation to add & remove particle
    setInterval(() => {
      if (this.particlesLength == MAX_SIZE) this.toggleRotation = false
      if (this.particlesLength == MIN_SIZE) this.toggleRotation = true
      // this.toggleRotation ? this.addParticle() : this.removeParticle()
      if (this.toggleRotation) this.addParticle()
    }, 2000)
  }

  addParticle() {
    this.particlesLength++
    this.pos.push(this.createVector(this.random(this.width), this.random(this.height)))
    this.vel.push(this.createVector(this.random(-1,1), this.random(-1,1)))
    this.opacities.push(0)
    this.randomSize.push(this.random(50, 120))
    this.randomImg = Math.floor(this.random(1, 7))
    particlesPosition.push(this.pos[this.pos.length - 1])
  }

  removeParticle() {
    this.particlesLength--
    this.pos.pop()
    this.vel.pop()
    this.opacities.pop()
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
    this.background('rgba(0, 0, 0, 1)')
    this.render()
    // let fps = this.frameRate()
    // this.fill(255)
    // this.stroke(0)
    // this.text("FPS: " + fps.toFixed(2), 10, this.height - 10)
  }

  prepareGradient() {
		// this.drawingContext.shadowOffsetX = this.random(1)
	  // this.drawingContext.shadowOffsetY = this.random(1)
	  // this.drawingContext.shadowBlur = this.constrain(this.random(50), 20, 30)
	  this.drawingContext.shadowColor = 'rgba(25, 181, 254, .3)'
  }

  render() {
    this.clear()
    // let counter = 0
    this.background('rgba(0, 0, 0, 1)')

    for(let i = 0; i < this.particlesLength; i++) {
      let scaleMin = this.randomSize[i]
      let scaleMax = this.randomSize[i] * 1.5
      // Random scale size circles
      let circleSize = this.map(this.cos(this.frameCount * sizeSpeed), -1, 1, scaleMin, scaleMax)
      // counter++
      // if (counter > imagesBubble.length) counter = 1
      if (this.opacities[i] < 90 && this.toggleRotation) {
        this.opacities[i] += 0.5
        this.fill(this.color(25, 181, 254, this.opacities[i]))
      } else if (!this.toggleRotation && i + 1 == this.particlesLength) {
        this.opacities[i] -= 0.5
        this.fill(this.color(25, 181, 254, this.opacities[i]))
      } else {
        this.fill(this.color(25, 181, 254, 90))
      }
      this.update(this.pos[i], this.vel[i])
      this.connectParticles(this.pos[i], particlesPosition.slice(i + 1), this.opacities[i])
      this.drawingCircles(this.pos[i].x, this.pos[i].y, circleSize)
      if (this.opacities[i] == 0) this.removeParticle()

      // this.imageMode(this.CENTER)
      // this.image(imagesBubble[counter - 1], this.pos[i].x, this.pos[i].y, this.randomSize[i], this.randomSize[i])
    }
  }

  drawingCircles(circleX, circleY, circleSize) {
    this.noStroke()
    this.prepareGradient()

    this.circle(circleX, circleY, circleSize)
    this.circle(circleX + 3, circleY + 3, circleSize)
    this.circle(circleX - 3, circleY - 3, circleSize)
    this.circle(circleX, circleY - 3, circleSize)
    this.circle(circleX - 3, circleY, circleSize)
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

  connectParticles(position, particles, opacity) {
    particles.forEach(particle => {
      const distance = this.dist(position.x, position.y, particle.x,particle.y)

      if (distance < 200) {
        this.stroke(this.color(255, 255, 255, opacity + 100))
        this.line(position.x, position.y, particle.x,particle.y)
      }
    })
  }
}
