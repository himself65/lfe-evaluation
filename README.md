# lfe-evaluation-example

> `Vue.js` 实现[洛谷2019前端考核项目](https://github.com/luogu-dev/lfe-evaluation)

[![Build Status](https://www.travis-ci.com/Himself65/lfe-evaluation-example.svg?branch=master)](https://www.travis-ci.com/Himself65/lfe-evaluation-example)
[![License](https://img.shields.io/github/license/himself65/lfe-evaluation-example.svg)](htttps:://github.com/himself65/lfe-evaluation-example)
[![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/himself65/lfe-evaluation-example.svg)](htttps:://github.com/himself65/lfe-evaluation-example)
[![GitHub top language](https://img.shields.io/github/languages/top/himself65/lfe-evaluation-example.svg)](htttps:://github.com/himself65/lfe-evaluation-example)

## Usage

```bash
# 进入开发环境，包括后端环境
yarn dev
 
# 打包前端项目，输出在 /dist 下
yarn build

# 仅开启后端环境
yarn serve
```

## Docs

`LuoguDrawBoard.vue`

`props`:

  - `selectedColor`: **required** 用户选中颜色
  
  - `name` **default**: `lg-board` 画板的ID
  
  - `w` **default**: `800` 最大画板宽度
  
  - `h` **default**: `500` 最大画板高度
  
  - `boardWidth` **required**: 画板宽度
  
  - `boardHeight` **required**: 画板高度
  
  - `colors` **required** `type Array`: 下标对应的颜色
  
  - `socketUrl` **required**: socketIO 连接到的地址
  
  - `postUrl` **required**: 推送颜色更新的地址
  
  - `boardUrl` **required**: 获取画板信息的地址

`event`:
  
  - `zoom`: 画板缩放
  
  ```javascript
  this.refs['xxx'].emit('zoom', 10)
  ``` 
  
---

### Example

```vue
<luogu-draw-board
  v-model="selectedColor"
  :w="500"
  :h="300"
  :board-height="boardHeight"
  :board-width="boardWidth"
  :colors="colors"
  socket-url="http://localhost:3003"
  post-url="/paint"
  board-url="/board"
/>
```
```javascript
export default {
  data () {
    const colors = ['#000', '#fff', '#777']
    return {
      selectedColor: 0,
      boardHeight: 100,
      boardWidth: 200,
      colors
    }
  }
}
```

## LICENSE

Follow [Apache License 2.0](/LICENSE)
