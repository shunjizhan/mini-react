import isFunctionComponent from './isFunctionComponent';
import mountNativeElement from './mountNativeElement';
import isFunction from './isFunction';

export default function mountComponent(virtualDOM, container, oldDOM) {
  let nextVirtualDOM = null;
  let component = null;

  if (isFunctionComponent(virtualDOM)) {      // 函数组件
    nextVirtualDOM = buildFunctionComponent(virtualDOM);
  } else {                                    // 类组件
    nextVirtualDOM = buildClassComponent(virtualDOM);
    component = nextVirtualDOM.component;
  }

  if (isFunction(nextVirtualDOM)) {
    // 如果还是function,继续递归，直到拿到native element的时候
    mountComponent(nextVirtualDOM, container, oldDOM);
  } else {
    mountNativeElement(nextVirtualDOM, container, oldDOM);
  }

  // 处理生命周期和ref
  if (component) {
    component.componentDidMount();
    if (component.props && component.props.ref) {
      component.props.ref(component);
    }
  }
}

function buildFunctionComponent(virtualDOM) {
  // funtional component的VDOM的type就是它本身那个函数，返回的就是函数里面return的那些）
  // 所以可以直接call这个函数，并且把props作为参数直接传进去，非常简洁
  return virtualDOM.type(virtualDOM.props || {});
}

function buildClassComponent(virtualDOM) {
  // class component的VDOM的type就是它的class 函数，所以用new来创建
  // 然后代用render()返回它要render的VDOM
  const component = new virtualDOM.type(virtualDOM.props || {});
  const nextVirtualDOM = component.render();
  nextVirtualDOM.component = component;

  return nextVirtualDOM;
}
