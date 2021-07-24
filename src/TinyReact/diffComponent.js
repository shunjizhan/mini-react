import mountElement from './mountElement';
import updateComponent from './updateComponent';

export default function diffComponent(
  VDOM,
  oldComponent,
  oldDOM,
  container
) {
  if (isSameComponent(VDOM, oldComponent)) {      // 同一个组件 做组件更新操作
    updateComponent(VDOM, oldComponent, oldDOM, container);
  } else {                                        // 不是同一个组件，直接挂载新组件
    mountElement(VDOM, container, oldDOM);
  }
}
function isSameComponent(VDOM, oldComponent) {
  // oldComponent是class组件的实例对象
  return oldComponent && VDOM.type === oldComponent.constructor;
}
