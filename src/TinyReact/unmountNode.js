export default function unmountNode(node) {
  const virtualDOM = node._virtualDOM

  // 文本节点可以直接删除
  if (virtualDOM.type === "text") {
    node.remove()
    return
  }

  // 判断节点是否是由组件生成的，如果 component 存在,就说明节点是由组件生成的
  // 如果是组件生成的，就调用生命周期
  let component = virtualDOM.component
  if (component) {
    component.componentWillUnmount()
  }

  // 如果有ref属性，移除ref
  const { props } = virtualDOM
  if (props && props.ref) {
    props.ref(null)
  }

  // 如果有事件属性，移除事件监听
  Object.keys(props).forEach(propName => {
    if (propName.slice(0, 2) === "on") {
      const eventName = propName.toLowerCase().slice(0, 2)
      const eventHandler = props[propName]
      node.removeEventListener(eventName, eventHandler)
    }
  })

  // 递归删除子节点
  if (node.childNodes.length > 0) {
    for (let i = 0; i < node.childNodes.length; i++) {
      unmountNode(node.childNodes[i])
      i--
    }
  }

  // 删除节点
  node.remove()
}