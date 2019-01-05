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
            @wheel="wheel"
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
        @click="zoom(1)"
      >
        全部显示
      </v-btn>
      <v-btn
        color="blue lighten-1"
        dark
        @click="zoom(5)"
      >
        放大5x
      </v-btn>
      <v-btn
        color="green lighten-1"
        dark
        @click="zoom(10)"
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
    return {
      name: 'lg-board',
      boardHeight, // default height
      boardWidth, // default width
      colors, // color items
      selected: 0, // selected color index
      scale: 5, // map scale
      map: undefined
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

  watch: {
    scale (val, oldVal) {
      if (val === oldVal) {
        return
      }
      this.$nextTick(() => {
        this.render(this.map, val)
      })
    }
  },

  async mounted () {
    // init map
    await axios.get('/board').then(res => {
      return dataConvertToMap(res.data)
    }).then(data => {
      this.map = data
      this.render(data) // init
    }).catch(e => console.error(e))

    const socket = SocketIO.connect('http://localhost:3003')
    socket.on('matrix_update', res => {
      const { x, y, color } = res
      this.updateMatrix(y, x, color)
    })
  },

  methods: {
    render (map, scale = 5) {
      const canvas = this.ref
      const ctx = canvas.getContext('2d')
      for (let i = 0; i < this.boardHeight; ++i) {
        for (let j = 0; j < this.boardWidth; ++j) {
          ctx.fillStyle = colors[map[i][j]].color
          ctx.fillRect(j * scale, i * scale, scale, scale)
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
      const color = this.colors[idx].color
      const scale = this.scale
      ctx.save()
      ctx.fillStyle = color
      ctx.fillRect(x * scale, y * scale, scale, scale)
    },

    zoom (ratio) {
      this.scale = ratio
    },

    wheel (e) {
      const scale = this.scale
      const delta = e.deltaY
      const convert = (delta, scale) => {
        if (delta > 0) {
          // increase
          return {
            10: 5,
            5: 1
          }[scale]
        } else {
          // decrease
          return {
            1: 5,
            5: 10
          }[scale]
        }
      }
      this.zoom(convert(delta, scale) || scale)
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
