<template>
  <div id="play-board-component" class="board">
    <div id="dev-block-flow-container" class="dev-block-flow-container">
      <textarea id='instructionArea' class="dev-block-flow-text-area" rows="10" cols="15">
      </textarea>
      <button v-on:click="runAnimation">Run</button>
      <button onclick="addBlocksBoard()">Add blocks board</button>
      <button onclick="updateInstruction()">Update instructions</button>
    </div>
    <div id="animation-container" class="animation-container">
      <div id="animation-modal" class="popup">
        <app-modal v-if="initContext.showModal" @close="initContext.initLoading()">
          <h3 slot="body">{{initContext.finalStatus}}</h3>
        </app-modal>
      </div>
      <div v-for="bImage in initContext.background_images" class="animation-background">
        <img id="background" :src="bImage" class="animation-background">
      </div>
      <canvas id="items" class="canvas" width="1000" height="800"></canvas>
      <canvas id="character" class="canvas" width="1000" height="800"></canvas>
    </div>
    <div id='blocklyDiv' class="block-flow-and-drop-area"></div>
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
          start_x: 0,
          start_y: 0,
          step_x: 100,
          step_y: 100,
          grid_x: 10,
          grid_y: 5,
          character_start_ratio_x: 0,
          character_start_ratio_y: 0.66,
          grid_start_ratio_x: 0,
          grid_start_ratio_y: 0.53,
          image_stream_size: 49,
          step_ratio_x: 0.1,
          step_ratio_y: 0.077,
          actionInterval: 500,
          elapse_time: 1000,
          cWidth: 300,
          cHeight: 300,
          cScale: 1,
          run_speed: 400,
          walk_speed: 800,
          attack_speed: 300,
          turn_speed: 300,
          victory_speed: 1000,
          fail_speed: 1000,
          debug_mode: false,
          background_images: [
            '../../static/images/knight/background/knight-bg1.jpg',
            '../../static/images/knight/background/knight-bg2.png'
          ],
          front_ground: 'static/images/knight/background/knight-fg.png',
          cSprite: 'static/images/knight/walk/walk_0000.png',
          shadowSprite: 'static/images/knight/shadow/shadow.png',
          destinationSprite: 'static/images/knight/background/destination.png',
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
          victory_sprites: [
            'static/images/knight/victory/victory_0000.png',
            'static/images/knight/victory/victory_0001.png',
            'static/images/knight/victory/victory_0002.png',
            'static/images/knight/victory/victory_0003.png',
            'static/images/knight/victory/victory_0004.png',
            'static/images/knight/victory/victory_0005.png',
            'static/images/knight/victory/victory_0006.png',
            'static/images/knight/victory/victory_0007.png',
            'static/images/knight/victory/victory_0008.png',
            'static/images/knight/victory/victory_0009.png',
            'static/images/knight/victory/victory_0010.png',
            'static/images/knight/victory/victory_0011.png',
            'static/images/knight/victory/victory_0012.png',
            'static/images/knight/victory/victory_0013.png',
            'static/images/knight/victory/victory_0014.png',
            'static/images/knight/victory/victory_0015.png',
            'static/images/knight/victory/victory_0016.png',
            'static/images/knight/victory/victory_0017.png',
            'static/images/knight/victory/victory_0018.png',
            'static/images/knight/victory/victory_0019.png',
            'static/images/knight/victory/victory_0020.png',
            'static/images/knight/victory/victory_0021.png',
            'static/images/knight/victory/victory_0022.png',
            'static/images/knight/victory/victory_0023.png',
            'static/images/knight/victory/victory_0024.png',
            'static/images/knight/victory/victory_0025.png',
            'static/images/knight/victory/victory_0026.png',
            'static/images/knight/victory/victory_0027.png',
            'static/images/knight/victory/victory_0028.png',
            'static/images/knight/victory/victory_0029.png',
            'static/images/knight/victory/victory_0030.png',
            'static/images/knight/victory/victory_0031.png',
            'static/images/knight/victory/victory_0032.png',
            'static/images/knight/victory/victory_0033.png',
            'static/images/knight/victory/victory_0034.png',
            'static/images/knight/victory/victory_0035.png',
            'static/images/knight/victory/victory_0036.png',
            'static/images/knight/victory/victory_0037.png',
            'static/images/knight/victory/victory_0038.png',
            'static/images/knight/victory/victory_0039.png',
            'static/images/knight/victory/victory_0040.png',
            'static/images/knight/victory/victory_0041.png',
            'static/images/knight/victory/victory_0042.png',
            'static/images/knight/victory/victory_0043.png',
            'static/images/knight/victory/victory_0044.png',
            'static/images/knight/victory/victory_0045.png',
            'static/images/knight/victory/victory_0046.png',
            'static/images/knight/victory/victory_0047.png',
            'static/images/knight/victory/victory_0048.png'
          ],
          victory_backward_sprites: [
            'static/images/knight/victory-backward/victory-backward_0000.png',
            'static/images/knight/victory-backward/victory-backward_0001.png',
            'static/images/knight/victory-backward/victory-backward_0002.png',
            'static/images/knight/victory-backward/victory-backward_0003.png',
            'static/images/knight/victory-backward/victory-backward_0004.png',
            'static/images/knight/victory-backward/victory-backward_0005.png',
            'static/images/knight/victory-backward/victory-backward_0006.png',
            'static/images/knight/victory-backward/victory-backward_0007.png',
            'static/images/knight/victory-backward/victory-backward_0008.png',
            'static/images/knight/victory-backward/victory-backward_0009.png',
            'static/images/knight/victory-backward/victory-backward_0010.png',
            'static/images/knight/victory-backward/victory-backward_0011.png',
            'static/images/knight/victory-backward/victory-backward_0012.png',
            'static/images/knight/victory-backward/victory-backward_0013.png',
            'static/images/knight/victory-backward/victory-backward_0014.png',
            'static/images/knight/victory-backward/victory-backward_0015.png',
            'static/images/knight/victory-backward/victory-backward_0016.png',
            'static/images/knight/victory-backward/victory-backward_0017.png',
            'static/images/knight/victory-backward/victory-backward_0018.png',
            'static/images/knight/victory-backward/victory-backward_0019.png',
            'static/images/knight/victory-backward/victory-backward_0020.png',
            'static/images/knight/victory-backward/victory-backward_0021.png',
            'static/images/knight/victory-backward/victory-backward_0022.png',
            'static/images/knight/victory-backward/victory-backward_0023.png',
            'static/images/knight/victory-backward/victory-backward_0024.png',
            'static/images/knight/victory-backward/victory-backward_0025.png',
            'static/images/knight/victory-backward/victory-backward_0026.png',
            'static/images/knight/victory-backward/victory-backward_0027.png',
            'static/images/knight/victory-backward/victory-backward_0028.png',
            'static/images/knight/victory-backward/victory-backward_0029.png',
            'static/images/knight/victory-backward/victory-backward_0030.png',
            'static/images/knight/victory-backward/victory-backward_0031.png',
            'static/images/knight/victory-backward/victory-backward_0032.png',
            'static/images/knight/victory-backward/victory-backward_0033.png',
            'static/images/knight/victory-backward/victory-backward_0034.png',
            'static/images/knight/victory-backward/victory-backward_0035.png',
            'static/images/knight/victory-backward/victory-backward_0036.png',
            'static/images/knight/victory-backward/victory-backward_0037.png',
            'static/images/knight/victory-backward/victory-backward_0038.png',
            'static/images/knight/victory-backward/victory-backward_0039.png',
            'static/images/knight/victory-backward/victory-backward_0040.png',
            'static/images/knight/victory-backward/victory-backward_0041.png',
            'static/images/knight/victory-backward/victory-backward_0042.png',
            'static/images/knight/victory-backward/victory-backward_0043.png',
            'static/images/knight/victory-backward/victory-backward_0044.png',
            'static/images/knight/victory-backward/victory-backward_0045.png',
            'static/images/knight/victory-backward/victory-backward_0046.png',
            'static/images/knight/victory-backward/victory-backward_0047.png',
            'static/images/knight/victory-backward/victory-backward_0048.png'
          ],
          fail_sprites: [
            'static/images/knight/fail/fail_0000.png',
            'static/images/knight/fail/fail_0001.png',
            'static/images/knight/fail/fail_0002.png',
            'static/images/knight/fail/fail_0003.png',
            'static/images/knight/fail/fail_0004.png',
            'static/images/knight/fail/fail_0005.png',
            'static/images/knight/fail/fail_0006.png',
            'static/images/knight/fail/fail_0007.png',
            'static/images/knight/fail/fail_0008.png',
            'static/images/knight/fail/fail_0009.png',
            'static/images/knight/fail/fail_0010.png',
            'static/images/knight/fail/fail_0011.png',
            'static/images/knight/fail/fail_0012.png',
            'static/images/knight/fail/fail_0013.png',
            'static/images/knight/fail/fail_0014.png',
            'static/images/knight/fail/fail_0015.png',
            'static/images/knight/fail/fail_0016.png',
            'static/images/knight/fail/fail_0017.png',
            'static/images/knight/fail/fail_0018.png',
            'static/images/knight/fail/fail_0019.png',
            'static/images/knight/fail/fail_0020.png',
            'static/images/knight/fail/fail_0021.png',
            'static/images/knight/fail/fail_0022.png',
            'static/images/knight/fail/fail_0023.png',
            'static/images/knight/fail/fail_0024.png',
            'static/images/knight/fail/fail_0025.png',
            'static/images/knight/fail/fail_0026.png',
            'static/images/knight/fail/fail_0027.png',
            'static/images/knight/fail/fail_0028.png',
            'static/images/knight/fail/fail_0029.png',
            'static/images/knight/fail/fail_0030.png',
            'static/images/knight/fail/fail_0031.png',
            'static/images/knight/fail/fail_0032.png',
            'static/images/knight/fail/fail_0033.png',
            'static/images/knight/fail/fail_0034.png',
            'static/images/knight/fail/fail_0035.png',
            'static/images/knight/fail/fail_0036.png',
            'static/images/knight/fail/fail_0037.png',
            'static/images/knight/fail/fail_0038.png',
            'static/images/knight/fail/fail_0039.png',
            'static/images/knight/fail/fail_0040.png',
            'static/images/knight/fail/fail_0041.png',
            'static/images/knight/fail/fail_0042.png',
            'static/images/knight/fail/fail_0043.png',
            'static/images/knight/fail/fail_0044.png',
            'static/images/knight/fail/fail_0045.png',
            'static/images/knight/fail/fail_0046.png',
            'static/images/knight/fail/fail_0047.png',
            'static/images/knight/fail/fail_0048.png'
          ],
          fail_backward_sprites: [
            'static/images/knight/fail-backward/fail-backward_0000.png',
            'static/images/knight/fail-backward/fail-backward_0001.png',
            'static/images/knight/fail-backward/fail-backward_0002.png',
            'static/images/knight/fail-backward/fail-backward_0003.png',
            'static/images/knight/fail-backward/fail-backward_0004.png',
            'static/images/knight/fail-backward/fail-backward_0005.png',
            'static/images/knight/fail-backward/fail-backward_0006.png',
            'static/images/knight/fail-backward/fail-backward_0007.png',
            'static/images/knight/fail-backward/fail-backward_0008.png',
            'static/images/knight/fail-backward/fail-backward_0009.png',
            'static/images/knight/fail-backward/fail-backward_0010.png',
            'static/images/knight/fail-backward/fail-backward_0011.png',
            'static/images/knight/fail-backward/fail-backward_0012.png',
            'static/images/knight/fail-backward/fail-backward_0013.png',
            'static/images/knight/fail-backward/fail-backward_0014.png',
            'static/images/knight/fail-backward/fail-backward_0015.png',
            'static/images/knight/fail-backward/fail-backward_0016.png',
            'static/images/knight/fail-backward/fail-backward_0017.png',
            'static/images/knight/fail-backward/fail-backward_0018.png',
            'static/images/knight/fail-backward/fail-backward_0019.png',
            'static/images/knight/fail-backward/fail-backward_0020.png',
            'static/images/knight/fail-backward/fail-backward_0021.png',
            'static/images/knight/fail-backward/fail-backward_0022.png',
            'static/images/knight/fail-backward/fail-backward_0023.png',
            'static/images/knight/fail-backward/fail-backward_0024.png',
            'static/images/knight/fail-backward/fail-backward_0025.png',
            'static/images/knight/fail-backward/fail-backward_0026.png',
            'static/images/knight/fail-backward/fail-backward_0027.png',
            'static/images/knight/fail-backward/fail-backward_0028.png',
            'static/images/knight/fail-backward/fail-backward_0029.png',
            'static/images/knight/fail-backward/fail-backward_0030.png',
            'static/images/knight/fail-backward/fail-backward_0031.png',
            'static/images/knight/fail-backward/fail-backward_0032.png',
            'static/images/knight/fail-backward/fail-backward_0033.png',
            'static/images/knight/fail-backward/fail-backward_0034.png',
            'static/images/knight/fail-backward/fail-backward_0035.png',
            'static/images/knight/fail-backward/fail-backward_0036.png',
            'static/images/knight/fail-backward/fail-backward_0037.png',
            'static/images/knight/fail-backward/fail-backward_0038.png',
            'static/images/knight/fail-backward/fail-backward_0039.png',
            'static/images/knight/fail-backward/fail-backward_0040.png',
            'static/images/knight/fail-backward/fail-backward_0041.png',
            'static/images/knight/fail-backward/fail-backward_0042.png',
            'static/images/knight/fail-backward/fail-backward_0043.png',
            'static/images/knight/fail-backward/fail-backward_0044.png',
            'static/images/knight/fail-backward/fail-backward_0045.png',
            'static/images/knight/fail-backward/fail-backward_0046.png',
            'static/images/knight/fail-backward/fail-backward_0047.png',
            'static/images/knight/fail-backward/fail-backward_0048.png'
          ],
          items: [
            {
              image: '/static/images/knight/background/stone.png',
              count: 30,
              random: true,
              scale: 1,
              coordinates: [],
              blocker: true
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
          initLoading: function () {
            this.showModal = false
            this.finalStatus = ''
            let ctx
            const background = document.getElementById('background')
            const mainCharacterCanvas = document.getElementById('character')
            console.log('Set canvas size as width = ' + background.width + ' and height = ' + background.height)
            mainCharacterCanvas.width = background.width
            mainCharacterCanvas.height = background.width
            ctx = mainCharacterCanvas.getContext('2d')
            const cImg = new Image()
            const shadowImg = new Image()
            const w = this.cWidth
            const h = this.cHeight
            this.step_x = Math.round(background.width * this.step_ratio_x)
            this.step_y = Math.round(background.height * this.step_ratio_y)
            const cx = Math.round(background.width * this.character_start_ratio_x) + Math.round(this.step_x / 2) - Math.round(w / 2)
            const cy = Math.round(background.height * this.character_start_ratio_y) - h
            const cScale = this.cScale
            this.start_x = Math.round(background.width * this.character_start_ratio_x)
            this.start_y = Math.round(background.height * this.character_start_ratio_y)
            cImg.onload = function () {
              console.log('Init loading: ' + cImg.src + ' at location: x = ' + cx + ' and y = ' + cy + ' image size: width = ' + cImg.width + ' height = ' + cImg.height)
              ctx.drawImage(shadowImg, cx, cy, w * cScale, h * cScale)
              ctx.drawImage(cImg, cx, cy, w * cScale, h * cScale)
              // ctx.strokeRect(cx, cy, w * cScale, h * cScale)
            }
            cImg.src = this.cSprite
            shadowImg.src = this.shadowSprite
            let items = this.items
            let dX = this.passCondition.destinationXGrid
            let dY = this.passCondition.destinationYGrid
            let gw = this.step_x
            let gh = this.step_y
            let gridStartX = Math.round(background.width * this.grid_start_ratio_x)
            let gridStartY = Math.round(background.height * this.grid_start_ratio_y)
            if (items.length > 0) {
              const itemsCanvas = document.getElementById('items')
              let itemsContext = itemsCanvas.getContext('2d')
              itemsCanvas.width = background.width
              itemsCanvas.height = background.width

              var checkValid = function (coordinates, xSize, ySize, dX, dY) {
                console.log('Check valid for map with Size : (' + xSize + ' , ' + ySize + ') and dX = ' + dX + ' dY = ' + dY)
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
                  if (curX === dX && curY === dY) {
                    console.log('Map is valid: ' + ' x = ' + curX + ' y = ' + curY + ' dX = ' + dX + ' dY = ' + dY)
                    return true
                  } else {
                    for (let k = 0; k < 4; k++) {
                      let nX = curX + xOffset[k]
                      let nY = curY + yOffset[k]
                      if (nX >= 0 && nY >= 0 && nX < xSize && nY < ySize && visited.indexOf(nX + '_' + nY) === -1 && coordinates.indexOf(nX + '_' + nY) === -1) {
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
                let iScale = item.scale
                if (item.random === true) {
                  let iCount = item.count
                  let solvable = false
                  let xSize = this.grid_x
                  let ySize = this.grid_y
                  console.log('grid x size = ' + xSize + ' grid y size = ' + ySize + ' destination x = ' + dX + ' destination y = ' + dY)
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
                      if (key !== (dX + '_' + dY) && key !== '0_0' && rTrack.indexOf() === -1) {
                        item.coordinates.push({x: rx, y: ry})
                        rTrack.push(rx + '_' + ry)
                        currentCount++
                      }
                    }
                    if (checkValid(rTrack, xSize, ySize, dX, dY)) {
                      solvable = true
                    }
                  }
                }
                iImg.onload = function () {
                  console.log('Locations to draw item: ' + item.coordinates.length + ' items.')
                  for (let j = 0; j < item.coordinates.length; j++) {
                    let position = item.coordinates[j]
                    let ix = Math.round(gridStartX + position.x * gw)
                    let iy = Math.round(gridStartY + position.y * gh)
                    console.log('px = ' + position.x + ' py = ' + position.y + ' x = ' + ix + ' y = ' + iy)
                    itemsContext.drawImage(iImg, ix, iy, gw * iScale, gh * iScale)
                  }
                }
                console.log('Item image: ' + item.image)
                iImg.src = item.image
              }

              let dImg = new Image()
              dImg.onload = function () {
                let dx = Math.round(gridStartX + dX * gw)
                let dy = Math.round(gridStartY + dY * gh)
                itemsContext.drawImage(dImg, dx, dy, gw, gh)
              }
              dImg.src = this.destinationSprite

              let fImg = new Image()
              fImg.onload = function () {
                itemsContext.drawImage(fImg, 0, 0, background.width, background.height)
              }
              fImg.src = this.front_ground
            }
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
        this.initContext.instruction = document.getElementById('instructionArea').innerHTML
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
    width: 15%;
  }

  .dev-block-flow-text-area {
    width: 100%;
    height: 80%;
  }

  .animation-container {
    position: absolute;
    left: 15%;
    top: 0;
    width: 85%;
    height: 70%;
  }
  .block-flow-and-drop-area {
    position: absolute;
    left: 15%;
    top: 80%;
    width: 85%;
    height: 30%
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
