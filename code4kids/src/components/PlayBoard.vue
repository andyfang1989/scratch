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
      <img id = "background" src="../assets/backgrounds/dog-park.png" class="animation-background">
      <canvas id="knight" class="canvas" width="1000" height="800"></canvas>
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
        currentX: 0,
        currentY: 300,
        bps: 49,
        step: 100,
        pausetime: 500,
        elapsetime: 1000,
        cWidth: 500,
        cHeight: 600,
        cScale: 0.5,
        speedfast: 400,
        speednormal: 800,
        attackspeed: 300,
        debugMode: false,
        initSprite: 'static/images/knight/walk/walk_0000.png',
        walksprites: [
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
        attacksprites: [
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
        var c = document.getElementById('knight')
        console.log('Set canvas size as width = ' + background.width + ' and height = ' + background.height)
        c.width = background.width
        c.height = background.height
        var ctx = c.getContext('2d')
        var img = new Image()
        var w = this.cWidth
        var h = this.cHeight
        var cx = this.currentX
        var cy = this.currentY
        var cScale = this.cScale
        img.onload = function () {
          console.log('Init loading: ' + img.src + ' at location: x = ' + cx + ' and y = ' + cy)
          ctx.drawImage(img, 0, 0, w, h, cx, cy, w * cScale, h * cScale)
        }
        img.src = this.initSprite
      },
      /**
       * Execute the animation given an array of instructions.
       */
      runProgram (event) {
        var cx = this.currentX
        var cy = this.currentY
        var bps = this.bps
        var step = this.step
        var cw = this.cWidth
        var ch = this.cHeight
        var debugMode = this.debugMode
        var attackspeed = this.attackspeed
        var walkspeed = this.speednormal
        var runspeed = this.speedfast
        var pause = this.pausetime
        var elapsetime = this.elapsetime
        var cScale = this.cScale
        var initLoading = this.initLoading

        var walkimgs = []
        for (var i = 0; i < this.walksprites.length; i++) {
          var img = new Image()
          img.src = this.walksprites[i]
          walkimgs.push(img)
        }
        var attackimgs = []
        for (i = 0; i < this.attacksprites.length; i++) {
          img = new Image()
          img.src = this.attacksprites[i]
          attackimgs.push(img)
        }
        var c = document.getElementById('knight')
        console.log('Canvas size: width = ' + c.width + ' height = ' + c.height)
        var move
        var delay = 0
        var blockQueue = []
        var ctx = c.getContext('2d')

        var drawCharacter = function (count, xoffset, yoffset, sprites) {
          if (count < bps) {
            ctx.clearRect(cx, cy, cw, ch)
            cx += xoffset
            cy += yoffset
            console.log('Image Played: ' + sprites[count].src)
            ctx.drawImage(sprites[count], 0, 0, cw, ch, cx, cy, cw * cScale, ch * cScale)
            console.log('Draw Once' + ' cx: ' + cx + ' cy: ' + cy)
          } else {
            clearInterval(move)
            console.log('Move interval end.')
          }
        }

        var addDelay = function (offset) {
          delay += offset
          delay += pause
        }

        var WalkRight = function (step) {
          console.log('Animation Played: Move Right')
          if (!debugMode) {
            var count = 0
            var xoffset = step / bps
            move = setInterval(function () {
              drawCharacter(count, xoffset, 0, walkimgs)
              addDelay(walkspeed)
              count++
            }, walkspeed / bps)
          }
        }
        var WalkLeft = function (step) {
          console.log('Animation Played: Move Left')
          if (!debugMode) {
            var count = 0
            var xoffset = -step / bps
            move = setInterval(function () {
              drawCharacter(count, xoffset, 0, walkimgs)
              addDelay(walkspeed)
              count++
            }, walkspeed / bps)
          }
        }
        var WalkUp = function (step) {
          console.log('Animation Played: Move Up')
          if (!debugMode) {
            var count = 0
            var yoffset = -step / bps
            move = setInterval(function () {
              drawCharacter(count, 0, yoffset, walkimgs)
              addDelay(walkspeed)
              count++
            }, walkspeed / bps)
          }
        }
        var WalkDown = function (step) {
          console.log('Animation Played: Move Down')
          if (!debugMode) {
            var count = 0
            var yoffset = step / bps
            move = setInterval(function () {
              drawCharacter(count, 0, yoffset, walkimgs)
              addDelay(walkspeed)
              count++
            }, walkspeed / bps)
          }
        }
        var RunRight = function (step) {
          console.log('Animation Played: Move Right')
          if (!debugMode) {
            var count = 0
            var xoffset = step / bps
            move = setInterval(function () {
              drawCharacter(count, xoffset, 0, walkimgs)
              addDelay(runspeed)
              count++
            }, runspeed / bps)
          }
        }
        var RunLeft = function (step) {
          console.log('Animation Played: Move Left')
          if (!debugMode) {
            var count = 0
            var xoffset = -step / bps
            move = setInterval(function () {
              drawCharacter(count, xoffset, 0, walkimgs)
              addDelay(runspeed)
              count++
            }, runspeed / bps)
          }
        }
        var RunUp = function (step) {
          console.log('Animation Played: Move Up')
          if (!debugMode) {
            var count = 0
            var yoffset = -step / bps
            move = setInterval(function () {
              drawCharacter(count, 0, yoffset, walkimgs)
              addDelay(runspeed)
              count++
            }, runspeed / bps)
          }
        }
        var RunDown = function (step) {
          console.log('Animation Played: Move Down')
          if (!debugMode) {
            var count = 0
            var yoffset = step / bps
            move = setInterval(function () {
              drawCharacter(count, 0, yoffset, walkimgs)
              addDelay(runspeed)
              count++
            }, runspeed / bps)
          }
        }
        var attack = function () {
          console.log('Animation Played: Attack')
          if (!debugMode) {
            var count = 0
            move = setInterval(function () {
              drawCharacter(count, 0, 0, attackimgs)
              addDelay(attackspeed)
              count++
            }, attackspeed / bps)
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
              WalkLeft(step)
              break
            case SupportedBlocks.WalkDown:
              WalkDown(step)
              break
            case SupportedBlocks.WalkUp:
              WalkUp(step)
              break
            case SupportedBlocks.WalkRight:
              WalkRight(step)
              break
            case SupportedBlocks.RunLeft:
              RunLeft(step)
              break
            case SupportedBlocks.RunDown:
              RunDown(step)
              break
            case SupportedBlocks.RunUp:
              RunUp(step)
              break
            case SupportedBlocks.RunRight:
              RunRight(step)
              break
            case SupportedBlocks.Attack:
              attack()
              break
            case SupportedBlocks.Jump:
            case SupportedBlocks.Turn:
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
              case SupportedBlocks.RunLeft:
              case SupportedBlocks.RunDown:
              case SupportedBlocks.RunUp:
              case SupportedBlocks.RunRight:
              case SupportedBlocks.Jump:
              case SupportedBlocks.Turn:
              case SupportedBlocks.Attack:
                console.log('Current Delay: ' + delay + ' With Index: ' + i + ' and Block: ' + block.name)
                blockQueue.push(block.name)
                setTimeout(function () {
                  playAnimation()
                }, delay)
                delay += 1500
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
            initLoading()
          }, delay + elapsetime, this.initLoading())
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
    width: 10%;
  }

  .dev-block-flow-text-area {
    width: 100%;
    height: 100%;
  }

  .animation-container {
    position: absolute;
    left: 10%;
    top: 0%;
    width: 90%;
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
    left: 0%;
    top: 0%;
    margin:0px;
  }
</style>
