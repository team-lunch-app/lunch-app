const food = (sketch) => {
  let bowl

  sketch.preload = () => {
    bowl = sketch.loadModel('static/assets/noodlebowl.obj')
  }

  sketch.setup = () => {
    sketch.createCanvas(400, 400, sketch.WEBGL)
    sketch.angleMode(sketch.DEGREES)
  }

  sketch.draw = () => {
    sketch.smooth()
    sketch.noStroke()
    sketch.background(0)
    let dirX = (sketch.mouseX / 400 - 0.5) * 2
    let dirY = (sketch.mouseY / 400 - 0.5) * 2
    sketch.directionalLight(250, 250, 250, -dirX, -dirY, -1)
    sketch.scale(100)
    sketch.translate(0, 1, 0)
    sketch.rotateX(170)
    sketch.rotateZ(0)
    sketch.rotateY(sketch.frameCount / 2)
    sketch.textureMode(sketch.NORMAL)
    //sketch.ambientLight(50)
    sketch.model(bowl)
  }
}

export default food