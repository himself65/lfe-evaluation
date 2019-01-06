<script>
import axios from 'axios'
import qs from 'qs'
import SocketIO from 'socket.io-client'
import VueDraggableResizable from 'vue-draggable-resizable'

import { convertToUnit, dataConvertToMap } from '../utils/helpers'

export default {
  name: 'LuoguDrawBoard',

  components: {
    VueDraggableResizable
  },

  model: {
    prop: 'selectedColor',
    event: 'zoom'
  },

  props: {
    selectedColor: {
      type: Number,
      required: true
    },

    name: {
      type: String,
      default: 'lg-board'
    },

    w: {
      type: Number,
      default: 800
    },

    h: {
      type: Number,
      default: 500
    },

    boardWidth: {
      type: Number,
      required: true
    },

    boardHeight: {
      type: Number,
      required: true
    },

    colors: {
      type: Array,
      required: true
    },

    socketUrl: {
      type: String,
      required: true
    },

    postUrl: {
      type: String,
      required: true
    },

    boardUrl: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      scale: 5,
      map: new Array(this.boardHeight).fill(null).map(() => new Array(this.boardWidth).fill(0))
    }
  },

  computed: {
    ref () {
      return this.$refs[this.name]
    },

    width () {
      return this.boardWidth * this.scale
    },

    height () {
      return this.boardHeight * this.scale
    },

    classes () {
      return {
        'lg-board': true
      }
    },

    styles () {
      return {
        'width': convertToUnit(this.w),
        'height': convertToUnit(this.h)
      }
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

  created () {
    this.$on('zoom', (scale) => {
      this.scale = parseInt(scale)
    })
  },

  async mounted () {
    await axios.get(this.boardUrl).then(res => {
      return dataConvertToMap(res.data)
    }).then(data => {
      this.map = data
      this.render(data)
    }).catch(e => console.error(e))

    const socket = SocketIO.connect(this.socketUrl)
    await socket.on('matrix_update', res => {
      const { x, y, color } = res
      this.updateMatrix(y, x, color)

      if (res.status === 200) {
        this.$emit('update', res)
      }
    })
  },

  methods: {
    render (map, scale = 5) {
      const canvas = this.ref
      const ctx = canvas.getContext('2d')
      for (let i = 0; i < this.boardHeight; ++i) {
        for (let j = 0; j < this.boardWidth; ++j) {
          ctx.fillStyle = this.colors[map[i][j]]
          ctx.fillRect(j * scale, i * scale, scale, scale)
        }
      }
    },

    async submit (e) {
      if (!this.colors[this.selectedColor]) {
        throw Error(`错误的颜色下标 ${this.selected}`)
      }
      const selected = this.selectedColor
      const { x, y } = this.getPixelPosition(e.offsetX, e.offsetY)
      const data = { x: x, y: y, color: selected }
      await axios.post('/paint', qs.stringify(data), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
    },

    updateMatrix (y, x, idx) {
      const canvas = this.ref
      const ctx = canvas.getContext('2d')
      const color = this.colors[idx]
      const scale = this.scale
      ctx.save()
      ctx.fillStyle = color
      this.map[y][x] = idx
      ctx.fillRect(x * scale, y * scale, scale, scale)
    },

    getPixelPosition (x, y) {
      const scale = this.scale
      return {
        x: parseInt(x / scale),
        y: parseInt(y / scale)
      }
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
      this.scale = convert(delta, scale) || scale
    }
  },

  render () {
    return (
      <div
        style={this.styles}
        class={this.classes}
      >
        <vue-draggable-resizable
          w={this.width}
          h={this.height}
          resizable={false}
        >
          <canvas
            ref={this.name}
            width={this.width}
            height={this.height}
            onClick={this.submit}
            onWheel={this.wheel}
          />
        </vue-draggable-resizable>
      </div>
    )
  }
}
</script>

<style lang="stylus" scoped>
  .lg-board {
    position: relative
    padding: auto
    overflow: auto
  }
</style>
