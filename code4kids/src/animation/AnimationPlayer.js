/**
 * Created by kfang on 6/2/17.
 */
import SupportedBlocks from '../metamodel/SupportedBlocks.js'

export default function play (animationContext) {
  let stepCount = 0
  const gridX = animationContext.character_starting_x_in_pixel
  const gridY = animationContext.character_starting_y_in_pixel
  const imageStreamSize = animationContext.image_stream_size
  const stepX = animationContext.step_width_in_pixel
  const stepY = animationContext.step_height_in_pixel
  const cw = animationContext.character_width_in_pixel
  const ch = animationContext.character_height_in_pixel
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
  const maxSteps = animationContext.maxSteps
  const passCondition = animationContext.passCondition
  let items = animationContext.items
  let currentGridX = 0
  let currentGridY = 0
  let actionIntervalIds = []
  let faceRight = true
  let drawFinishedFlag = true
  let shadowImages = animationContext.shadowImages
  let walkImages = animationContext.walkImages
  let walkBackwardImages = animationContext.walkBackwardImages
  let attackImages = animationContext.attackImages
  let attackBackwardImages = animationContext.attackBackwardImages
  let turnLeftImages = animationContext.turnLeftImages
  let turnRightImages = animationContext.turnRightImages
  let victoryImages = animationContext.victoryImages
  let victoryBackwardImages = animationContext.victoryBackwardImages
  let failImages = animationContext.failImages
  let failBackwardImages = animationContext.failBackwardImages

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
      ctx.drawImage(shadow, cx, cy, cw, ch)
      if (verbose === true) {
        console.log('Image printed: ' + sprites[count % sprites.length].src)
      }
      ctx.drawImage(sprites[count % sprites.length], cx, cy, cw, ch)
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
        playFailure(true)
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
        playFailure(true)
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
        playFailure(true)
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
        playFailure(true)
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
        playFailure(true)
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
        playFailure(true)
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
        playFailure(true)
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
        playFailure(true)
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
      addAnimationDelay(victorySpeed * 3)
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

  let playFailure = function (failBeforeFinished) {
    console.log('Animation Played: Fail')
    let lastIntervalId = setInterval(function () {}, 100)
    while (lastIntervalId--) {
      window.clearInterval(lastIntervalId)
    }

    if (!debugMode) {
      let count = 0
      let delayBefore = animationDelay + elapseTime
      addAnimationDelay(failSpeed)
      let actionIntervalId = setInterval(function () {
        drawCharacter(count, 0, 0, faceRight ? failImages : failBackwardImages, shadowImages[0], 1, false)
        count++
      }, failSpeed / imageStreamSize)
      actionIntervalIds.push(actionIntervalId)
      let imagesToPlay = faceRight ? failImages.slice(6, 14) : failBackwardImages.slice(6, 14)
      let imagesToPlayReverse = faceRight ? failImages.slice(6, 14).reverse() : failBackwardImages.slice(6, 14).reverse()
      let timeToElapse = failSpeed
      for (let i = 0; i < 3; i++) {
        addAnimationDelay(failSpeed)
        setTimeout(function () {
          repeatFailing(i % 2 === 0 ? imagesToPlay : imagesToPlayReverse, 7, actionIntervalIds)
        }, timeToElapse)
        timeToElapse += failSpeed
      }
      if (failBeforeFinished) {
        let extraDelay = animationDelay - delayBefore
        console.log('Extra Delay: ' + extraDelay)
        setTimeout(function () {
          let lastIntervalId = setInterval(function () {}, 100)
          while (lastIntervalId--) {
            window.clearInterval(lastIntervalId)
          }
          let lastTimeoutId = window.setTimeout(function () {}, 0)
          while (lastTimeoutId--) {
            window.clearTimeout(lastTimeoutId)
          }
          ctx.clearRect(cx, cy, cw, ch)
          animationContext.finalStatus = 'Try Again!'
          animationContext.showModal = true
        }, extraDelay)
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

  let passConditionMatched = function () {
    return stepCount < maxSteps && currentGridX + '_' + currentGridY === passCondition.destinationXGrid + '_' + passCondition.destinationYGrid
  }
  let checkPassOrFail = function () {
    if (passConditionMatched()) {
      victory()
      animationContext.finalStatus = 'Congratulations!'
    } else {
      animationContext.finalStatus = 'Try Again!'
      playFailure(false)
    }
  }
  // Main logic for runProgram
  let inStream = JSON.parse(animationContext.instruction)
  if (inStream.length > 0) {
    executeInStream(inStream, 0)
    setTimeout(function () {
      let delayBefore = animationDelay + elapseTime
      checkPassOrFail()
      let extraDelay = animationDelay - delayBefore
      console.log('Extra Delay: ' + extraDelay)
      setTimeout(function () {
        let lastIntervalId = setInterval(function () {}, 100)
        while (lastIntervalId--) {
          window.clearInterval(lastIntervalId)
        }
        let lastTimeoutId = window.setTimeout(function () {}, 0)
        while (lastTimeoutId--) {
          window.clearTimeout(lastTimeoutId)
        }
        ctx.clearRect(cx, cy, cw, ch)
        animationContext.showModal = true
      }, extraDelay)
    }, animationDelay + elapseTime)
  }
}
