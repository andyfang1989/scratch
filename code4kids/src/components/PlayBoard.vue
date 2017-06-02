<template>
  <div id="play-board-component" class="board">
    <div id="dev-block-flow-container" class="dev-block-flow-container">
      <textarea class="dev-block-flow-text-area" v-model="instruction"
                placeholder="For development only, type in block json here." rows="10" cols="15">
      </textarea>
      <button v-on:click="runProgram">Run</button>
      <br>
      <p>Instruction: {{ instruction }}</p>
      <br>
      <p>{{ result }}</p>
    </div>
    <div id="animation-container" class="animation-container">
      <img id="background" :src="background_image" class="animation-background">
      <canvas id="character" class="canvas" width="1000" height="800"></canvas>
    </div>
  </div>
</template>


<script>
  import SupportedBlocks from '../metamodel/SupportedBlocks.js'

  export default {
    data () {
      return {
        instruction: '',
        result: '',
        startX: 0,
        startY: 400,
        image_stream_size: 49,
        step_length: 100,
        actionInterval: 500,
        elapse_time: 1000,
        cWidth: 300,
        cHeight: 300,
        cScale: 1,
        run_speed: 400,
        walk_speed: 800,
        attack_speed: 300,
        turn_speed: 300,
        debug_mode: false,
        background_image: '../../static/images/knight/background/knight-bg1.jpg',
        cSprite: 'static/images/knight/walk/walk_0000.png',
        shadowSprite: 'static/images/knight/shadow/shadow.png',
        walk_sprites: [
          'static/images/knight/walk/walk_0000.png',
          'static/images/knight/walk/walk_0001.png',
          'static/images/knight/walk/walk_0002.png',
          'static/images/knight/walk/walk_0003.png',
          'static/images/knight/walk/walk_0004.png',
          'static/images/knight/walk/walk_0005.png',
          'static/images/knight/walk/walk_0006.png',
          'static/images/knight/walk/walk_0007.png',
          'static/images/knight/walk/walk_0008.png',
          'static/images/knight/walk/walk_0009.png',
          'static/images/knight/walk/walk_0010.png',
          'static/images/knight/walk/walk_0011.png',
          'static/images/knight/walk/walk_0012.png',
          'static/images/knight/walk/walk_0013.png',
          'static/images/knight/walk/walk_0014.png',
          'static/images/knight/walk/walk_0015.png',
          'static/images/knight/walk/walk_0016.png',
          'static/images/knight/walk/walk_0017.png',
          'static/images/knight/walk/walk_0018.png',
          'static/images/knight/walk/walk_0019.png',
          'static/images/knight/walk/walk_0020.png',
          'static/images/knight/walk/walk_0021.png',
          'static/images/knight/walk/walk_0022.png',
          'static/images/knight/walk/walk_0023.png',
          'static/images/knight/walk/walk_0024.png',
          'static/images/knight/walk/walk_0025.png',
          'static/images/knight/walk/walk_0026.png',
          'static/images/knight/walk/walk_0027.png',
          'static/images/knight/walk/walk_0028.png',
          'static/images/knight/walk/walk_0029.png',
          'static/images/knight/walk/walk_0030.png',
          'static/images/knight/walk/walk_0031.png',
          'static/images/knight/walk/walk_0032.png',
          'static/images/knight/walk/walk_0033.png',
          'static/images/knight/walk/walk_0034.png',
          'static/images/knight/walk/walk_0035.png',
          'static/images/knight/walk/walk_0036.png',
          'static/images/knight/walk/walk_0037.png',
          'static/images/knight/walk/walk_0038.png',
          'static/images/knight/walk/walk_0039.png',
          'static/images/knight/walk/walk_0040.png',
          'static/images/knight/walk/walk_0041.png',
          'static/images/knight/walk/walk_0042.png',
          'static/images/knight/walk/walk_0043.png',
          'static/images/knight/walk/walk_0044.png',
          'static/images/knight/walk/walk_0045.png',
          'static/images/knight/walk/walk_0046.png',
          'static/images/knight/walk/walk_0047.png',
          'static/images/knight/walk/walk_0048.png'
        ],
        walk_backward_sprites: [
          'static/images/knight/walk-backward/walk-backward_0000.png',
          'static/images/knight/walk-backward/walk-backward_0001.png',
          'static/images/knight/walk-backward/walk-backward_0002.png',
          'static/images/knight/walk-backward/walk-backward_0003.png',
          'static/images/knight/walk-backward/walk-backward_0004.png',
          'static/images/knight/walk-backward/walk-backward_0005.png',
          'static/images/knight/walk-backward/walk-backward_0006.png',
          'static/images/knight/walk-backward/walk-backward_0007.png',
          'static/images/knight/walk-backward/walk-backward_0008.png',
          'static/images/knight/walk-backward/walk-backward_0009.png',
          'static/images/knight/walk-backward/walk-backward_0010.png',
          'static/images/knight/walk-backward/walk-backward_0011.png',
          'static/images/knight/walk-backward/walk-backward_0012.png',
          'static/images/knight/walk-backward/walk-backward_0013.png',
          'static/images/knight/walk-backward/walk-backward_0014.png',
          'static/images/knight/walk-backward/walk-backward_0015.png',
          'static/images/knight/walk-backward/walk-backward_0016.png',
          'static/images/knight/walk-backward/walk-backward_0017.png',
          'static/images/knight/walk-backward/walk-backward_0018.png',
          'static/images/knight/walk-backward/walk-backward_0019.png',
          'static/images/knight/walk-backward/walk-backward_0020.png',
          'static/images/knight/walk-backward/walk-backward_0021.png',
          'static/images/knight/walk-backward/walk-backward_0022.png',
          'static/images/knight/walk-backward/walk-backward_0023.png',
          'static/images/knight/walk-backward/walk-backward_0024.png',
          'static/images/knight/walk-backward/walk-backward_0025.png',
          'static/images/knight/walk-backward/walk-backward_0026.png',
          'static/images/knight/walk-backward/walk-backward_0027.png',
          'static/images/knight/walk-backward/walk-backward_0028.png',
          'static/images/knight/walk-backward/walk-backward_0029.png',
          'static/images/knight/walk-backward/walk-backward_0030.png',
          'static/images/knight/walk-backward/walk-backward_0031.png',
          'static/images/knight/walk-backward/walk-backward_0032.png',
          'static/images/knight/walk-backward/walk-backward_0033.png',
          'static/images/knight/walk-backward/walk-backward_0034.png',
          'static/images/knight/walk-backward/walk-backward_0035.png',
          'static/images/knight/walk-backward/walk-backward_0036.png',
          'static/images/knight/walk-backward/walk-backward_0037.png',
          'static/images/knight/walk-backward/walk-backward_0038.png',
          'static/images/knight/walk-backward/walk-backward_0039.png',
          'static/images/knight/walk-backward/walk-backward_0040.png',
          'static/images/knight/walk-backward/walk-backward_0041.png',
          'static/images/knight/walk-backward/walk-backward_0042.png',
          'static/images/knight/walk-backward/walk-backward_0043.png',
          'static/images/knight/walk-backward/walk-backward_0044.png',
          'static/images/knight/walk-backward/walk-backward_0045.png',
          'static/images/knight/walk-backward/walk-backward_0046.png',
          'static/images/knight/walk-backward/walk-backward_0047.png',
          'static/images/knight/walk-backward/walk-backward_0048.png'
        ],
        attack_backward_sprites: [
          'static/images/knight/attack-backward/attack-backward_0000.png',
          'static/images/knight/attack-backward/attack-backward_0001.png',
          'static/images/knight/attack-backward/attack-backward_0002.png',
          'static/images/knight/attack-backward/attack-backward_0003.png',
          'static/images/knight/attack-backward/attack-backward_0004.png',
          'static/images/knight/attack-backward/attack-backward_0005.png',
          'static/images/knight/attack-backward/attack-backward_0006.png',
          'static/images/knight/attack-backward/attack-backward_0007.png',
          'static/images/knight/attack-backward/attack-backward_0008.png',
          'static/images/knight/attack-backward/attack-backward_0009.png',
          'static/images/knight/attack-backward/attack-backward_0010.png',
          'static/images/knight/attack-backward/attack-backward_0011.png',
          'static/images/knight/attack-backward/attack-backward_0012.png',
          'static/images/knight/attack-backward/attack-backward_0013.png',
          'static/images/knight/attack-backward/attack-backward_0014.png',
          'static/images/knight/attack-backward/attack-backward_0015.png',
          'static/images/knight/attack-backward/attack-backward_0016.png',
          'static/images/knight/attack-backward/attack-backward_0017.png',
          'static/images/knight/attack-backward/attack-backward_0018.png',
          'static/images/knight/attack-backward/attack-backward_0019.png',
          'static/images/knight/attack-backward/attack-backward_0020.png',
          'static/images/knight/attack-backward/attack-backward_0021.png',
          'static/images/knight/attack-backward/attack-backward_0022.png',
          'static/images/knight/attack-backward/attack-backward_0023.png',
          'static/images/knight/attack-backward/attack-backward_0024.png',
          'static/images/knight/attack-backward/attack-backward_0025.png',
          'static/images/knight/attack-backward/attack-backward_0026.png',
          'static/images/knight/attack-backward/attack-backward_0027.png',
          'static/images/knight/attack-backward/attack-backward_0028.png',
          'static/images/knight/attack-backward/attack-backward_0029.png',
          'static/images/knight/attack-backward/attack-backward_0030.png',
          'static/images/knight/attack-backward/attack-backward_0031.png',
          'static/images/knight/attack-backward/attack-backward_0032.png',
          'static/images/knight/attack-backward/attack-backward_0033.png',
          'static/images/knight/attack-backward/attack-backward_0034.png',
          'static/images/knight/attack-backward/attack-backward_0035.png',
          'static/images/knight/attack-backward/attack-backward_0036.png',
          'static/images/knight/attack-backward/attack-backward_0037.png',
          'static/images/knight/attack-backward/attack-backward_0038.png',
          'static/images/knight/attack-backward/attack-backward_0039.png',
          'static/images/knight/attack-backward/attack-backward_0040.png',
          'static/images/knight/attack-backward/attack-backward_0041.png',
          'static/images/knight/attack-backward/attack-backward_0042.png',
          'static/images/knight/attack-backward/attack-backward_0043.png',
          'static/images/knight/attack-backward/attack-backward_0044.png',
          'static/images/knight/attack-backward/attack-backward_0045.png',
          'static/images/knight/attack-backward/attack-backward_0046.png',
          'static/images/knight/attack-backward/attack-backward_0047.png',
          'static/images/knight/attack-backward/attack-backward_0048.png'
        ],
        attack_sprites: [
          'static/images/knight/attack/attack_0000.png',
          'static/images/knight/attack/attack_0001.png',
          'static/images/knight/attack/attack_0002.png',
          'static/images/knight/attack/attack_0003.png',
          'static/images/knight/attack/attack_0004.png',
          'static/images/knight/attack/attack_0005.png',
          'static/images/knight/attack/attack_0006.png',
          'static/images/knight/attack/attack_0007.png',
          'static/images/knight/attack/attack_0008.png',
          'static/images/knight/attack/attack_0009.png',
          'static/images/knight/attack/attack_0010.png',
          'static/images/knight/attack/attack_0011.png',
          'static/images/knight/attack/attack_0012.png',
          'static/images/knight/attack/attack_0013.png',
          'static/images/knight/attack/attack_0014.png',
          'static/images/knight/attack/attack_0015.png',
          'static/images/knight/attack/attack_0016.png',
          'static/images/knight/attack/attack_0017.png',
          'static/images/knight/attack/attack_0018.png',
          'static/images/knight/attack/attack_0019.png',
          'static/images/knight/attack/attack_0020.png',
          'static/images/knight/attack/attack_0021.png',
          'static/images/knight/attack/attack_0022.png',
          'static/images/knight/attack/attack_0023.png',
          'static/images/knight/attack/attack_0024.png',
          'static/images/knight/attack/attack_0025.png',
          'static/images/knight/attack/attack_0026.png',
          'static/images/knight/attack/attack_0027.png',
          'static/images/knight/attack/attack_0028.png',
          'static/images/knight/attack/attack_0029.png',
          'static/images/knight/attack/attack_0030.png',
          'static/images/knight/attack/attack_0031.png',
          'static/images/knight/attack/attack_0032.png',
          'static/images/knight/attack/attack_0033.png',
          'static/images/knight/attack/attack_0034.png',
          'static/images/knight/attack/attack_0035.png',
          'static/images/knight/attack/attack_0036.png',
          'static/images/knight/attack/attack_0037.png',
          'static/images/knight/attack/attack_0038.png',
          'static/images/knight/attack/attack_0039.png',
          'static/images/knight/attack/attack_0040.png',
          'static/images/knight/attack/attack_0041.png',
          'static/images/knight/attack/attack_0042.png',
          'static/images/knight/attack/attack_0043.png',
          'static/images/knight/attack/attack_0044.png',
          'static/images/knight/attack/attack_0045.png',
          'static/images/knight/attack/attack_0046.png',
          'static/images/knight/attack/attack_0047.png',
          'static/images/knight/attack/attack_0048.png'
        ],
        turn_left_sprites: [
          'static/images/knight/turn/turn_0000.png',
          'static/images/knight/turn/turn_0001.png',
          'static/images/knight/turn/turn_0002.png',
          'static/images/knight/turn/turn_0003.png',
          'static/images/knight/turn/turn_0004.png',
          'static/images/knight/turn/turn_0005.png',
          'static/images/knight/turn/turn_0006.png',
          'static/images/knight/turn/turn_0007.png',
          'static/images/knight/turn/turn_0008.png',
          'static/images/knight/turn/turn_0009.png',
          'static/images/knight/turn/turn_0010.png',
          'static/images/knight/turn/turn_0011.png',
          'static/images/knight/turn/turn_0012.png',
          'static/images/knight/turn/turn_0013.png',
          'static/images/knight/turn/turn_0014.png',
          'static/images/knight/turn/turn_0015.png',
          'static/images/knight/turn/turn_0016.png',
          'static/images/knight/turn/turn_0017.png',
          'static/images/knight/turn/turn_0018.png',
          'static/images/knight/turn/turn_0019.png',
          'static/images/knight/turn/turn_0020.png',
          'static/images/knight/turn/turn_0021.png',
          'static/images/knight/turn/turn_0022.png',
          'static/images/knight/turn/turn_0023.png',
          'static/images/knight/turn/turn_0024.png',
          'static/images/knight/turn/turn_0025.png',
          'static/images/knight/turn/turn_0026.png',
          'static/images/knight/turn/turn_0027.png',
          'static/images/knight/turn/turn_0028.png',
          'static/images/knight/turn/turn_0029.png',
          'static/images/knight/turn/turn_0030.png',
          'static/images/knight/turn/turn_0031.png',
          'static/images/knight/turn/turn_0032.png',
          'static/images/knight/turn/turn_0033.png',
          'static/images/knight/turn/turn_0034.png',
          'static/images/knight/turn/turn_0035.png',
          'static/images/knight/turn/turn_0036.png',
          'static/images/knight/turn/turn_0037.png',
          'static/images/knight/turn/turn_0038.png',
          'static/images/knight/turn/turn_0039.png',
          'static/images/knight/turn/turn_0040.png',
          'static/images/knight/turn/turn_0041.png',
          'static/images/knight/turn/turn_0042.png',
          'static/images/knight/turn/turn_0043.png',
          'static/images/knight/turn/turn_0044.png',
          'static/images/knight/turn/turn_0045.png',
          'static/images/knight/turn/turn_0046.png',
          'static/images/knight/turn/turn_0047.png',
          'static/images/knight/turn/turn_0048.png'
        ]
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        console.log('Mounted method called')
        this.initLoading()
      })
    },
    methods: {
      /**
       * Init loading of the board.
       */
      initLoading () {
        var background = document.getElementById('background')
        var mainCharacterCanvas = document.getElementById('character')
        console.log('Set canvas size as width = ' + background.width + ' and height = ' + background.height)
        mainCharacterCanvas.width = background.width
        mainCharacterCanvas.height = background.height
        var ctx = mainCharacterCanvas.getContext('2d')
        var cImg = new Image()
        var shadowImg = new Image()
        var w = this.cWidth
        var h = this.cHeight
        var cx = this.startX
        var cy = this.startY
        var cScale = this.cScale
        cImg.onload = function () {
          console.log('Init loading: ' + cImg.src + ' at location: x = ' + cx + ' and y = ' + cy + ' image size: width = ' + cImg.width + ' height = ' + cImg.height)
          ctx.drawImage(shadowImg, cx, cy, w * cScale, h * cScale)
          ctx.drawImage(cImg, cx, cy, w * cScale, h * cScale)
        }
        cImg.src = this.cSprite
        shadowImg.src = this.shadowSprite
      },
      /**
       * Execute the animation given an array of instructions.
       */
      runProgram (event) {
        var cx = this.startX
        var cy = this.startY
        var imageStreamSize = this.image_stream_size
        var stepLength = this.step_length
        var cw = this.cWidth
        var ch = this.cHeight
        var debugMode = this.debug_mode
        var attackSpeed = this.attack_speed
        var walkSpeed = this.walk_speed
        var runSpeed = this.run_speed
        var turnSpeed = this.turn_speed
        var actionInterval = this.actionInterval
        var elapseTime = this.elapse_time
        var cScale = this.cScale
        var shadowSprite = this.shadowSprite
        var faceRight = true
        var drawFinishedFlag = true
        var initLoadingFunction = this.initLoading
        var shadowImages = []
        var img = new Image()
        img.src = shadowSprite
        shadowImages.push(img)
        var walkImages = []
        for (var i = 0; i < this.walk_sprites.length; i++) {
          img = new Image()
          img.src = this.walk_sprites[i]
          walkImages.push(img)
        }
        var walkBackwardImages = []
        for (i = 0; i < this.walk_backward_sprites.length; i++) {
          img = new Image()
          img.src = this.walk_backward_sprites[i]
          walkBackwardImages.push(img)
        }
        var attackImages = []
        for (i = 0; i < this.attack_sprites.length; i++) {
          img = new Image()
          img.src = this.attack_sprites[i]
          attackImages.push(img)
        }
        var attackBackwardImages = []
        for (i = 0; i < this.attack_backward_sprites.length; i++) {
          img = new Image()
          img.src = this.attack_backward_sprites[i]
          attackBackwardImages.push(img)
        }
        var turnLeftImages = []
        var turnRightImages = []
        for (i = 0; i < this.turn_left_sprites.length; i++) {
          img = new Image()
          img.src = this.turn_left_sprites[i]
          turnLeftImages.push(img)
          turnRightImages.unshift(img)
        }
        var mainCharacterCanvas = document.getElementById('character')
        console.log('Canvas size: width = ' + mainCharacterCanvas.width + ' height = ' + mainCharacterCanvas.height)
        var actionIntervalId
        var animationDelay = 0
        var blockQueue = []
        var ctx = mainCharacterCanvas.getContext('2d')

        var roundUpPosition = function () {
          cx = Math.round(cx)
          cy = Math.round(cy)
        }
        var drawCharacter = function (count, xOffset, yOffset, sprites, shadow) {
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

        var addAnimationDelay = function (offset) {
          animationDelay += offset
          animationDelay += actionInterval
        }

        function endTurnAction () {
          var reverseFace = setInterval(function () {
            if (drawFinishedFlag) {
              faceRight = !faceRight
              clearInterval(reverseFace)
            }
          }, 100)
        }

        var MakeATurn = function () {
          console.log('Animation Played: Turn')
          if (!debugMode) {
            var count = 0
            drawFinishedFlag = false
            actionIntervalId = setInterval(function () {
              drawCharacter(count, 0, 0, faceRight ? turnLeftImages : turnRightImages, shadowImages[0])
              count++
            }, turnSpeed / imageStreamSize)
            endTurnAction()
          }
        }
        var WalkRight = function (step) {
          console.log('Animation Played: Move Right')
          if (!debugMode) {
            var count = 0
            var xoffset = step / imageStreamSize
            actionIntervalId = setInterval(function () {
              drawCharacter(count, xoffset, 0, faceRight ? walkImages : walkBackwardImages, shadowImages[0])
              count++
            }, walkSpeed / imageStreamSize)
          }
        }
        var WalkLeft = function (step) {
          console.log('Animation Played: Move Left')
          if (!debugMode) {
            var count = 0
            var xoffset = -step / imageStreamSize
            actionIntervalId = setInterval(function () {
              drawCharacter(count, xoffset, 0, faceRight ? walkImages : walkBackwardImages, shadowImages[0])
              count++
            }, walkSpeed / imageStreamSize)
          }
        }
        var WalkUp = function (step) {
          console.log('Animation Played: Move Up')
          if (!debugMode) {
            var count = 0
            var yoffset = -step / imageStreamSize
            actionIntervalId = setInterval(function () {
              drawCharacter(count, 0, yoffset, faceRight ? walkImages : walkBackwardImages, shadowImages[0])
              count++
            }, walkSpeed / imageStreamSize)
          }
        }
        var WalkDown = function (step) {
          console.log('Animation Played: Move Down')
          if (!debugMode) {
            var count = 0
            var yoffset = step / imageStreamSize
            actionIntervalId = setInterval(function () {
              drawCharacter(count, 0, yoffset, faceRight ? walkImages : walkBackwardImages, shadowImages[0])
              count++
            }, walkSpeed / imageStreamSize)
          }
        }
        var RunRight = function (step) {
          console.log('Animation Played: Move Right')
          if (!debugMode) {
            var count = 0
            var xoffset = step / imageStreamSize
            actionIntervalId = setInterval(function () {
              drawCharacter(count, xoffset, 0, faceRight ? walkImages : walkBackwardImages, shadowImages[0])
              count++
            }, runSpeed / imageStreamSize)
          }
        }
        var RunLeft = function (step) {
          console.log('Animation Played: Move Left')
          if (!debugMode) {
            var count = 0
            var xoffset = -step / imageStreamSize
            actionIntervalId = setInterval(function () {
              drawCharacter(count, xoffset, 0, faceRight ? walkImages : walkBackwardImages, shadowImages[0])
              count++
            }, runSpeed / imageStreamSize)
          }
        }
        var RunUp = function (step) {
          console.log('Animation Played: Move Up')
          if (!debugMode) {
            var count = 0
            var yoffset = -step / imageStreamSize
            actionIntervalId = setInterval(function () {
              drawCharacter(count, 0, yoffset, faceRight ? walkImages : walkBackwardImages, shadowImages[0])
              count++
            }, runSpeed / imageStreamSize)
          }
        }
        var RunDown = function (step) {
          console.log('Animation Played: Move Down')
          if (!debugMode) {
            var count = 0
            var yoffset = step / imageStreamSize
            actionIntervalId = setInterval(function () {
              drawCharacter(count, 0, yoffset, faceRight ? walkImages : walkBackwardImages, shadowImages[0])
              count++
            }, runSpeed / imageStreamSize)
          }
        }
        var attack = function () {
          console.log('Animation Played: Attack')
          if (!debugMode) {
            var count = 0
            actionIntervalId = setInterval(function () {
              drawCharacter(count, 0, 0, faceRight ? attackImages : attackBackwardImages, shadowImages[0])
              count++
            }, attackSpeed / imageStreamSize)
          }
        }
        /**
         * Execute the animation given an action JSON object.
         */
        var playAnimation = function () {
          var name = blockQueue.shift()
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
        var executeIfBlock = function (inStream, index) {
          /**
           * Evaluate the condition in a if block.
           */
          var evaluateConditionForIfBlock = function (block) {
            return block.condition
          }
          var block = inStream[index]
          if (evaluateConditionForIfBlock(block)) {
            return executeInStream(inStream, index + 1)
          } else {
            var count = 1
            var i = index + 1
            while (count > 0 && i < inStream.length) {
              var cur = inStream[i]
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
        var executeLoopingBlock = function (inStream, index) {
          var block = inStream[index]
          var count = block.count
          var nextIndex = index
          for (let i = 0; i < count; i++) {
            nextIndex = executeInStream(inStream, index + 1)
          }
          return nextIndex
        }

        /**
         * Execute the animation given an array of instructions and a starting index.
         */
        var executeInStream = function (stream, index) {
          var i = index
          let len = stream.length
          while (i < len) {
            var block = stream[i]
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
        let inStream = JSON.parse(this.instruction)
        if (inStream.length > 0) {
          executeInStream(inStream, 0)
          setTimeout(function () {
            for (var i = 1; i < 99999; i++) {
              window.clearInterval(i)
            }
            ctx.clearRect(cx, cy, cw, ch)
            initLoadingFunction()
          }, animationDelay + elapseTime, this.initLoading())
        }
      }
    }
  }
</script>

<style>
  .board {
    position: absolute;
    left: 0%;
    top: 0%;
    z-index: -1;
    width: 100%;
    height: 100%;
  }

  .dev-block-flow-container {
    position: absolute;
    left: 0%;
    top: 0%;
    z-index: -1;
    height: 100%;
    width: 30%;
  }

  .dev-block-flow-text-area {
    width: 100%;
    height: 100%;
  }

  .animation-container {
    position: absolute;
    left: 30%;
    top: 0%;
    width: 70%;
    height: 100%;
  }

  .animation-background {
    position: absolute;
    left: 0%;
    top: 0%;
    z-index: -1;
    width: 100%;
    height: 100%;
  }

  .canvas {
    position: absolute;
    left: 0px;
    top: 0px;
  }
</style>
