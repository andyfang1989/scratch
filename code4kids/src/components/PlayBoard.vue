<template>
  <div id="play-board-component" class="board">
    <div id="dev-block-flow-container" class="dev-block-flow-container">
      <textarea class="dev-block-flow-text-area" v-model="initContext.instruction"
                placeholder="For development only, type in block json here." rows="10" cols="15">
      </textarea>
      <button v-on:click="runAnimation">Run</button>
      <br>
      <p>Instruction: {{ initContext.instruction }}</p>
      <br>
      <p>{{ initContext.instructionDebugPrint }}</p>
    </div>
    <div id="animation-container" class="animation-container">
      <div id="loading" class="animation-container-loading" v-if="!initContext.imageLoadingCompleted">
        <h1>{{ initContext.assetLoadingStatus}}</h1>
      </div>
      <div id="animation-modal" class="popup">
        <app-modal v-if="initContext.showModal" @close="initContext.initLoading()">
          <h3 slot="body">{{initContext.finalStatus}}</h3>
        </app-modal>
      </div>
      <img id="background" :src="initContext.background_image" class="animation-background">

      <canvas id="grid-board" class="canvas" width="1000" height="800"
              v-show="initContext.imageLoadingCompleted"></canvas>
      <canvas id="items" class="canvas" width="1000" height="800" v-show="initContext.imageLoadingCompleted"></canvas>
      <canvas id="character" class="canvas" width="1000" height="800"
              v-show="initContext.imageLoadingCompleted"></canvas>
    </div>
  </div>
</template>


