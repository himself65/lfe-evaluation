<template>
  <v-layout column>
    <v-layout>
      <div
        id="lg-board"
        :style="size"
      >
        <canvas
          :ref="name"
          :style="styles"
          :width="boardWidth"
          :height="boardHeight"
          draggable="true"
          @mousedown="startDrag"
          @mouseleave="stopDrag"
          @click="submit"
          @wheel="wheel"
        />
      </div>
      <span class="log">
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
import SocketIO from 'socket.io-client'
import { convertMap } from '../utils/helpers'
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
  data () {
    return {
      name: 'lg-board',
      boardHeight,
      boardWidth,
      colors,
      selected: 0,
      scale: 5,
      top: 0,
      left: 0,
      map: [boardWidth].map(() => {
        return [boardHeight].fill(colors[0].color)
      }),
      dragged: false
    }
  },

  computed: {
    styles () {
      return {
        'top': `${this.top}px`,
        'left': `${this.left}px`
      }
    },

    size () {
      return {
        'width': `${this.boardWidth * 1.2}px`,
        'height': `${this.boardHeight * 1.2}px`
      }
    },

    ref () {
      return this.$refs[this.name]
    }
  },

  async mounted () {
    // init map
    await axios.get('/board').then(res => {
      this.render(convertMap(res.data)) // init
    }).catch(e => console.error(e))

    const socket = SocketIO.connect('http://localhost:3003')
    socket.on('matrix_update', res => {
      const { x, y, color } = res
      this.updateMatrix(y, x, color)
    })
  },

  methods: {
    render (map) {
      if (!Array.isArray(map) &&
          (typeof map === 'string' || map instanceof String)) {
        // not a Array
        // or is a string
        map = convertMap(map)
      }
      const canvas = this.ref
      const ctx = canvas.getContext('2d')
      const scale = this.scale
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
      const scale = this.scale
      const selected = this.selected
      const x = parseInt(e.offsetX / scale)
      const y = parseInt(e.offsetY / scale)
      const data = { x: x, y: y, color: selected }
      await axios.post('/paint', qs.stringify(data), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }).then(res => {
        console.log(res.data)
      })
    },

    startDrag () {
      // todo
    },

    stopDrag () {
      // todo
    },

    updateMatrix (y, x, idx) {
      if (this.dragged) {
        this.dragged = false
        return
      }
      const canvas = this.ref
      const ctx = canvas.getContext('2d')
      ctx.save()
      ctx.fillStyle = this.colors[idx].color
      ctx.fillRect(x * 5, y * 5, 5, 5)
    },

    zoom (ratio) {
      this.scale = ratio
      this.ref.width = this.boardWidth * this.scale
      if (ratio === 1) {
        this.top = this.left = 0
      }
    },

    wheel (e) {
      console.log(e)
      const scale = this.scale
      const delta = event.deltaY
      const y = parseInt(event.offsetY / scale)
      const x = parseInt(event.offsetX / scale)
      console.log(event)
      const convert = (delta, scale) => {
        if (delta > 0) {
          return {
            10: 5,
            5: 1
          }[scale]
        } else {
          return {
            1: 5,
            5: 10
          }[scale]
        }
      }
      this.zoom(convert(delta, scale) || scale)
      if (scale !== 1) {
        this.top = -y * scale + 200
        this.left = -x * scale + 400
      }
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
    height 2rem
    padding: .3rem
    border-radius: .5rem
    background-color: #3bb4f2
    color: #fff
  }
</style>
