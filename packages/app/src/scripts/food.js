let spinning = false
let spinningTime = 0
let rotation = 0

let rollsRemaining = 0

export const foodScript = (sketch) => {

  let width = 400
  let height = 400

  let models = new Map()
  let textures = new Map()

  let bgColor

  /**
   * p5: Setup the WebGL canvas that we will be
   * drawing our objects to. Materials will also be
   * initialized here for drawing later on.
   * 
   * This code is only ran when the canvas/applet
   * is first rendered.
   */
  sketch.setup = async () => {

    sketch.createCanvas(width, height, sketch.WEBGL)
    sketch.angleMode(sketch.DEGREES)
    sketch.textureMode(sketch.NORMAL)
    bgColor = sketch.color(240, 220, 210, 0)

    /* Load the model & texture */
    let cachedBowlModel = window.sessionStorage.getItem('ramenOBJ')
    let cachedBowlTexture = window.sessionStorage.getItem('ramenTEX')

    if (cachedBowlModel && cachedBowlTexture) {
      console.log('found cached')
      customLoadModel('bowl', cachedBowlModel)
      customLoadTexture('bowl', cachedBowlTexture)
    } else {
      console.log('not cached')
      
      const bowlModelSrc = await import('../data/assets/ramen-bowl.obj')
      const bowlTextureSrc = await import('../data/assets/ramen-bowl-texture.png')

      console.log(bowlModelSrc.default)
      console.log(bowlTextureSrc.default)

      customLoadModel('bowl', String(bowlModelSrc.default))
      customLoadTexture('bowl', String(bowlTextureSrc.default))

      window.sessionStorage.setItem('ramenOBJ', bowlModelSrc.default)
      window.sessionStorage.setItem('ramenTEX', bowlTextureSrc.default)
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

    let ambientStrength = 1

    sketch.ambientLight(
      sketch.red(bgColor) * ambientStrength,
      sketch.green(bgColor) * ambientStrength,
      sketch.blue(bgColor) * ambientStrength
    )

    /* Main light source */

    let lightStrength = 1
    let lightPos = sketch.createVector(width, -height, -25)
    sketch.pointLight(
      lightStrength * 255,//sketch.red(bgColor), 
      lightStrength * 255,//sketch.green(bgColor), 
      lightStrength * 255,//sketch.blue(bgColor), 
      lightPos
    )

    /* Render a clearly fake shadow under to bowl */

    sketch.push()
    sketch.translate(-15, 170, 0)
    sketch.rotateX(90)
    sketch.fill(0, 0, 0, 180)
    sketch.ellipse(0, 0, 100, 100)
    sketch.pop()


    /* Set up appropriate positioning and scaling */

    sketch.scale(100)
    sketch.translate(0, 1, 0)
    sketch.rotateX(170)
    sketch.rotateZ(0)

    /* Rotation settings, can be changed to taste */

    let spinningRotationLength = rollsRemaining
    let spinningRotationSpeed = 2
    let notSpinningRotationLength = 32

    spinning
      ? sketch.rotateY(rotation += Math.abs(spinningRotationLength) * spinningRotationSpeed)
      : sketch.rotateY(rotation += Math.sin(sketch.frameCount / notSpinningRotationLength))

    /* If model & texture have been loaded */

    if (models.size === 1 && textures.size === 1) {
      sketch.shininess(20)

      /* Draw the different parts of the model */
      drawModel('bowl')

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
  const drawModel = (name) => {
    sketch.push()
    sketch.texture(textures.get(name))
    sketch.model(models.get(name))
    sketch.pop()
  }

  /**
   * Helper: asynchronously load all the models
   * to be displayed. This could also be done synchronously with
   * p5's preload(), but this way we can create our own
   * loading animation.
   * @param {*} name | The desired key for the model when it is placed in a map
   * @param {*} path | The path to load the model from
   */
  const customLoadModel = (name, path) => {
    const modelLoaded = (model) => {
      models.set(name, model)
    }
    sketch.loadModel(path, modelLoaded)
  }

  /**
   * Helper: asynchronously load a texture to be
   * displayed. This could also be done synchronously
   * with p5's preload(), but this way we can create our
   * own loading animation, if we wish.
   * @param {*} name | The desired key for the texture when it is placed in a map
   * @param {*} path | The path to load the texture from
   */
  const customLoadTexture = (name, path) => {
    const textureLoaded = (texture) => {
      textures.set(name, texture)
    }
    sketch.loadImage(path, textureLoaded)
  }
}

/**
 * Set the spinning state of the food model.
 * If true, the model spins clockwise.
 * If false, the model is in a passive state,
 * alternating between a slight rotation
 * clockwise and counter-clockwise. 
 * @param {*} newStatus | The desired spinning state
 */
export const setSpin = (newStatus) => {
  spinning = newStatus
  rotation = 0
  spinningTime = 0
}

export const setRollsRemaining = (value) => {
  rollsRemaining = value
}
