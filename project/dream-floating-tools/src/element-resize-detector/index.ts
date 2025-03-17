// 元素调整大小检测器
import ElementResizeDetectorMaker from 'element-resize-detector'

/* 
创建实例
*/
const erd = ElementResizeDetectorMaker({
  // 使用基于超快速滚动的方法 这是推荐的策略
  strategy: 'scroll',
  // callOnAdd选项，用于确定在添加侦听器时是否应调用它们。默认为true。
  // 如果为true，则确保在添加侦听器后将对其进行调用。
  // 如果为false，则在添加侦听器时将不保证其被调用（不会阻止其被调用）
  callOnAdd: true,
  // 调试模式
  debug: false
})

// 导出该实例
export default erd
