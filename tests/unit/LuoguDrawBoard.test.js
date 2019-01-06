import { mount } from '@vue/test-utils'
import LuoguDrawBoard from 'src/components/LuoguDrawBoard.vue'

const generateWrapper = () => {
  return mount(LuoguDrawBoard, {
    propsData: {
      selectedColor: 0,
      name: 'lg-test',
      boardWidth: 200,
      boardHeight: 100,
      colors: ['#fff', '#333', '#000'],
      socketUrl: 'http://localhost:3003',
      postUrl: '/paint',
      boardUrl: '/board'
    }
  })
}

it('should transfer props success', () => {
  const wrapper = generateWrapper()
  expect(wrapper.props().name).toBe('lg-test')
  expect(wrapper.props().selectedColor).toBe(0)
  expect(wrapper.props().boardWidth).toBe(200)
  expect(wrapper.props().boardHeight).toBe(100)
  expect(wrapper.props().colors).toEqual(['#fff', '#333', '#000'])
  expect(wrapper.props().socketUrl).toBe('http://localhost:3003')
  expect(wrapper.props().postUrl).toBe('/paint')
  expect(wrapper.props().boardUrl).toBe('/board')
})

it('should set correct value', () => {
  const wrapper = generateWrapper()
  wrapper.vm.$emit('zoom', 10)
  expect(wrapper.emitted('zoom')).toBeTruthy()
  expect(wrapper.emitted().zoom.length).toEqual(1)
  expect(wrapper.emitted().zoom[0]).toEqual([10])
  expect(wrapper.vm.scale).toEqual(10)
})

it('should have correct data', () => {
  const wrapper = generateWrapper()
  expect(wrapper.vm.map).toBeInstanceOf(Array)
  expect(wrapper.vm.scale).toEqual(5)
})
