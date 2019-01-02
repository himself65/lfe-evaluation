<template>
  <v-layout column>
    <v-layout>
      <canvas
        id="lg-board"
        :ref="name"
        :width="boardWidth"
        :height="boardHeight"
      />
      <p class="log">
        还剩10分钟
      </p>
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
            v-model="selected"
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
                    'background-color': item.color,
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
      >
        全部显示
      </v-btn>
      <v-btn
        color="blue lighten-1"
        dark
      >
        放大5x
      </v-btn>
      <v-btn
        color="green lighten-1"
        dark
      >
        放大10x
      </v-btn>
    </v-layout>
  </v-layout>
</template>

<script>
import SocketIO from 'socket.io-client'
import axios from 'axios'
import qs from 'qs'
import { boardWidth, boardHeight } from '../../config'

const colors = [
  { color: '#fff' },
  { color: '#777' },
  { color: '#000' }
]

export default {
  name: 'Board',
  data () {
    return {
      name: 'lg-board',
      boardHeight,
      boardWidth,
      colors,
      selected: -1
    }
  },

  mounted () {
    const board = this.$refs[this.name]
    board.addEventListener('click', async (e) => this.submit(e))

    const socket = SocketIO.connect('http://localhost:3003')
    socket.on('matrix_update', (res) => {
      const { x, y, color } = res
      this.updateMatrix(x, y, color)
    })
  },

  methods: {
    async submit (e) {
      if (this.selected === -1) {
        window.alert('请先选择颜色')
        return
      }
      const selected = this.selected
      const x = e.offsetX
      const y = e.offsetY
      const data = { x: x, y: y, color: selected }
      await axios.post('/paint', qs.stringify(data), {
        headers:
            { 'Content-Type': 'application/x-www-form-urlencoded' }
      }).then(res => {
        console.log(res.data)
      })
    },

    updateMatrix (x, y, color) {

    },

    zoom () {

    }
  }
}
</script>

<style lang="stylus" scoped>
  #lg-board {
    border: 1px solid
    margin: 1rem
    margin-left: 0
  }

  .palette {
    padding: .5rem
  }

  .functional {
    margin-top: 1rem
  }

  .log {
    height 2rem
    padding: .3rem
    border-radius: .5rem
    background-color: #3bb4f2
    color: #fff
  }
</style>
