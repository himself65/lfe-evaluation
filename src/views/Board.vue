<template>
  <v-layout column>
    <v-layout>
      <luogu-draw-board
        v-model="selectedColor"
        :board-height="boardHeight"
        :board-width="boardWidth"
        :colors="colors"
        socket-url="http://localhost:3003"
        post-url="/paint"
        board-url="/board"
      />
      <span class="log white--text">
        还剩10分钟
      </span>
    </v-layout>
    <v-layout>
      <div
        class="palette"
        style="background-color: #7f7f7f"
      >
        <v-layout
          fill-height
          align-center
        >
          <v-item-group
            v-model="selectedColor"
            mandatory
          >
            <v-layout>
              <v-item
                v-for="(item, idx) in colors"
                :key="idx"
              >
                <v-card
                  slot-scope="{ active, toggle }"
                  :style="{
                    'background-color': item,
                    'border-radio': '3px',
                    'margin': '.5rem',
                    'border': '.2rem solid',
                    'borderColor': active ? '#DAA520' : 'transparent'
                  }"
                  width="30"
                  height="30"
                  @click.native="toggle"
                />
              </v-item>
            </v-layout>
          </v-item-group>
        </v-layout>
      </div>
    </v-layout>
    <v-layout class="functional">
      <v-btn
        color="blue darken-1"
        dark
        @click="selectedColor = 1"
      >
        全部显示
      </v-btn>
      <v-btn
        color="blue lighten-1"
        dark
        @click="selectedColor = 5"
      >
        放大5x
      </v-btn>
      <v-btn
        color="green lighten-1"
        dark
        @click="selectedColor = 10"
      >
        放大10x
      </v-btn>
    </v-layout>
  </v-layout>
</template>

<script>
import { boardWidth, boardHeight } from '../../config'
import LuoguDrawBoard from '../components/LuoguDrawBoard'

const colors = ['#000', '#fff', '#777']
export default {
  name: 'Board',
  components: { LuoguDrawBoard },
  data () {
    return {
      boardWidth,
      boardHeight,
      colors,
      selectedColor: 0
    }
  }
}
</script>

<style lang="stylus" scoped>
  .palette {
    padding: .5rem
  }

  .functional {
    margin-top: 1rem
  }

  .log {
    margin-left: .5rem
    height: 2rem
    padding: .3rem
    border-radius: .5rem
    background-color: #3bb4f2
    color: #fff
  }
</style>
