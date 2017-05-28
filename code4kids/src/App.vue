import
<template>
  <div id="app">
    <app-play-board class="app-play-board"></app-play-board>
    <!--app-blocks class="app-blocks"></app-blocks>
    <app-flow-board class="app-flow-board"></app-flow-board-->
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
    left:0%;
    top:0%;
    width: 100%;
    height: 45%;
    display:inline-block;
    vertical-align:middle;
  }
  .app-blocks {
    position:absolute;
    left:0%;
    top:45%;
    width: 100%;
    height: 15%;
    display:inline-block;
    vertical-align:middle;
    background-color: lightblue;
  }
  .app-flow-board {
    position:absolute;
    left:0%;
    top:60%;
    width: 100%;
    height: 40%;
    display:inline-block;
    vertical-align:middle;
    background-color: floralwhite;
  }
</style>
