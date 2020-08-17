import p5 from 'p5'

//Define constant
const MAX_SIZE = 15
const MIN_SIZE = 10
let particlesPosition = []
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
    this.colorsParticle = [
      'rgba(251, 163, 252, opacity)',
      'rgba(255, 167, 194, opacity)',
      'rgba(255, 206, 166, opacity)',
      'rgba(223, 242, 145, opacity)',
      'rgba(156, 242, 215, opacity)',
      'rgba(160, 213, 252, opacity)',
      'rgba(183, 164, 253, opacity)',
      'rgba(237, 237, 237, opacity)'
    ]
  }

  setup() {
    const canvas = this.createCanvas(window.innerWidth, document.body.offsetHeight)
    canvas.style('z-index', '-1')
    this.pos = []
    this.vel = []
    this.opacities = []
    this.randomSize = []

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
	  // this.drawingContext.shadowBlur = 20
	  this.drawingContext.shadowColor = 'rgba(25, 181, 254, 1)'
  }

  render() {
    this.clear()
    this.background('rgba(0, 0, 0, 1)')

    let counter = 0
    let scaleMin = null
    let scaleMax = null

    for(let i = 0; i < this.particlesLength; i++) {
      scaleMin = this.randomSize[i]
      scaleMax = this.randomSize[i] * 1.5

      // Random scale size circles
      let circleSize = this.map(this.cos(this.frameCount * sizeSpeed), -1, 1, scaleMin, scaleMax)

      counter++
      if (counter > this.colorsParticle.length) counter = 1

      this.fadedAnimation(this.opacities, counter, i)
      this.update(this.pos[i], this.vel[i])
      this.connectParticles(this.pos[i], particlesPosition.slice(i + 1), this.opacities[i])
      this.drawingCircles(this.pos[i].x, this.pos[i].y, circleSize)
      if (this.opacities[i] == 0) this.removeParticle()
    }
  }

  fadedAnimation(opacity, counter, index) {
    if (opacity[index] < 0.3 && this.toggleRotation) {
      opacity[index] += 0.002
      this.fill(this.color(this.colorsParticle[counter - 1].replace('opacity', `${opacity[index]}`)))
    } else if (!this.toggleRotation && index + 1 == this.particlesLength) {
      opacity[index] -= 0.002
      if (opacity[index] < 0) opacity[index] = 0
      this.fill(this.color(this.colorsParticle[counter - 1].replace('opacity', `${opacity[index]}`)))
    } else {
      this.fill(this.colorsParticle[counter - 1].replace('opacity', '0.3'))
    }
  }

  drawingCircles(circleX, circleY, circleSize) {
    this.noStroke()
    this.prepareGradient()

    this.circle(circleX, circleY - 6, circleSize * 1.25)
    this.circle(circleX, circleY, circleSize)
    this.circle(circleX + 5, circleY + 4, circleSize)
    this.circle(circleX - 4, circleY - 4, circleSize * 0.7)
    this.circle(circleX - 4, circleY, circleSize * 0.8)
    this.circle(circleX - 4, circleY - 4, circleSize * 0.9)
    this.circle(circleX, circleY - 6, circleSize * 1.1)
  }

  edges(postition, velocity) {
    if(postition.x < 0 || postition.x > this.windowWidth) velocity.x *= -1
    if(postition.y < 0 || postition.y > document.body.offsetHeight) velocity.y *= -1
  }

  connectParticles(position, particles, opacity) {
    particles.forEach(particle => {
      const distance = this.dist(position.x, position.y, particle.x,particle.y)

      if (distance < 280) {
        this.stroke(this.color(255, 255, 255, opacity + 100))
        this.line(position.x, position.y, particle.x,particle.y)
      }
    })
  }
}
