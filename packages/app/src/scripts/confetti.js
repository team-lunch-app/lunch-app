import p5 from 'p5'

/**
 * A p5.js 'sketch' that renders the confetti pop animation.
 * Further information about p5: https://p5js.org
 * @param {*} sketch
 */

const confetti = (sketch) => {

  let width = sketch.windowWidth * 0.9
  let height = sketch.windowHeight * 0.9
  let particles
  let opacity
  let gravity

  let particleTypes = ['RECTANGLE', 'CIRCLE', 'TRIANGLE', 'LINE']

  /**
   * Init an array of confetti particles with:
   * - The shape of the particle
   * - A position (as a vector)
   * - A target position / direction (as a vector)
   * - A random color @see randomColor
   * - Angle
   * - Quasi-random rotation speed
   */

  const initParticles = () => {
    clearParticles()
    for (let i = 0; i < 250; i++) {
      particles.push({
        type: particleTypes[Math.floor(Math.random() * (particleTypes.length))],
        pos: sketch.createVector(0, 0),
        dir: sketch.createVector(Math.random() * width - width / 2, Math.random() * height - height / 2),
        col: randomColor(),
        angle: 0,
        rspeed: (Math.random() - 0.5) * 20
      })
    }
  }

  const clearParticles = () => {
    particles = []
  }

  const randomColor = () => {
    const r = Math.random() * 200 + 30
    const g = Math.random() * 200 + 30
    const b = Math.random() * 200 + 30

    return ({
      r: r,
      g: g,
      b: b
    })
  }

  /**
   * p5.js SETUP
   * Is ran once when the sketch / canvas is initialized
   */

  sketch.setup = () => {
    sketch.createCanvas(width, height, sketch.WEBGL)
    sketch.angleMode(sketch.DEGREES)
    sketch.rectMode(sketch.CENTER)
    sketch.smooth()
    opacity = 255
    gravity = new p5.Vector(0, -4)
    initParticles()
  }

  /**
   * p5.js DRAW
   * Everything related to drawing should be placed inside this one
   */

  sketch.draw = () => {
    sketch.background(0, 0, 0, 0)
    sketch.noStroke()

    /* Draw each particle. After 2 seconds, kill the canvas / sketch. */

    if (sketch.millis() < 3000) {
      for (let i in particles) {
        drawParticle(particles[i])
      }
    } else {
      sketch.remove()
    }

    /* Increase particle transparency after 2 seconds */

    if (sketch.millis() > 2000) {
      opacity -= 4
    }
  }

  /**
   * Draws a singular confetti particle
   * @param {*} p - The particle to be drawn
   */

  const drawParticle = (p) => {
    sketch.push()

    /* Draw the given particle */

    sketch.fill(p.col.r, p.col.g, p.col.b, opacity)
    sketch.translate(p.pos.x, p.pos.y, 0)
    sketch.rotate(p.angle += p.rspeed)

    switch(p.type) {
      case 'RECTANGLE': 
        sketch.rect(0, 0, 15, 7)
        break
      case 'CIRCLE': 
        sketch.ellipse(0, 0, 20, 20, 6)
        break
      case 'TRIANGLE': 
        sketch.triangle(0, -5, 5, 5, -5, 5)
        break
      case 'LINE': 
        sketch.rect(0, 0, 1, 10)
        break
      default:
        break
    }

    /* Calculate the next position for the particle */

    p.pos.sub(p5.Vector.sub(p.pos, p.dir).mult(0.1))

    p.dir.sub(gravity)

    sketch.pop()
  }
}

export default confetti
