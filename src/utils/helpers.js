export function dataConvertToMap (map) {
  const res = []
  map.trim().split('\n').forEach((v, k) => {
    res[k] = new Proxy({ value: v }, {
      get (target, p) {
        const val = target.value[p]
        return parseInt(val, 36)
      }
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
