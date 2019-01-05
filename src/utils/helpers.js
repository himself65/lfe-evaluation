import forEach from 'lodash/forEach'

export function dataConvertToMap (map) {
  const res = []
  map.trim().split('\n').forEach((v, k) => {
    res[k] = []
    forEach(v, (o, idx) => {
      res[k][idx] = parseInt(o, 36)
    })
  })
  return res
}

export function convertToUnit (str, unit = 'px') {
  if (str == null || str === '') {
    return undefined
  } else if (isNaN(str)) {
    return String(str)
  } else if (str < 0) {
    return undefined
  } else {
    return `${Number(str)}${unit}`
  }
}
