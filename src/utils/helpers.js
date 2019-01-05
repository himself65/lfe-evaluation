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
