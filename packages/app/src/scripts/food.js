let assetPath = 'static/assets'
let spinning = false
let spinningTime = 0
let rotation = 0

export const foodScript = (sketch) => {

  let width = 400
  let height = 400

  let models = new Map()

  let materials
  let bgColor

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

    /**
     * Load the different parts of the noodle bowl to
     * be rendered. 
     * 
     * Q: Why are the parts separate files and not in
     * a singular file? 
     * 
     * A: Normally, the surface material information of a 
     * .obj file is included in a separate .mtl file
     * that should be loaded alongside the main file.
     * However, p5 does not parse material information,
     * thus only allowing one material per one object
     * file loaded. By loading the different parts of our
     * model separately, we can apply different materials
     * to each of them. This clearly is impractical for
     * larger, more detailed models, but for our use case
     * writing a custom .obj parser would be a colossal
     * waste of development time.
     */

    customLoadModel('bowl', `${assetPath}/bowl.obj`)
    customLoadModel('bowlRim', `${assetPath}/bowlrim.obj`)
    customLoadModel('soup', `${assetPath}/soup.obj`)
    customLoadModel('salad', `${assetPath}/salad.obj`)
    customLoadModel('noodles', `${assetPath}/noodles-lowpoly.obj`)
    customLoadModel('chopsticks', `${assetPath}/chopsticks.obj`)
    customLoadModel('eggWhite', `${assetPath}/eggwhite.obj`)
    customLoadModel('eggYolk', `${assetPath}/eggyellow.obj`)
    customLoadModel('tofu', `${assetPath}/tofu.obj`)

    materials = {
      white: () => materialFunc(242, 242, 242, true),
      blue: () => materialFunc(117, 198, 230, false),
      soup: () => materialFunc(230, 173, 117, false),
      salad: () => materialFunc(152, 255, 74, true),
      noodle: () => materialFunc(255, 234, 176, false),
      wood: () => materialFunc(128, 73, 73, false),
      eggYolk: () => materialFunc(252, 186, 3, false)
    }
  }

  /**
   * p5: Draw the actual scene
   */
  sketch.draw = () => {

    /**
     * Destroy the p5 instance if not on the front page.
     * This is to prevent multiple canvases from being
     * initialized, when switching from the front page
     * to, for example, the '/add' page, then switching
     * back to the front page.
     */
    if (sketch.getURLPath().length !== 0) {
      sketch.remove()
    }

    /* General rendering setup */

    sketch.smooth()
    sketch.noStroke()
    sketch.background(bgColor)

    /* Ambient lighting based on the background color helps tie the models to the scene */

    let ambientStrength = 0.9
    sketch.ambientLight(
      sketch.red(bgColor) * ambientStrength,
      sketch.green(bgColor) * ambientStrength,
      sketch.blue(bgColor) * ambientStrength
    )

    /* Main light source */

    let lightStrength = 0.65
    let lightPos = sketch.createVector(width, -height, -25)
    sketch.pointLight(lightStrength * 255, lightStrength * 255, lightStrength * 255, lightPos)

    /* Set up appropriate positioning and scaling */

    sketch.scale(100)
    sketch.translate(0, 1, 0)
    sketch.rotateX(170)
    sketch.rotateZ(0)

    spinning
      ? sketch.rotateY(rotation += Math.abs(Math.sin(spinningTime / 18)) * 10)
      : sketch.rotateY(rotation += Math.sin(sketch.frameCount / 8))

    /* If all model parts have been loaded */

    if (models.size === 9) {
      sketch.shininess(20)

      /* Draw the different parts of the model*/

      drawModel('bowl', materials.white)
      drawModel('bowlRim', materials.blue)
      drawModel('soup', materials.soup)
      drawModel('salad', materials.salad)
      drawModel('noodles', materials.noodle)
      drawModel('chopsticks', materials.wood)
      drawModel('eggWhite', materials.white)
      drawModel('eggYolk', materials.eggYolk)
      drawModel('tofu', materials.white)

      spinning && spinningTime++
    } else {
      /* Place custom loading animation here */
    }
  }

  /**
   * Helper: Sets up an individual drawing state,
   * draws a model with the given material, then
   * clears the drawing state.
   * @param {*} m | The model to be drawn
   * @param {*} material | The material to be applied to the model
   */
  const drawModel = (name, material) => {
    sketch.push()
    material()
    sketch.model(models.get(name))
    sketch.pop()
  }

  /**
   * Helper: asynchronously load all the models
   * to be displayed. This could also be done synchronously with
   * p5's preload(), but this way we can create our own
   * loading animation.
   * @param {*} name | The desired key for the model when it is placed in a map
   * @param {*} path | The path to load the model from
   */
  const customLoadModel = (name, path) => {
    const modelLoaded = (model) => {
      models.set(name, model)
    }
    sketch.loadModel(path, modelLoaded)
  }

  /**
   * Helper: Set up a material - this code is ran in
   * every iteration of p5's draw()
   * @param {*} r | The amount of red the color has
   * @param {*} g | The amount of green the color has
   * @param {*} b | The amount of blue the color has
   * @param {*} specular | Whether the material is specular or not
   */
  const materialFunc = (r, g, b, specular) => {

    /* I've noticed that a tiny bit of ambient light of each object's own color looks nicer */

    let mult = 0.15
    sketch.ambientLight(mult * r, mult * g, mult * b)

    /* The actual surface material & color */

    specular
      ? sketch.specularMaterial(r, g, b)
      : sketch.ambientMaterial(r, g, b)
  }
}

/**
 * Set the spinning state of the food model.
 * If true, the model spins clockwise.
 * If false, the model is in a passive state,
 * alternating between a slight rotation
 * clockwise and counter-clockwise. 
 * @param {*} newStatus | The desired spinning state
 */
export const setSpin = (newStatus) => {
  spinning = newStatus
  rotation = 0
  spinningTime = 0
}