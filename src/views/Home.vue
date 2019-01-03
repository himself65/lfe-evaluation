<template>
  <v-app>
    <v-toolbar>
      <v-toolbar-title>洛谷冬日绘板</v-toolbar-title>
    </v-toolbar>
    <v-container>
      <h1>
        绘板
      </h1>
      <Board />
    </v-container>
  </v-app>
</template>

<script>
import Board from './Board'

export default {
  name: 'Home',
  components: {
    Board
  }
}
</script>

<style scoped>

</style>
