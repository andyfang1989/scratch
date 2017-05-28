<template>
  <div id="play-board-component" class="board">
    <div id="dev-block-flow-container" class="dev-block-flow-container">
      <textarea class="dev-block-flow-text-area" v-model="instruction"
                placeholder="For development only, type in block json here." rows="10" cols="15">
      </textarea>
      <button>Run</button>
    </div>
    <div id="animation-container" class="animation-container">
        <img src="../assets/backgrounds/dog-park.png" class="animation-background">
        <img src="../assets/characters/doggy.gif" class="character">
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        instruction: ''
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
    position:absolute;
    left:0%;
    top:0%;
    z-index:-1;
    width: 100%;
    height: 100%;
  }

  .character {
    position:absolute;
    left:0%;
    top:0%;
    z-index:-1;
    width: 50px;
    height: 50px;
  }
</style>
