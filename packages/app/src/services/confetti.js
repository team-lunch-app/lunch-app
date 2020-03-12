const confetti = (sketch) => {
  const width = 400
  const height = 400

  let particles
  let time = 0

  const clearParticles = () => {
    particles = []
  }

  const initParticles = () => {
    clearParticles()
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: 0,
        y: 0,
        col: randomColor(),
        hspeed: (Math.random() - 0.5) * 12 + (Math.random() - 0.5) * 7,
        vspeed: (Math.random() - 0.75) * 12 + Math.random() * 5,
        angle: 0,
        rspeed: (Math.random() - 0.5) * 20
      })
    }
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

  sketch.setup = () => {
    sketch.createCanvas(width, height, sketch.WEBGL);
    sketch.angleMode(sketch.DEGREES)
    sketch.rectMode(sketch.CENTER)
    initParticles()
  }

  sketch.draw = () => {
    sketch.background(0)
    sketch.noStroke()
    if (time < 200) {
      for (let i in particles) {
        drawParticle(particles[i])
      }
      time++
    } else {
      clearParticles()
    }
  }

  const drawParticle = (p) => {
    sketch.push()
    sketch.fill(p.col.r, p.col.g, p.col.b, p.col[3])
    sketch.translate(p.x, p.y)
    sketch.rotate(p.angle += p.rspeed)
    sketch.rect(0, 0, 10, 5)
    p.x = p.x + p.hspeed
    p.y = p.y + p.vspeed
    sketch.pop()
  }

  sketch.mouseClicked = () => {
    time = 0
    initParticles()
  }
}

export default confetti