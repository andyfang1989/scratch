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
      <img src="../assets/backgrounds/dog-park.png" class="animation-background">
      <img src="../assets/characters/doggy.gif" class="character" id="doggy">
    </div>
  </div>
</template>


<script>
  import SupportedBlocks from '../metamodel/SupportedBlocks.js'

  export default {
    data () {
      return {
        instruction: '',
        result: ''
      }
    },
    methods: {
      /**
       * Execute the animation given an array of instructions.
       */
      runProgram (event) {
        var moveRight = function (dist, character) {
          console.log('Animation Played: Move Right')
          character.style.left = parseFloat(getComputedStyle(character).left) + dist + 'px'
          console.log(character.style.left)
        }
        var moveLeft = function (dist, character) {
          console.log('Animation Played: Move Left')
          character.style.left = parseFloat(getComputedStyle(character).left) - dist + 'px'
          console.log(character.style.left)
        }
        var moveUp = function (dist, character) {
          console.log('Animation Played: Move Up')
          character.style.top = parseFloat(getComputedStyle(character).top) - dist + 'px'
          console.log(character.style.top)
        }
        var moveDown = function (dist, character) {
          console.log('Animation Played: Move Down')
          character.style.top = parseFloat(getComputedStyle(character).top) + dist + 'px'
          console.log(character.style.top)
        }
        /**
         * Execute the animation given an action JSON object.
         * @param actionObj
         */
        var playAnimation = function (actionObj) {
          var character = document.getElementById('doggy')
          switch (actionObj.name) {
            case SupportedBlocks.MoveLeft:
              moveLeft(100, character)
              break
            case SupportedBlocks.MoveDown:
              moveDown(100, character)
              break
            case SupportedBlocks.MoveUp:
              moveUp(100, character)
              break
            case SupportedBlocks.MoveRight:
              moveRight(100, character)
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
              case SupportedBlocks.MoveLeft:
              case SupportedBlocks.MoveDown:
              case SupportedBlocks.MoveUp:
              case SupportedBlocks.MoveRight:
              case SupportedBlocks.Jump:
              case SupportedBlocks.Turn:
                playAnimation(block)
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
    height: 44%;
  }

  .dev-block-flow-container {
    position: absolute;
    left: 0%;
    top: 0%;
    z-index: -1;
    height: 100%;
    width: 20%;
  }

  .dev-block-flow-text-area {
    width: 100%;
    height: 80%;
  }

  .animation-container {
    position: absolute;
    left: 22%;
    top: 0%;
    width: 78%;
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

  .character {
    position: absolute;
    left: 0%;
    top: 60%;
    z-index: -1;
    width: 80px;
    height: 60px;
    transition-duration: 1s;
  }
</style>
