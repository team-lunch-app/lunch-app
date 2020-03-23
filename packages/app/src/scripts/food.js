let spinning = false

export const foodScript = (sketch) => {
  let assetPath = 'static/assets'

  let width = 400
  let height = 400

  let bowl
  let bowlRim
  let soup
  let salad
  let noodles
  let chopsticks
  let eggWhite
  let eggYolk
  let tofu

  let materials
  let bgColor
  
  /**
   * p5: Preload all the .obj files to be displayed.
   * A 'Loading...' text will be shown until everything
   * is loaded.
   */
  sketch.preload = () => {
    bowl = sketch.loadModel(`${assetPath}/bowl.obj`)
    bowlRim = sketch.loadModel(`${assetPath}/bowlrim.obj`)
    soup = sketch.loadModel(`${assetPath}/soup.obj`)
    salad = sketch.loadModel(`${assetPath}/salad.obj`)
    noodles = sketch.loadModel(`${assetPath}/noodles-lowpoly.obj`)
    chopsticks = sketch.loadModel(`${assetPath}/chopsticks.obj`)
    eggWhite = sketch.loadModel(`${assetPath}/eggwhite.obj`)
    eggYolk = sketch.loadModel(`${assetPath}/eggyellow.obj`)
    tofu = sketch.loadModel(`${assetPath}/tofu.obj`)
  }

  /**
   * p5: Setup the WebGL canvas that we will be
   * drawing our objects to. Materials will also be
   * initialized here for drawing later on.
   * 
   * This code is only ran when the canvas/applet
   * is first rendered.
   */
  sketch.setup = () => {
    sketch.createCanvas(width, height, sketch.WEBGL)
    sketch.angleMode(sketch.DEGREES)
    bgColor = sketch.color(199, 151, 197)
    
    materials = {
      white: () => sketch.specularMaterial(242, 242, 242),
      blue: () => sketch.ambientMaterial(117, 198, 230),
      soup: () => sketch.ambientMaterial(230, 173, 117),
      salad: () => sketch.ambientMaterial(152, 255, 74),
      noodle: () => sketch.specularMaterial(255, 234, 176),
      wood: () => sketch.ambientMaterial(128, 73, 73),
      eggYolk: () => sketch.ambientMaterial(252, 186, 3)
    }
  }

  /**
   * p5: Draw the actual scene
   */
  sketch.draw = () => {
    sketch.smooth()
    sketch.noStroke()
    sketch.background(bgColor)

    /* Ambient lighting to match the background */

    let ambientStrength = 0.9
    sketch.ambientLight(
      sketch.red(bgColor) * ambientStrength,
      sketch.green(bgColor) * ambientStrength,
      sketch.blue(bgColor) * ambientStrength
    )

    /* Main light source */

    let lightStrength = 0.65
    let lightPos = sketch.createVector(width / 2, -height / 2, -25)
    sketch.pointLight(lightStrength * 255, lightStrength* 255, lightStrength * 255, lightPos)

    /* Set up appropriate location and scaling */

    sketch.scale(100)
    sketch.translate(0, 1, 0)
    sketch.rotateX(170)
    sketch.rotateZ(0)

    spinning
      ? sketch.rotateY(-sketch.frameCount * 2)
      : sketch.rotateY(0)

    /* Draw the different parts of the model*/

    sketch.shininess(20)

    drawModel(bowl, materials.white)
    drawModel(bowlRim, materials.blue)
    drawModel(soup, materials.soup)
    drawModel(salad, materials.salad)
    drawModel(noodles, materials.noodle)
    drawModel(chopsticks, materials.wood)
    drawModel(eggWhite, materials.white)
    drawModel(eggYolk, materials.eggYolk)
    drawModel(tofu, materials.white)
  }

  /**
   * Helper: Sets up an individual drawing state,
   * draws a model with the given material, then
   * clears the drawing state.
   * @param {*} m | The model to be drawn
   * @param {*} material | The material to be applied to the model
   */
  const drawModel = (m, material) => {
    sketch.push()
    material()
    sketch.model(m)
    sketch.pop()
  }
}

export const setSpin = (bool) => {
  spinning = bool
}