<script>
  import AnimationPlayer from '../animation/AnimationPlayer'

  export default {
    data () {
      return {
        initContext: {
          instruction: '',
          grid_x_size: 10,
          grid_y_size: 5,
          character_start_x_percentage: 0,
          character_start_y_percentage: 0.53,
          grid_board_top_left_x_percentage: 0,
          grid_board_top_left_y_percentage: 0.4,
          image_stream_size: 13,
          step_x_percentage: 0.1,
          step_y_percentage: 0.08,
          actionInterval: 300,
          elapse_time: 1000,
          character_width_in_pixel: 300,
          character_height_in_pixel: 300,
          run_speed: 400,
          walk_speed: 800,
          attack_speed: 300,
          turn_speed: 300,
          victory_speed: 1000,
          fail_speed: 1000,
          debug_mode: false,
          background_image: '../../static/images/knight/background/knight-bg.jpg',
          front_ground_sprites: [
            'static/images/knight/background/knight-fg.png'
          ],
          character_sprites: [
            'static/images/knight/walk/walk_0000.png'
          ],
          shadow_sprites: [
            'static/images/knight/shadow/shadow.png'
          ],
          grid_sprites: [
            'static/images/knight/background/grid.png'
          ],
          walk_sprites: [
            'static/images/knight/walk/walk_0000.png',
            'static/images/knight/walk/walk_0004.png',
            'static/images/knight/walk/walk_0008.png',
            'static/images/knight/walk/walk_0012.png',
            'static/images/knight/walk/walk_0016.png',
            'static/images/knight/walk/walk_0020.png',
            'static/images/knight/walk/walk_0024.png',
            'static/images/knight/walk/walk_0028.png',
            'static/images/knight/walk/walk_0032.png',
            'static/images/knight/walk/walk_0036.png',
            'static/images/knight/walk/walk_0040.png',
            'static/images/knight/walk/walk_0044.png',
            'static/images/knight/walk/walk_0048.png'
          ],
          walk_backward_sprites: [
            'static/images/knight/walk-backward/walk-backward_0000.png',
            'static/images/knight/walk-backward/walk-backward_0004.png',
            'static/images/knight/walk-backward/walk-backward_0008.png',
            'static/images/knight/walk-backward/walk-backward_0012.png',
            'static/images/knight/walk-backward/walk-backward_0016.png',
            'static/images/knight/walk-backward/walk-backward_0020.png',
            'static/images/knight/walk-backward/walk-backward_0024.png',
            'static/images/knight/walk-backward/walk-backward_0028.png',
            'static/images/knight/walk-backward/walk-backward_0032.png',
            'static/images/knight/walk-backward/walk-backward_0036.png',
            'static/images/knight/walk-backward/walk-backward_0040.png',
            'static/images/knight/walk-backward/walk-backward_0044.png',
            'static/images/knight/walk-backward/walk-backward_0048.png'
          ],
          attack_backward_sprites: [
            'static/images/knight/attack-backward/attack-backward_0000.png',
            'static/images/knight/attack-backward/attack-backward_0004.png',
            'static/images/knight/attack-backward/attack-backward_0008.png',
            'static/images/knight/attack-backward/attack-backward_0012.png',
            'static/images/knight/attack-backward/attack-backward_0016.png',
            'static/images/knight/attack-backward/attack-backward_0020.png',
            'static/images/knight/attack-backward/attack-backward_0024.png',
            'static/images/knight/attack-backward/attack-backward_0028.png',
            'static/images/knight/attack-backward/attack-backward_0032.png',
            'static/images/knight/attack-backward/attack-backward_0036.png',
            'static/images/knight/attack-backward/attack-backward_0040.png',
            'static/images/knight/attack-backward/attack-backward_0044.png',
            'static/images/knight/attack-backward/attack-backward_0048.png'
          ],
          attack_sprites: [
            'static/images/knight/attack/attack_0000.png',
            'static/images/knight/attack/attack_0004.png',
            'static/images/knight/attack/attack_0008.png',
            'static/images/knight/attack/attack_0012.png',
            'static/images/knight/attack/attack_0016.png',
            'static/images/knight/attack/attack_0020.png',
            'static/images/knight/attack/attack_0024.png',
            'static/images/knight/attack/attack_0028.png',
            'static/images/knight/attack/attack_0032.png',
            'static/images/knight/attack/attack_0036.png',
            'static/images/knight/attack/attack_0040.png',
            'static/images/knight/attack/attack_0044.png',
            'static/images/knight/attack/attack_0048.png'
          ],
          turn_left_sprites: [
            'static/images/knight/turn/turn_0000.png',
            'static/images/knight/turn/turn_0004.png',
            'static/images/knight/turn/turn_0008.png',
            'static/images/knight/turn/turn_0012.png',
            'static/images/knight/turn/turn_0016.png',
            'static/images/knight/turn/turn_0020.png',
            'static/images/knight/turn/turn_0024.png',
            'static/images/knight/turn/turn_0028.png',
            'static/images/knight/turn/turn_0032.png',
            'static/images/knight/turn/turn_0036.png',
            'static/images/knight/turn/turn_0040.png',
            'static/images/knight/turn/turn_0044.png',
            'static/images/knight/turn/turn_0048.png'
          ],
          victory_sprites: [
            'static/images/knight/victory/victory_0000.png',
            'static/images/knight/victory/victory_0004.png',
            'static/images/knight/victory/victory_0008.png',
            'static/images/knight/victory/victory_0012.png',
            'static/images/knight/victory/victory_0016.png',
            'static/images/knight/victory/victory_0020.png',
            'static/images/knight/victory/victory_0024.png',
            'static/images/knight/victory/victory_0028.png',
            'static/images/knight/victory/victory_0032.png',
            'static/images/knight/victory/victory_0036.png',
            'static/images/knight/victory/victory_0040.png',
            'static/images/knight/victory/victory_0044.png',
            'static/images/knight/victory/victory_0048.png'
          ],
          victory_backward_sprites: [
            'static/images/knight/victory-backward/victory-backward_0000.png',
            'static/images/knight/victory-backward/victory-backward_0004.png',
            'static/images/knight/victory-backward/victory-backward_0008.png',
            'static/images/knight/victory-backward/victory-backward_0012.png',
            'static/images/knight/victory-backward/victory-backward_0016.png',
            'static/images/knight/victory-backward/victory-backward_0020.png',
            'static/images/knight/victory-backward/victory-backward_0024.png',
            'static/images/knight/victory-backward/victory-backward_0028.png',
            'static/images/knight/victory-backward/victory-backward_0032.png',
            'static/images/knight/victory-backward/victory-backward_0036.png',
            'static/images/knight/victory-backward/victory-backward_0040.png',
            'static/images/knight/victory-backward/victory-backward_0044.png',
            'static/images/knight/victory-backward/victory-backward_0048.png'
          ],
          fail_sprites: [
            'static/images/knight/fail/fail_0000.png',
            'static/images/knight/fail/fail_0004.png',
            'static/images/knight/fail/fail_0008.png',
            'static/images/knight/fail/fail_0012.png',
            'static/images/knight/fail/fail_0016.png',
            'static/images/knight/fail/fail_0020.png',
            'static/images/knight/fail/fail_0024.png',
            'static/images/knight/fail/fail_0028.png',
            'static/images/knight/fail/fail_0032.png',
            'static/images/knight/fail/fail_0036.png',
            'static/images/knight/fail/fail_0040.png',
            'static/images/knight/fail/fail_0044.png',
            'static/images/knight/fail/fail_0048.png'
          ],
          fail_backward_sprites: [
            'static/images/knight/fail-backward/fail-backward_0000.png',
            'static/images/knight/fail-backward/fail-backward_0004.png',
            'static/images/knight/fail-backward/fail-backward_0008.png',
            'static/images/knight/fail-backward/fail-backward_0012.png',
            'static/images/knight/fail-backward/fail-backward_0016.png',
            'static/images/knight/fail-backward/fail-backward_0020.png',
            'static/images/knight/fail-backward/fail-backward_0024.png',
            'static/images/knight/fail-backward/fail-backward_0028.png',
            'static/images/knight/fail-backward/fail-backward_0032.png',
            'static/images/knight/fail-backward/fail-backward_0036.png',
            'static/images/knight/fail-backward/fail-backward_0040.png',
            'static/images/knight/fail-backward/fail-backward_0044.png',
            'static/images/knight/fail-backward/fail-backward_0048.png'
          ],
          items: [
            {
              image: '/static/images/knight/background/stone.png',
              count: 30,
              random: true,
              coordinates: [],
              blocker: true
            },
            {
              image: 'static/images/knight/background/destination.png',
              count: 1,
              random: false,
              coordinates: [
                {
                  x: 8,
                  y: 2,
                  xOffset: 0,
                  yOffset: -20
                }
              ],
              blocker: false
            }
          ],
          maxSteps: 20,
          failCondition: {},
          passCondition: {
            destinationXGrid: 8,
            destinationYGrid: 2
          },
          showModal: false,
          finalStatus: '',
          imageLoadingCompleted: false,
          imageTotal: 123,
          imageLoadedCount: 0,
          instructionDebugPrint: '',
          character_starting_x_in_pixel: 0, // This value will be initialized based on actual screen size
          character_starting_y_in_pixel: 0, // This value will be initialized based on actual screen size
          step_width_in_pixel: 100, // This value will be initialized based on actual screen size
          step_height_in_pixel: 100, // This value will be initialized based on actual screen size
          canvasWidth: 0,
          canvasHeight: 0,
          shadowImages: [],
          walkImages: [],
          walkBackwardImages: [],
          attackImages: [],
          attackBackwardImages: [],
          turnLeftImages: [],
          turnRightImages: [],
          victoryImages: [],
          victoryBackwardImages: [],
          failImages: [],
          failBackwardImages: [],
          characterImages: [],
          fgImages: [],
          gridImages: [],
          itemImages: [],
          assetLoadingStatus: 'Start Asset Loading...',
          resetInitContext: function () {
            console.log('Reset init context values.')
            this.showModal = false
            this.finalStatus = ''
          },
          calculateAndSetCharacterStartingPositionAndStepSizesResponsively: function () {
            this.character_starting_x_in_pixel = Math.round(this.canvasWidth * this.character_start_x_percentage)
            this.character_starting_y_in_pixel = Math.round(this.canvasHeight * this.character_start_y_percentage)
            this.step_width_in_pixel = Math.round(this.canvasWidth * this.step_x_percentage)
            this.step_height_in_pixel = Math.round(this.canvasHeight * this.step_y_percentage)
          },
          incrementImageLoadedCount: function (context, value) {
            context.imageLoadedCount += value
            if (context.imageLoadedCount === context.imageTotal) {
              context.imageLoadingCompleted = true
              console.log('Animation Image Loading Completed with ' + context.imageLoadedCount + ' images.')
            }
            console.log('Animation Loading Count: ' + context.imageLoadedCount)
          },
          setCanvasSizeByBackgroundImageSize: function () {
            let bgComponent = document.getElementById('background')
            this.canvasWidth = bgComponent.width
            this.canvasHeight = bgComponent.height
            console.log('Canvas size set as width = ' + this.canvasWidth + ' and height = ' + this.canvasHeight)
          },
          setAndGetMainCharacterCanvasContext: function () {
            const mainCharacterCanvas = document.getElementById('character')
            console.log('Set Main Character Canvas size as width = ' + this.canvasWidth + ' and height = ' + this.canvasHeight)
            let mainCharacterContext = mainCharacterCanvas.getContext('2d')
            mainCharacterCanvas.width = this.canvasWidth
            mainCharacterCanvas.height = this.canvasHeight
            return mainCharacterContext
          },
          drawMainCharacterAtStartingPosition: function (initContext, mainCharacterCanvasContext) {
            const cWidth = initContext.character_width_in_pixel
            const cHeight = initContext.character_height_in_pixel
            const cStartingX = Math.round(initContext.canvasWidth * initContext.character_start_x_percentage) + Math.round(initContext.step_width_in_pixel / 2) - Math.round(cWidth / 2)
            const cStartingY = Math.round(initContext.canvasHeight * initContext.character_start_y_percentage) - cHeight
            console.log('Draw main character at location: x = ' + cStartingX + ' and y = ' + cStartingY + ' image size: width = ' + cWidth + ' height = ' + cHeight)
            mainCharacterCanvasContext.drawImage(initContext.shadowImages[0], cStartingX, cStartingY, cWidth, cHeight)
            mainCharacterCanvasContext.drawImage(initContext.characterImages[0], cStartingX, cStartingY, cWidth, cHeight)
            // ctx.strokeRect(cStartingX, cStartingY, cWidth, cHeight)
          },
          setAndGetItemsCanvasContext: function () {
            const itemsCanvas = document.getElementById('items')
            console.log('Set Items Canvas size as width = ' + this.canvasWidth + ' and height = ' + this.canvasHeight)
            let itemsContext = itemsCanvas.getContext('2d')
            itemsCanvas.width = this.canvasWidth
            itemsCanvas.height = this.canvasHeight
            return itemsContext
          },
          drawFrontGround: function (initContext, itemsContext) {
            let fWidth = initContext.canvasWidth
            let fHeight = initContext.canvasHeight
            console.log('Draw front ground image with size width = ' + fWidth + ' height = ' + fHeight)
            itemsContext.drawImage(initContext.fgImages[0], 0, 0, fWidth, fHeight)
          },
          drawItems: function (initContext, itemsContext) {
            let items = initContext.items
            let dGridX = initContext.passCondition.destinationXGrid
            let dGridY = initContext.passCondition.destinationYGrid
            let gridWidth = initContext.step_width_in_pixel
            let gridHeight = initContext.step_height_in_pixel
            let gridStartX = Math.round(initContext.canvasWidth * initContext.grid_board_top_left_x_percentage)
            let gridStartY = Math.round(initContext.canvasHeight * initContext.grid_board_top_left_y_percentage)
            console.log('Background width = ' + initContext.canvasWidth + ' Background height = ' + initContext.canvasHeight + ' GridStartX: ' + gridStartX + ' GridStartY = ' + gridStartY + ' GridWidth = ' + gridWidth + ' GridHeight = ' + gridHeight)
            if (items.length > 0) {
              let checkValid = function (coordinates, xGridSize, yGridSize, dGridX, dGridY) {
                console.log('Check valid for map with Size : (' + xGridSize + ' , ' + yGridSize + ') and dX = ' + dGridX + ' dY = ' + dGridY)
                let xq = []
                let yq = []
                let xOffset = [1, -1, 0, 0]
                let yOffset = [0, 0, 1, -1]
                let visited = []
                xq.push(0)
                yq.push(0)
                visited.push('0_0')
                while (xq.length > 0) {
                  let curX = xq.shift()
                  let curY = yq.shift()
                  if (curX === dGridX && curY === dGridY) {
                    console.log('Map is valid: ' + ' x = ' + curX + ' y = ' + curY + ' dX = ' + dGridX + ' dY = ' + dGridY)
                    return true
                  } else {
                    for (let k = 0; k < 4; k++) {
                      let nX = curX + xOffset[k]
                      let nY = curY + yOffset[k]
                      if (nX >= 0 && nY >= 0 && nX < xGridSize && nY < yGridSize && visited.indexOf(nX + '_' + nY) === -1 && coordinates.indexOf(nX + '_' + nY) === -1) {
                        xq.push(nX)
                        yq.push(nY)
                        visited.push(nX + '_' + nY)
                      }
                    }
                  }
                }
                return false
              }

              for (let i = 0; i < items.length; i++) {
                let item = items[i]
                if (item.random === true) {
                  let iCount = item.count
                  let solvable = false
                  let xSize = initContext.grid_x_size
                  let ySize = initContext.grid_y_size
                  console.log('grid x size = ' + xSize + ' grid y size = ' + ySize + ' destination x = ' + dGridX + ' destination y = ' + dGridY)
                  while (!solvable) {
                    item.coordinates = []
                    let currentCount = 0
                    let rx = 0
                    let ry = 0
                    let key = ''
                    let rTrack = []
                    while (currentCount < iCount) {
                      rx = Math.floor(Math.random() * xSize)
                      ry = Math.floor(Math.random() * ySize)
                      key = rx + '_' + ry
                      if (key !== (dGridX + '_' + dGridY) && key !== '0_0' && rTrack.indexOf() === -1) {
                        item.coordinates.push({x: rx, y: ry, xOffset: 0, yOffset: 0})
                        rTrack.push(rx + '_' + ry)
                        currentCount++
                      }
                    }
                    if (checkValid(rTrack, xSize, ySize, dGridX, dGridY)) {
                      solvable = true
                    }
                  }
                }
                for (let j = 0; j < item.coordinates.length; j++) {
                  let position = item.coordinates[j]
                  let ix = Math.round(gridStartX + position.x * gridWidth) + position.xOffset
                  let iy = Math.round(gridStartY + position.y * gridHeight) + position.yOffset
                  console.log('Draw item ' + i + ' at gx = ' + position.x + ' gy = ' + position.y + ' x = ' + ix + ' y = ' + iy)
                  itemsContext.drawImage(initContext.itemImages[i], ix, iy, gridWidth, gridHeight)
                }
              }
            }
          },
          setAndGetGridBoardCanvasContext: function () {
            const gridBoardCanvas = document.getElementById('grid-board')
            console.log('Set Grid Board Canvas size as width = ' + this.canvasWidth + ' and height = ' + this.canvasHeight)
            gridBoardCanvas.width = this.canvasWidth
            gridBoardCanvas.height = this.canvasHeight
            return gridBoardCanvas.getContext('2d')
          },
          drawGridBoard: function (initContext, gridBoardContext) {
            let gridWidth = initContext.step_width_in_pixel
            let gridHeight = initContext.step_height_in_pixel
            let gridStartX = Math.round(initContext.canvasWidth * initContext.grid_board_top_left_x_percentage)
            let gridStartY = Math.round(initContext.canvasHeight * initContext.grid_board_top_left_y_percentage)
            let gridXSize = initContext.grid_x_size
            let gridYSize = initContext.grid_y_size
            console.log('Background width = ' + initContext.canvasWidth + ' Background height = ' + initContext.canvasHeight + ' GridStartX: ' + gridStartX + ' GridStartY = ' + gridStartY + ' GridWidth = ' + gridWidth + ' GridHeight = ' + gridHeight)
            console.log('Draw grid images.')
            for (let r = 0; r < gridYSize; r++) {
              for (let c = r % 2; c < gridXSize; c += 2) {
                let ix = Math.round(gridStartX + c * gridWidth)
                let iy = Math.round(gridStartY + r * gridHeight)
                console.log('Draw grid images at r = ' + r + ' c = ' + c + ' x = ' + ix + ' y = ' + iy)
                gridBoardContext.drawImage(initContext.gridImages[0], ix, iy, gridWidth, gridHeight)
              }
            }
          },
          loadImageStream: function (sprites, images) {
            for (let i = 0; i < sprites.length; i++) {
              let img = new Image()
              let initContext = this
              img.onload = function () {
                initContext.incrementImageLoadedCount(initContext, 1)
              }
              img.src = sprites[i]
              images.push(img)
            }
          },
          loadAllImages: function () {
            this.assetLoadingStatus = 'Loading Background Images...'
            this.loadImageStream(this.front_ground_sprites, this.fgImages)
            this.loadImageStream(this.grid_sprites, this.gridImages)
            this.loadImageStream(this.character_sprites, this.characterImages)
            this.loadImageStream(this.shadow_sprites, this.shadowImages)
            this.assetLoadingStatus = 'Loading Animation Images...'
            this.loadImageStream(this.walk_sprites, this.walkImages)
            this.loadImageStream(this.walk_backward_sprites, this.walkBackwardImages)
            this.loadImageStream(this.attack_sprites, this.attackImages)
            this.loadImageStream(this.attack_backward_sprites, this.attackBackwardImages)
            this.loadImageStream(this.victory_sprites, this.victoryImages)
            this.loadImageStream(this.victory_backward_sprites, this.victoryBackwardImages)
            this.loadImageStream(this.fail_sprites, this.failImages)
            this.loadImageStream(this.fail_backward_sprites, this.failBackwardImages)

            let itemSprites = []
            for (let i = 0; i < this.items.length; i++) {
              let item = this.items[i]
              itemSprites.push(item.image)
            }

            this.loadImageStream(itemSprites, this.itemImages)

            let initContext = this
            for (let i = 0; i < this.turn_left_sprites.length; i++) {
              let img = new Image()
              img.onload = function () {
                initContext.incrementImageLoadedCount(initContext, 1)
              }
              img.src = this.turn_left_sprites[i]
              this.turnLeftImages.push(img)
              this.turnRightImages.unshift(img)
            }
            this.assetLoadingStatus = 'Images Loading Completed.'
          },
          initLoading: function () {
            this.resetInitContext()

            this.setCanvasSizeByBackgroundImageSize()

            this.calculateAndSetCharacterStartingPositionAndStepSizesResponsively()

            this.loadAllImages()

            const itemsContext = this.setAndGetItemsCanvasContext()

            const mainCharacterContext = this.setAndGetMainCharacterCanvasContext()

            const gridBoardContext = this.setAndGetGridBoardCanvasContext()

            let drawGridBoard = this.drawGridBoard

            let drawMainCharacterAtStartingPosition = this.drawMainCharacterAtStartingPosition

            let drawItems = this.drawItems

            let drawFrontGround = this.drawFrontGround

            let initContext = this

            let drawIntervalId = setInterval(function () {
              if (initContext.imageLoadingCompleted) {
                console.log('All images loaded, start to draw the board.')

                drawGridBoard(initContext, gridBoardContext)

                drawMainCharacterAtStartingPosition(initContext, mainCharacterContext)

                drawItems(initContext, itemsContext)

                drawFrontGround(initContext, itemsContext)

                clearInterval(drawIntervalId)
              }
            }, 1000)
          }
        }
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        console.log('Mounted method called')
        this.initContext.initLoading()
      })
    },
    methods: {
      runAnimation () {
        let animationContext
        animationContext = this.initContext
        AnimationPlayer(animationContext)
      }
    }
  }
</script>

<style>
  .board {
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
  }

  .dev-block-flow-container {
    position: absolute;
    left: 0;
    top: 0;
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
    top: 0;
    width: 70%;
    height: 100%;
  }

  .animation-container-loading {
    position: absolute;
    left: 50%;
    top: 50%;
  }

  .animation-background {
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
  }

  .canvas {
    position: absolute;
    left: 0;
    top: 0;
  }

  .popup {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
</style>
