import
<template>
  <div id="app">
    <app-play-board class="app-play-board"></app-play-board>
    <app-blocks class="app-blocks"></app-blocks>
    <app-flow-board class="app-flow-board"></app-flow-board>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
  .app-play-board {
    position:absolute;
    left:30%;
    top:0%;
    width: 70%;
    height: 100%;
    display:inline-block;
    vertical-align:middle;
  }
  .app-blocks {
    position:absolute;
    left:0%;
    top:0%;
    width: 10%;
    height: 100%;
    display:inline-block;
    vertical-align:middle;
    background-color: lightblue;
  }
  .app-flow-board {
    position:absolute;
    left:10%;
    top:0%;
    width: 20%;
    height: 100%;
    display:inline-block;
    vertical-align:middle;
    background-color: floralwhite;
  }
</style>
