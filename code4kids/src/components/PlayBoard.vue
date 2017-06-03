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
      <p>{{ initContext.result }}</p>
    </div>
    <div id="animation-container" class="animation-container">
      <img id="background" :src="initContext.background_image" class="animation-background">
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
          ],
          initLoading: function () {
            let ctx
            const background = document.getElementById('background')
            const mainCharacterCanvas = document.getElementById('character')
            console.log('Set canvas size as width = ' + background.width + ' and height = ' + background.height)
            mainCharacterCanvas.width = background.width
            mainCharacterCanvas.height = background.height
            ctx = mainCharacterCanvas.getContext('2d')
            const cImg = new Image()
            const shadowImg = new Image()
            const w = this.cWidth
            const h = this.cHeight
            const cx = this.startX
            const cy = this.startY
            const cScale = this.cScale
            cImg.onload = function () {
              console.log('Init loading: ' + cImg.src + ' at location: x = ' + cx + ' and y = ' + cy + ' image size: width = ' + cImg.width + ' height = ' + cImg.height)
              ctx.drawImage(shadowImg, cx, cy, w * cScale, h * cScale)
              ctx.drawImage(cImg, cx, cy, w * cScale, h * cScale)
            }
            cImg.src = this.cSprite
            shadowImg.src = this.shadowSprite
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
</style>
