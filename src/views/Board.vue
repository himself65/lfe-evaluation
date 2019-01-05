<template>
  <v-layout column>
    <v-layout>
      <div
        id="lg-board"
        :style="styles"
      >
        <vue-draggable-resizable
          :w="width"
          :h="height"
          :resizable="false"
        >
          <canvas
            :ref="name"
            :width="width"
            :height="height"
            @click="submit"
          />
        </vue-draggable-resizable>
      </div>
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
        @click="scale = 1"
      >
        全部显示
      </v-btn>
      <v-btn
        color="blue lighten-1"
        dark
        @click="scale = 5"
      >
        放大5x
      </v-btn>
      <v-btn
        color="green lighten-1"
        dark
        @click="scale = 10"
      >
        放大10x
      </v-btn>
    </v-layout>
  </v-layout>
</template>

<script>
import VueDraggableResizable from 'vue-draggable-resizable'
import SocketIO from 'socket.io-client'
import { dataConvertToMap } from '../utils/helpers'
import axios from 'axios'
import qs from 'qs'
import { boardWidth, boardHeight } from '../../config'

const colors = [
  { color: '#000' },
  { color: '#fff' },
  { color: '#777' }
]

export default {
  name: 'Board',

  components: {
    VueDraggableResizable
  },

  data () {
    const map = [boardWidth].map(() => {
      return [boardHeight].fill(colors[0].color)
    })

    return {
      name: 'lg-board',
      boardHeight, // default height
      boardWidth, // default width
      colors, // color items
      selected: 0, // selected color index
      scale: 5, // map scale
      map: map
    }
  },

  computed: {
    ref () {
      return this.$refs[this.name]
    },

    styles () {
      return {
        'position': 'relative',
        'width': `800px`,
        'height': `500px`
      }
    },

    width () {
      return this.boardWidth * this.scale
    },

    height () {
      return this.boardHeight * this.scale
    }
  },

  async mounted () {
    // init map
    await axios.get('/board').then(res => {
      return dataConvertToMap(res.data)
    }).then(data => {
      this.render(data) // init
    }).catch(e => console.error(e))

    const socket = SocketIO.connect('http://localhost:3003')
    socket.on('matrix_update', res => {
      const { x, y, color } = res
      console.log(`get ${x} ${y} draw ${color}`)
      this.updateMatrix(y, x, color)
    })
  },

  methods: {
    render (map) {
      const canvas = this.ref
      const ctx = canvas.getContext('2d')
      for (let i = 0; i < this.boardHeight; ++i) {
        for (let j = 0; j < this.boardWidth; ++j) {
          ctx.fillStyle = colors[map[i][j]].color
          ctx.fillRect(j * 5, i * 5, 5, 5)
        }
      }
    },

    async submit (e) {
      if (!this.colors[this.selected]) {
        window.alert('请先选择颜色')
        return
      }
      const selected = this.selected
      const { x, y } = this.getPixelPosition(e.offsetX, e.offsetY)
      console.log(e.offsetX, e.offsetY, x, y)
      const data = { x: x, y: y, color: selected }
      await axios.post('/paint', qs.stringify(data), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
    },

    getPixelPosition (x, y) {
      const scale = this.scale
      return {
        x: parseInt(x / scale),
        y: parseInt(y / scale)
      }
    },

    updateMatrix (y, x, idx) {
      const canvas = this.ref
      const ctx = canvas.getContext('2d')
      console.log(`draw ${x} ${y}, size 5`)
      ctx.save()
      ctx.fillStyle = this.colors[idx].color
      ctx.fillRect(x * 5, y * 5, 5, 5)
    }
  }
}
</script>

<style lang="stylus" scoped>
  #lg-board {
    padding: auto
    overflow: auto
  }

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
