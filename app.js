import Express from 'express'
import { Server } from 'http'
import { urlencoded as urlencodedParser } from 'body-parser'
import SocketIO from 'socket.io'
import path from 'path'

import { boardWidth, boardHeight } from './config'

const app = Express()
const http = Server(app)
const io = SocketIO(http)
app.use(urlencodedParser({ extended: true }))

const PaintBoardSizeX = boardWidth || 200
const PaintBoardSizeY = boardHeight || 100
const AllowedColors = [0, 1, 2]

let matrix = new Array(PaintBoardSizeY).fill(null).map(() => new Array(PaintBoardSizeX).fill(0))

app.get('/', (req, res) => res.sendFile(path.resolve(__dirname, 'dist', '/index.html')))

app.get('/board', (req, res) => res.send(matrix.map(column => column.map(x => `${x}`).join('')).join('\n')))

app.post('/paint', (req, res) => {
  const x = req.body.x
  const y = req.body.y
  const color = parseInt(req.body.color)
  if (!AllowedColors.includes(color) || x > PaintBoardSizeX || x < 0 || y > PaintBoardSizeY || y < 0) {
    res.status(400)
    res.json({ success: false, data: 'Invalid parameters' })
  }
  matrix[y][x] = color
  res.json({ success: true, data: null })
  io.emit('matrix_update', { x, y, color })
})

http.listen(3003, () => console.log('Listening on :3003'))
