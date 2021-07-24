import createDOMElement from "./createDOMElement"
import unmountNode from "./unmountNode"

export default function mountNativeElement(VDOM, container, oldDOM, remove=true) {
  let newElement = createDOMElement(VDOM)
  // 将转换之后的DOM对象放置在页面中
  if (oldDOM) {
    container.insertBefore(newElement, oldDOM)
  } else {
    container.appendChild(newElement)
  }

  // 判断旧的DOM对象是否存在 如果存在 删除
  if (remove && oldDOM) {
    unmountNode(oldDOM)
  }

  // 如果类组件实例对象存在，将DOM对象存储在类组件实例对象中
  let component = VDOM.component
  component && component.setDOM(newElement)
}
