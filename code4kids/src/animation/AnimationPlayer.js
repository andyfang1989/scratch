/**
 * Created by kfang on 6/2/17.
 */
import SupportedBlocks from '../metamodel/SupportedBlocks.js'

export default function play (animationContext) {
  let i
  let cx = animationContext.startX
  let cy = animationContext.startY
  const imageStreamSize = animationContext.image_stream_size
  const stepLength = animationContext.step_length
  const cw = animationContext.cWidth
  const ch = animationContext.cHeight
  let debugMode = animationContext.debug_mode
  const attackSpeed = animationContext.attack_speed
  const walkSpeed = animationContext.walk_speed
  const runSpeed = animationContext.run_speed
  const turnSpeed = animationContext.turn_speed
  const actionInterval = animationContext.actionInterval
  const elapseTime = animationContext.elapse_time
  const cScale = animationContext.cScale
  const shadowSprite = animationContext.shadowSprite
  const initLoadingFunction = animationContext.initLoading
  let faceRight = true
  let drawFinishedFlag = true
  let shadowImages = []

  let img = new Image()
  img.src = shadowSprite
  shadowImages.push(img)
  let walkImages = []
  for (i = 0; i < animationContext.walk_sprites.length; i++) {
    img = new Image()
    img.src = animationContext.walk_sprites[i]
    walkImages.push(img)
  }
  let walkBackwardImages = []
  for (i = 0; i < animationContext.walk_backward_sprites.length; i++) {
    img = new Image()
    img.src = animationContext.walk_backward_sprites[i]
    walkBackwardImages.push(img)
  }
  let attackImages = []
  for (i = 0; i < animationContext.attack_sprites.length; i++) {
    img = new Image()
    img.src = animationContext.attack_sprites[i]
    attackImages.push(img)
  }
  let attackBackwardImages = []
  for (i = 0; i < animationContext.attack_backward_sprites.length; i++) {
    img = new Image()
    img.src = animationContext.attack_backward_sprites[i]
    attackBackwardImages.push(img)
  }
  let turnLeftImages = []
  let turnRightImages = []
  for (i = 0; i < animationContext.turn_left_sprites.length; i++) {
    img = new Image()
    img.src = animationContext.turn_left_sprites[i]
    turnLeftImages.push(img)
    turnRightImages.unshift(img)
  }
  let mainCharacterCanvas = document.getElementById('character')
  console.log('Canvas size: width = ' + mainCharacterCanvas.width + ' height = ' + mainCharacterCanvas.height)
  let actionIntervalId
  let animationDelay = 0
  let blockQueue = []
  let ctx = mainCharacterCanvas.getContext('2d')

  let roundUpPosition = function () {
    cx = Math.round(cx)
    cy = Math.round(cy)
  }
  let drawCharacter = function (count, xOffset, yOffset, sprites, shadow) {
    if (count < imageStreamSize) {
      ctx.clearRect(cx, cy, cw, ch)
      cx += xOffset
      cy += yOffset
      ctx.drawImage(shadow, cx, cy, cw * cScale, ch * cScale)
      ctx.drawImage(sprites[count], cx, cy, cw * cScale, ch * cScale)
    } else {
      clearInterval(actionIntervalId)
      drawFinishedFlag = true
      roundUpPosition()
      console.log('Move interval end with current position: ' + ' cx: ' + cx + ' cy: ' + cy)
    }
  }

  let addAnimationDelay = function (offset) {
    animationDelay += offset
    animationDelay += actionInterval
  }

  let endTurnAction = function () {
    let reverseFace = setInterval(function () {
      if (drawFinishedFlag) {
        faceRight = !faceRight
        clearInterval(reverseFace)
      }
    }, 100)
  }

  let MakeATurn = function () {
    console.log('Animation Played: Turn')
    if (!debugMode) {
      let count = 0
      drawFinishedFlag = false
      actionIntervalId = setInterval(function () {
        drawCharacter(count, 0, 0, faceRight ? turnLeftImages : turnRightImages, shadowImages[0])
        count++
      }, turnSpeed / imageStreamSize)
      endTurnAction()
    }
  }
  let WalkRight = function (step) {
    console.log('Animation Played: Move Right')
    if (!debugMode) {
      let count = 0
      let xoffset = step / imageStreamSize
      actionIntervalId = setInterval(function () {
        drawCharacter(count, xoffset, 0, faceRight ? walkImages : walkBackwardImages, shadowImages[0])
        count++
      }, walkSpeed / imageStreamSize)
    }
  }
  let WalkLeft = function (step) {
    console.log('Animation Played: Move Left')
    if (!debugMode) {
      let count = 0
      let xoffset = -step / imageStreamSize
      actionIntervalId = setInterval(function () {
        drawCharacter(count, xoffset, 0, faceRight ? walkImages : walkBackwardImages, shadowImages[0])
        count++
      }, walkSpeed / imageStreamSize)
    }
  }
  let WalkUp = function (step) {
    console.log('Animation Played: Move Up')
    if (!debugMode) {
      let count = 0
      let yOffset = -step / imageStreamSize
      actionIntervalId = setInterval(function () {
        drawCharacter(count, 0, yOffset, faceRight ? walkImages : walkBackwardImages, shadowImages[0])
        count++
      }, walkSpeed / imageStreamSize)
    }
  }
  let WalkDown = function (step) {
    console.log('Animation Played: Move Down')
    if (!debugMode) {
      let count = 0
      let yOffset = step / imageStreamSize
      actionIntervalId = setInterval(function () {
        drawCharacter(count, 0, yOffset, faceRight ? walkImages : walkBackwardImages, shadowImages[0])
        count++
      }, walkSpeed / imageStreamSize)
    }
  }
  let RunRight = function (step) {
    console.log('Animation Played: Move Right')
    if (!debugMode) {
      let count = 0
      let xOffset = step / imageStreamSize
      actionIntervalId = setInterval(function () {
        drawCharacter(count, xOffset, 0, faceRight ? walkImages : walkBackwardImages, shadowImages[0])
        count++
      }, runSpeed / imageStreamSize)
    }
  }
  let RunLeft = function (step) {
    console.log('Animation Played: Move Left')
    if (!debugMode) {
      let count = 0
      let xOffset = -step / imageStreamSize
      actionIntervalId = setInterval(function () {
        drawCharacter(count, xOffset, 0, faceRight ? walkImages : walkBackwardImages, shadowImages[0])
        count++
      }, runSpeed / imageStreamSize)
    }
  }
  let RunUp = function (step) {
    console.log('Animation Played: Move Up')
    if (!debugMode) {
      let count = 0
      let yOffset = -step / imageStreamSize
      actionIntervalId = setInterval(function () {
        drawCharacter(count, 0, yOffset, faceRight ? walkImages : walkBackwardImages, shadowImages[0])
        count++
      }, runSpeed / imageStreamSize)
    }
  }
  let RunDown = function (step) {
    console.log('Animation Played: Move Down')
    if (!debugMode) {
      let count = 0
      let yOffset = step / imageStreamSize
      actionIntervalId = setInterval(function () {
        drawCharacter(count, 0, yOffset, faceRight ? walkImages : walkBackwardImages, shadowImages[0])
        count++
      }, runSpeed / imageStreamSize)
    }
  }
  let attack = function () {
    console.log('Animation Played: Attack')
    if (!debugMode) {
      let count = 0
      actionIntervalId = setInterval(function () {
        drawCharacter(count, 0, 0, faceRight ? attackImages : attackBackwardImages, shadowImages[0])
        count++
      }, attackSpeed / imageStreamSize)
    }
  }
  /**
   * Execute the animation given an action JSON object.
   */
  let playAnimation = function () {
    let name = blockQueue.shift()
    console.log('Play animation for ' + name)
    switch (name) {
      case SupportedBlocks.WalkLeft:
        WalkLeft(stepLength)
        break
      case SupportedBlocks.WalkDown:
        WalkDown(stepLength)
        break
      case SupportedBlocks.WalkUp:
        WalkUp(stepLength)
        break
      case SupportedBlocks.WalkRight:
        WalkRight(stepLength)
        break
      case SupportedBlocks.RunLeft:
        RunLeft(stepLength)
        break
      case SupportedBlocks.RunDown:
        RunDown(stepLength)
        break
      case SupportedBlocks.RunUp:
        RunUp(stepLength)
        break
      case SupportedBlocks.RunRight:
        RunRight(stepLength)
        break
      case SupportedBlocks.Attack:
        attack()
        break
      case SupportedBlocks.Turn:
        MakeATurn()
        break
      case SupportedBlocks.Jump:
        break
    }
  }
  /**
   * Execute if block and return the next index to handle.
   **/
  let executeIfBlock = function (inStream, index) {
    /**
     * Evaluate the condition in a if block.
     */
    let evaluateConditionForIfBlock = function (block) {
      return block.condition
    }
    let block = inStream[index]
    if (evaluateConditionForIfBlock(block)) {
      return executeInStream(inStream, index + 1)
    } else {
      let count = 1
      let i = index + 1
      while (count > 0 && i < inStream.length) {
        let cur = inStream[i]
        switch (cur.name) {
          case SupportedBlocks.Else:
          case SupportedBlocks.IfEnd:
            count--
            break
          case SupportedBlocks.IfStart:
            count++
            break
        }
        i++
        if (count === 0 && cur.name === SupportedBlocks.Else) {
          return executeInStream(inStream, i)
        }
      }
      return i
    }
  }
  /**
   * Execute looping block and return the next index to handle.
   */
  let executeLoopingBlock = function (inStream, index) {
    let block = inStream[index]
    let count = block.count
    let nextIndex = index
    for (let i = 0; i < count; i++) {
      nextIndex = executeInStream(inStream, index + 1)
    }
    return nextIndex
  }

  /**
   * Execute the animation given an array of instructions and a starting index.
   */
  let executeInStream = function (stream, index) {
    let i = index
    let len = stream.length
    while (i < len) {
      let block = stream[i]
      switch (block.name) {
        case SupportedBlocks.WalkLeft:
        case SupportedBlocks.WalkDown:
        case SupportedBlocks.WalkUp:
        case SupportedBlocks.WalkRight:
          console.log('Current Delay: ' + animationDelay + ' With Index: ' + i + ' and Block: ' + block.name)
          blockQueue.push(block.name)
          setTimeout(function () {
            playAnimation()
          }, animationDelay)
          addAnimationDelay(walkSpeed)
          i++
          break
        case SupportedBlocks.RunLeft:
        case SupportedBlocks.RunDown:
        case SupportedBlocks.RunUp:
        case SupportedBlocks.RunRight:
          console.log('Current Delay: ' + animationDelay + ' With Index: ' + i + ' and Block: ' + block.name)
          blockQueue.push(block.name)
          setTimeout(function () {
            playAnimation()
          }, animationDelay)
          addAnimationDelay(runSpeed)
          i++
          break
        case SupportedBlocks.Jump:
        case SupportedBlocks.Turn:
          console.log('Current Delay: ' + animationDelay + ' With Index: ' + i + ' and Block: ' + block.name)
          blockQueue.push(block.name)
          setTimeout(function () {
            playAnimation()
          }, animationDelay)
          addAnimationDelay(turnSpeed)
          i++
          break
        case SupportedBlocks.Attack:
          console.log('Current Delay: ' + animationDelay + ' With Index: ' + i + ' and Block: ' + block.name)
          blockQueue.push(block.name)
          setTimeout(function () {
            playAnimation()
          }, animationDelay)
          addAnimationDelay(attackSpeed)
          i++
          break
        case SupportedBlocks.Else:
          i++
          break
        case SupportedBlocks.IfEnd:
        case SupportedBlocks.RepeatEnd:
          return i + 1
        case SupportedBlocks.IfStart:
          i = executeIfBlock(inStream, i)
          break
        case SupportedBlocks.RepeatStart:
          i = executeLoopingBlock(inStream, i)
          break
        default:
          alert('Unsupported Block Type: ' + block.name)
          break
      }
    }
  }
  // Main logic for runProgram
  let inStream = JSON.parse(animationContext.instruction)
  if (inStream.length > 0) {
    executeInStream(inStream, 0)
    setTimeout(function () {
      for (let i = 1; i < 99999; i++) {
        window.clearInterval(i)
      }
      ctx.clearRect(cx, cy, cw, ch)
      initLoadingFunction.apply(animationContext)
    }, animationDelay + elapseTime)
  }
}
