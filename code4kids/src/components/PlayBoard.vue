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
    <div id="loading" class="animation-container" v-if="!initContext.imageLoadingCompleted">
      <h1>Loading</h1>
    </div>
    <div id="animation-container" class="animation-container" v-if="initContext.imageLoadingCompleted">
      <div id="animation-modal" class="popup">
        <app-modal v-if="initContext.showModal" @close="initContext.initLoading()">
          <h3 slot="body">{{initContext.finalStatus}}</h3>
        </app-modal>
      </div>
      <img id="background" :src="initContext.background_image" class="animation-background">
      <canvas id="grid-board" class="canvas" width="1000" height="800"></canvas>
      <canvas id="items" class="canvas" width="1000" height="800"></canvas>
      <canvas id="character" class="canvas" width="1000" height="800"></canvas>
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
          front_ground: 'static/images/knight/background/knight-fg.png',
          character_sprite: 'static/images/knight/walk/walk_0000.png',
          shadowSprite: 'static/images/knight/shadow/shadow.png',
          gridSprite: 'static/images/knight/background/grid.png',
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
          imageLoadingCompleted: true,
          imageTotal: 122,
          imageLoadedCount: 0,
          instructionDebugPrint: '',
          character_starting_x_in_pixel: 0, // This value will be initialized based on actual screen size
          character_starting_y_in_pixel: 0, // This value will be initialized based on actual screen size
          step_width_in_pixel: 100, // This value will be initialized based on actual screen size
          step_height_in_pixel: 100, // This value will be initialized based on actual screen size
          canvasWidth: 0,
          canvasHeight: 0,
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
          incrementImageLoadedCount: function (value) {
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
          drawMainCharacterAtStartingPosition: function (ctx) {
            const cWidth = this.character_width_in_pixel
            const cHeight = this.character_height_in_pixel
            const cStartingX = Math.round(this.canvasWidth * this.character_start_x_percentage) + Math.round(this.step_width_in_pixel / 2) - Math.round(cWidth / 2)
            const cStartingY = Math.round(this.canvasHeight * this.character_start_y_percentage) - cHeight
            let incrementImageLoadedCount = this.incrementImageLoadedCount
            const cImg = new Image()
            const shadowImg = new Image()
            cImg.onload = function () {
              console.log('Init loading: ' + cImg.src + ' at location: x = ' + cStartingX + ' and y = ' + cStartingY + ' image size: width = ' + cImg.width + ' height = ' + cImg.height)
              ctx.drawImage(shadowImg, cStartingX, cStartingY, cWidth, cHeight)
              ctx.drawImage(cImg, cStartingX, cStartingY, cWidth, cHeight)
              incrementImageLoadedCount(2)
              // ctx.strokeRect(cStartingX, cStartingY, cWidth, cHeight)
            }
            cImg.src = this.character_sprite
            shadowImg.src = this.shadowSprite
          },
          setAndGetItemsCanvasContext: function () {
            const itemsCanvas = document.getElementById('items')
            console.log('Set Items Canvas size as width = ' + this.canvasWidth + ' and height = ' + this.canvasHeight)
            let itemsContext = itemsCanvas.getContext('2d')
            itemsCanvas.width = this.canvasWidth
            itemsCanvas.height = this.canvasHeight
            return itemsContext
          },
          drawFrontGround: function (itemsContext) {
            let fImg = new Image()
            let incrementImageLoadedCount = this.incrementImageLoadedCount
            let fWidth = this.canvasWidth
            let fHeight = this.canvasHeight
            fImg.onload = function () {
              console.log('Draw front ground image with size width = ' + fWidth + ' height = ' + fHeight)
              itemsContext.drawImage(fImg, 0, 0, fWidth, fHeight)
              incrementImageLoadedCount(1)
            }
            fImg.src = this.front_ground
          },
          drawItems: function (itemsContext) {
            let items = this.items
            let dGridX = this.passCondition.destinationXGrid
            let dGridY = this.passCondition.destinationYGrid
            let gridWidth = this.step_width_in_pixel
            let gridHeight = this.step_height_in_pixel
            let gridStartX = Math.round(this.canvasWidth * this.grid_board_top_left_x_percentage)
            let gridStartY = Math.round(this.canvasHeight * this.grid_board_top_left_y_percentage)
            console.log('Background width = ' + this.canvasWidth + ' Background height = ' + this.canvasHeight + ' GridStartX: ' + gridStartX + ' GridStartY = ' + gridStartY + ' GridWidth = ' + gridWidth + ' GridHeight = ' + gridHeight)
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
                let iImg = new Image()
                if (item.random === true) {
                  let iCount = item.count
                  let solvable = false
                  let xSize = this.grid_x_size
                  let ySize = this.grid_y_size
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
                let incrementImageLoadedCount = this.incrementImageLoadedCount
                iImg.onload = function () {
                  for (let j = 0; j < item.coordinates.length; j++) {
                    let position = item.coordinates[j]
                    let ix = Math.round(gridStartX + position.x * gridWidth) + position.xOffset
                    let iy = Math.round(gridStartY + position.y * gridHeight) + position.yOffset
                    console.log('Draw item ' + i + ' at gx = ' + position.x + ' gy = ' + position.y + ' x = ' + ix + ' y = ' + iy)
                    itemsContext.drawImage(iImg, ix, iy, gridWidth, gridHeight)
                  }
                  incrementImageLoadedCount(1)
                }
                console.log('Item image: ' + item.image)
                iImg.src = item.image
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
          drawGridBoard: function (gridBoardContext) {
            let gridWidth = this.step_width_in_pixel
            let gridHeight = this.step_height_in_pixel
            let gridStartX = Math.round(this.canvasWidth * this.grid_board_top_left_x_percentage)
            let gridStartY = Math.round(this.canvasHeight * this.grid_board_top_left_y_percentage)
            let gridXSize = this.grid_x_size
            let gridYSize = this.grid_y_size
            let gridImage = new Image()
            let incrementImageLoadedCount = this.incrementImageLoadedCount
            console.log('Background width = ' + this.canvasWidth + ' Background height = ' + this.canvasHeight + ' GridStartX: ' + gridStartX + ' GridStartY = ' + gridStartY + ' GridWidth = ' + gridWidth + ' GridHeight = ' + gridHeight)
            gridImage.onload = function () {
              console.log('Draw grid images.')
              for (let r = 0; r < gridYSize; r++) {
                for (let c = r % 2; c < gridXSize; c += 2) {
                  let ix = Math.round(gridStartX + c * gridWidth)
                  let iy = Math.round(gridStartY + r * gridHeight)
                  console.log('Draw grid images at r = ' + r + ' c = ' + c + ' x = ' + ix + ' y = ' + iy)
                  gridBoardContext.drawImage(gridImage, ix, iy, gridWidth, gridHeight)
                }
              }
              incrementImageLoadedCount(1)
            }
            gridImage.src = this.gridSprite
          },
          initLoading: function () {
            this.resetInitContext()

            this.setCanvasSizeByBackgroundImageSize()

            let mainCharacterContext = this.setAndGetMainCharacterCanvasContext()

            this.calculateAndSetCharacterStartingPositionAndStepSizesResponsively()

            const gridBoardContext = this.setAndGetGridBoardCanvasContext()

            this.drawGridBoard(gridBoardContext)

            this.drawMainCharacterAtStartingPosition(mainCharacterContext)

            let itemsContext = this.setAndGetItemsCanvasContext()

            this.drawItems(itemsContext)

            this.drawFrontGround(itemsContext)
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
