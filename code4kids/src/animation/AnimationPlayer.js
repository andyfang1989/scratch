/**
 * Created by kfang on 6/2/17.
 */
import SupportedBlocks from '../metamodel/SupportedBlocks.js'

export default function play (animationContext) {
  let i
  let stepCount = 0
  const gridX = animationContext.start_x
  const gridY = animationContext.start_y
  const imageStreamSize = animationContext.image_stream_size
  const stepX = animationContext.step_x
  const stepY = animationContext.step_y
  const cw = animationContext.cWidth
  const ch = animationContext.cHeight
  let cx = gridX + Math.round(stepX / 2) - Math.round(cw / 2)
  let cy = gridY - ch
  let debugMode = animationContext.debug_mode
  const attackSpeed = animationContext.attack_speed
  const walkSpeed = animationContext.walk_speed
  const runSpeed = animationContext.run_speed
  const turnSpeed = animationContext.turn_speed
  const victorySpeed = animationContext.victory_speed
  const failSpeed = animationContext.fail_speed
  const actionInterval = animationContext.actionInterval
  const elapseTime = animationContext.elapse_time
  const cScale = animationContext.cScale
  const shadowSprite = animationContext.shadowSprite
  const initLoadingFunction = animationContext.initLoading
  const maxSteps = animationContext.maxSteps
  const endWithInitLoading = animationContext.endWithInitLoading
  const failCondition = animationContext.failCondition
  const passCondition = animationContext.passCondition
  let items = animationContext.items
  let currentGridX = 0
  let currentGridY = 0
  let actionIntervalIds = []

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

  let victoryImages = []
  for (i = 0; i < animationContext.victory_sprites.length; i++) {
    img = new Image()
    img.src = animationContext.victory_sprites[i]
    victoryImages.push(img)
  }

  let victoryBackwardImages = []
  for (i = 0; i < animationContext.victory_backward_sprites.length; i++) {
    img = new Image()
    img.src = animationContext.victory_backward_sprites[i]
    victoryBackwardImages.push(img)
  }

  let failImages = []
  for (i = 0; i < animationContext.fail_sprites.length; i++) {
    img = new Image()
    img.src = animationContext.fail_sprites[i]
    failImages.push(img)
  }

  let failBackwardImages = []
  for (i = 0; i < animationContext.fail_backward_sprites.length; i++) {
    img = new Image()
    img.src = animationContext.fail_backward_sprites[i]
    failBackwardImages.push(img)
  }

  let mainCharacterCanvas = document.getElementById('character')
  console.log('Canvas size: width = ' + mainCharacterCanvas.width + ' height = ' + mainCharacterCanvas.height)
  let animationDelay = 0
  let blockQueue = []
  let gridOffsetXQueue = []
  let gridOffsetYQueue = []
  let ctx = mainCharacterCanvas.getContext('2d')

  let roundUpPosition = function () {
    cx = Math.round(cx)
    cy = Math.round(cy)
  }
  let addCharacterGridOffset = function () {
    // console.log('Current grid position Before: x = ' + currentGridX + ' y = ' + currentGridY)
    if (gridOffsetXQueue.length > 0 && gridOffsetYQueue.length > 0) {
      currentGridX += gridOffsetXQueue.shift()
      currentGridY += gridOffsetYQueue.shift()
    }
    // console.log('Current grid position After: x = ' + currentGridX + ' y = ' + currentGridY)
  }
  let drawCharacter = function (count, xOffset, yOffset, sprites, shadow, repeat, verbose) {
    if (count < sprites.length * repeat) {
      ctx.clearRect(cx, cy, cw, ch)
      cx += xOffset
      cy += yOffset
      ctx.drawImage(shadow, cx, cy, cw * cScale, ch * cScale)
      if (verbose === true) {
        console.log('Image printed: ' + sprites[count % sprites.length].src)
      }
      ctx.drawImage(sprites[count % sprites.length], cx, cy, cw * cScale, ch * cScale)
    } else {
      clearInterval(actionIntervalIds.shift())
      drawFinishedFlag = true
      roundUpPosition()
      addCharacterGridOffset()
      console.log('Move interval end with current position: ' + ' cx: ' + cx + ' cy: ' + cy)
    }
  }

  let isBlocked = function (xOffset, yOffset) {
    let xP = currentGridX + xOffset
    let yP = currentGridY + yOffset
    for (let i = 0; i < items.length; i++) {
      let item = items[i]
      if (item.blocker === true) {
        for (let j = 0; j < item.coordinates.length; j++) {
          let bP = item.coordinates[j]
          if (bP.x === xP && bP.y === yP) {
            return true
          }
        }
      }
    }
    return false
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
      let actionIntervalId = setInterval(function () {
        drawCharacter(count, 0, 0, faceRight ? turnLeftImages : turnRightImages, shadowImages[0], 1, false)
        count++
      }, turnSpeed / imageStreamSize)
      actionIntervalIds.push(actionIntervalId)
      endTurnAction()
    }
  }
  let WalkRight = function (step) {
    console.log('Animation Played: Move Right')
    if (!debugMode) {
      if (isBlocked(1, 0)) {
        failAction()
      } else {
        let count = 0
        let xOffset = step / imageStreamSize
        gridOffsetXQueue.push(1)
        gridOffsetYQueue.push(0)
        let actionIntervalId = setInterval(function () {
          drawCharacter(count, xOffset, 0, faceRight ? walkImages : walkBackwardImages, shadowImages[0], 1, false)
          count++
        }, walkSpeed / imageStreamSize)
        actionIntervalIds.push(actionIntervalId)
      }
    }
  }
  let WalkLeft = function (step) {
    console.log('Animation Played: Move Left')
    if (!debugMode) {
      if (isBlocked(-1, 0)) {
        failAction()
      } else {
        let count = 0
        let xOffset = -step / imageStreamSize
        gridOffsetXQueue.push(-1)
        gridOffsetYQueue.push(0)
        let actionIntervalId = setInterval(function () {
          drawCharacter(count, xOffset, 0, faceRight ? walkImages : walkBackwardImages, shadowImages[0], 1, false)
          count++
        }, walkSpeed / imageStreamSize)
        actionIntervalIds.push(actionIntervalId)
      }
    }
  }
  let WalkUp = function (step) {
    console.log('Animation Played: Move Up')
    if (!debugMode) {
      if (isBlocked(0, -1)) {
        failAction()
      } else {
        let count = 0
        let yOffset = -step / imageStreamSize
        gridOffsetXQueue.push(0)
        gridOffsetYQueue.push(-1)
        let actionIntervalId = setInterval(function () {
          drawCharacter(count, 0, yOffset, faceRight ? walkImages : walkBackwardImages, shadowImages[0], 1, false)
          count++
        }, walkSpeed / imageStreamSize)
        actionIntervalIds.push(actionIntervalId)
      }
    }
  }
  let WalkDown = function (step) {
    console.log('Animation Played: Move Down')
    if (!debugMode) {
      if (isBlocked(0, 1)) {
        failAction()
      } else {
        let count = 0
        let yOffset = step / imageStreamSize
        gridOffsetXQueue.push(0)
        gridOffsetYQueue.push(1)
        let actionIntervalId = setInterval(function () {
          drawCharacter(count, 0, yOffset, faceRight ? walkImages : walkBackwardImages, shadowImages[0], 1, false)
          count++
        }, walkSpeed / imageStreamSize)
        actionIntervalIds.push(actionIntervalId)
      }
    }
  }
  let RunRight = function (step) {
    console.log('Animation Played: Move Right')
    if (!debugMode) {
      if (isBlocked(1, 0)) {
        failAction()
      } else {
        let count = 0
        let xOffset = step / imageStreamSize
        gridOffsetXQueue.push(1)
        gridOffsetYQueue.push(0)
        let actionIntervalId = setInterval(function () {
          drawCharacter(count, xOffset, 0, faceRight ? walkImages : walkBackwardImages, shadowImages[0], 1, false)
          count++
        }, runSpeed / imageStreamSize)
        actionIntervalIds.push(actionIntervalId)
      }
    }
  }
  let RunLeft = function (step) {
    console.log('Animation Played: Move Left')
    if (!debugMode) {
      if (isBlocked(-1, 0)) {
        failAction()
      } else {
        let count = 0
        let xOffset = -step / imageStreamSize
        gridOffsetXQueue.push(-1)
        gridOffsetYQueue.push(0)
        let actionIntervalId = setInterval(function () {
          drawCharacter(count, xOffset, 0, faceRight ? walkImages : walkBackwardImages, shadowImages[0], 1, false)
          count++
        }, runSpeed / imageStreamSize)
        actionIntervalIds.push(actionIntervalId)
      }
    }
  }
  let RunUp = function (step) {
    console.log('Animation Played: Move Up')
    if (!debugMode) {
      if (isBlocked(0, -1)) {
        failAction()
      } else {
        let count = 0
        let yOffset = -step / imageStreamSize
        gridOffsetXQueue.push(0)
        gridOffsetYQueue.push(-1)
        let actionIntervalId = setInterval(function () {
          drawCharacter(count, 0, yOffset, faceRight ? walkImages : walkBackwardImages, shadowImages[0], 1, false)
          count++
        }, runSpeed / imageStreamSize)
        actionIntervalIds.push(actionIntervalId)
      }
    }
  }
  let RunDown = function (step) {
    console.log('Animation Played: Move Down')
    if (!debugMode) {
      if (isBlocked(0, 1)) {
        failAction()
      } else {
        let count = 0
        let yOffset = step / imageStreamSize
        gridOffsetXQueue.push(0)
        gridOffsetYQueue.push(1)
        let actionIntervalId = setInterval(function () {
          drawCharacter(count, 0, yOffset, faceRight ? walkImages : walkBackwardImages, shadowImages[0], 1, false)
          count++
        }, runSpeed / imageStreamSize)
        actionIntervalIds.push(actionIntervalId)
      }
    }
  }
  let attack = function () {
    console.log('Animation Played: Attack')
    if (!debugMode) {
      let count = 0
      let actionIntervalId = setInterval(function () {
        drawCharacter(count, 0, 0, faceRight ? attackImages : attackBackwardImages, shadowImages[0], 1, false)
        count++
      }, attackSpeed / imageStreamSize)
      actionIntervalIds.push(actionIntervalId)
    }
  }
  let victory = function () {
    console.log('Animation Played: Victory')
    if (!debugMode) {
      let count = 0
      let actionIntervalId = setInterval(function () {
        drawCharacter(count, 0, 0, faceRight ? victoryImages : victoryBackwardImages, shadowImages[0], 3, false)
        count++
      }, victorySpeed / imageStreamSize)
      actionIntervalIds.push(actionIntervalId)
    }
  }

  let repeatFailing = function (images, size, actionIntervalIds) {
    let count = 0
    let actionIntervalId = setInterval(function () {
      drawCharacter(count, 0, 0, images, shadowImages[0], 1, true)
      count++
    }, failSpeed / size)
    actionIntervalIds.push(actionIntervalId)
  }

  let failAction = function () {
    console.log('Animation Played: Fail')
    var lastIntervalId = setInterval(function () {}, 100)
    while (lastIntervalId--) {
      window.clearInterval(lastIntervalId)
    }

    if (!debugMode) {
      let count = 0
      addAnimationDelay(failSpeed)
      let actionIntervalId = setInterval(function () {
        drawCharacter(count, 0, 0, faceRight ? failImages : failBackwardImages, shadowImages[0], 1, false)
        count++
      }, failSpeed / imageStreamSize)
      actionIntervalIds.push(actionIntervalId)
      let imagesToPlay = faceRight ? failImages.slice(23, 49) : failBackwardImages.slice(23, 49)
      let imagesToPlayReverse = faceRight ? failImages.slice(23, 49).reverse() : failBackwardImages.slice(23, 49).reverse()
      let timeToElapse = failSpeed
      for (let i = 0; i < 9; i++) {
        addAnimationDelay(failSpeed)
        setTimeout(function () {
          repeatFailing(i % 2 === 0 ? imagesToPlay : imagesToPlayReverse, 26, actionIntervalIds)
        }, timeToElapse)
        timeToElapse += failSpeed
      }
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
        WalkLeft(stepX)
        break
      case SupportedBlocks.WalkDown:
        WalkDown(stepY)
        break
      case SupportedBlocks.WalkUp:
        WalkUp(stepY)
        break
      case SupportedBlocks.WalkRight:
        WalkRight(stepX)
        break
      case SupportedBlocks.RunLeft:
        RunLeft(stepX)
        break
      case SupportedBlocks.RunDown:
        RunDown(stepY)
        break
      case SupportedBlocks.RunUp:
        RunUp(stepY)
        break
      case SupportedBlocks.RunRight:
        RunRight(stepX)
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
    stepCount++
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
  var failConditionMatched = function () {
    if (failCondition) {
    }
    return false
  }
  var passConditionMatched = function () {
    if (currentGridX + '_' + currentGridY === passCondition.destinationXGrid + '_' + passCondition.destinationYGrid) {
      return true
    } else {
      return false
    }
  }
  var checkPassOrFail = function () {
    if (stepCount > maxSteps || failConditionMatched()) {
      failAction()
    } else if (passConditionMatched()) {
      victory()
    }
  }
  // Main logic for runProgram
  let inStream = JSON.parse(animationContext.instruction)
  if (inStream.length > 0) {
    executeInStream(inStream, 0)
    setTimeout(function () {
      var lastIntervalId = setInterval(function () {}, 100)
      while (lastIntervalId--) {
        window.clearTimeout(lastIntervalId)
      }
      var lastTimeoutId = window.setTimeout(function () {}, 0)
      while (lastTimeoutId--) {
        window.clearTimeout(lastTimeoutId)
      }
      checkPassOrFail()
      if (endWithInitLoading) {
        ctx.clearRect(cx, cy, cw, ch)
        initLoadingFunction.apply(animationContext)
      }
    }, animationDelay + elapseTime)
  }
}
