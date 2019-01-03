import { convertMap } from 'src/utils/helpers'

it('should convert map', () => {
  let res =
    '11001\n' +
    '00000\n' +
    '11111\n' +
    '00000\n'
  const map = convertMap(res)
  expect(map[0][1]).toEqual(1)
  expect(map[2][0]).toEqual(1)
})
