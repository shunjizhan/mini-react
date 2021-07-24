import mountElement from './mountElement';
import updateTextNode from './updateTextNode';
import updateNodeElement from './updateNodeElement';
import createDOMElement from './createDOMElement';
import unmountNode from './unmountNode';
import diffComponent from './diffComponent';

export default function diff(virtualDOM, container, oldDOM) {
  const oldVirtualDOM = oldDOM && oldDOM._virtualDOM;
  const oldComponent = oldVirtualDOM && oldVirtualDOM.component;

  if (!oldDOM) {                                                          // 1) 如果没有oldDOM，直接mount
    mountElement(virtualDOM, container);
  } else if (                                                             // 2) 如果节点类型不同，并且新节点的类型不是组件
    virtualDOM.type !== oldVirtualDOM.type &&
    typeof virtualDOM.type !== 'function'
  ) {
    // 不需要对比，直接使用新的 virtualDOM 对象生成真实 DOM 对象，替换旧的 DOM 对象
    const newElement = createDOMElement(virtualDOM);
    oldDOM.parentNode.replaceChild(newElement, oldDOM);
  } else if (typeof virtualDOM.type === 'function') {                     // 3) 新节点的类型是组件
    diffComponent(virtualDOM, oldComponent, oldDOM, container);
  } else if (oldVirtualDOM && virtualDOM.type === oldVirtualDOM.type) {   // 4) 新旧节点是同类型
    if (virtualDOM.type === 'text') {
      updateTextNode(virtualDOM, oldVirtualDOM, oldDOM);     // 更新text内容
    } else {
      updateNodeElement(oldDOM, virtualDOM, oldVirtualDOM);  // 更新元素节点属性
    }

    // 1. 将拥有key属性的子元素放置在一个单独的对象中
    let keyedElements = {};
    for (let i = 0, len = oldDOM.childNodes.length; i < len; i++) {
      let domElement = oldDOM.childNodes[i];
      if (domElement.nodeType === 1) {
        let key = domElement.getAttribute('key');
        if (key) {
          keyedElements[key] = domElement;
        }
      }
    }

    let hasNoKey = Object.keys(keyedElements).length === 0;

    if (hasNoKey) {
      // 对比子节点
      virtualDOM.children.forEach((child, i) => {
        diff(child, oldDOM, oldDOM.childNodes[i]);
      });
    } else {
      // 循环 virtualDOM 的子元素 获取子元素的 key 属性
      virtualDOM.children.forEach((child, i) => {
        let key = child.props.key;
        if (key) {
          let domElement = keyedElements[key];     // 对应的老元素element
          if (domElement) {
            // 看看当前位置的元素是不是我们期望的元素，如果是的话，什么都不用做，如果不是的话，插入新节点
            if (oldDOM.childNodes[i] && oldDOM.childNodes[i] !== domElement) {
              oldDOM.insertBefore(domElement, oldDOM.childNodes[i]);
            }
          } else {                    // 找不到对应的老元素element，说明当然元素是新增的，直接插入
            mountElement(child, oldDOM, oldDOM.childNodes[i], false);
          }
        }
      });
    }

    // 删除节点
    // 获取旧节点
    let oldChildNodes = oldDOM.childNodes;
    // 判断旧节点的数量
    if (oldChildNodes.length > virtualDOM.children.length) {
      if (hasNoKey) {
        // 有节点需要被删除
        for (
          let i = oldChildNodes.length - 1;
          i > virtualDOM.children.length - 1;
          i--
        ) {
          unmountNode(oldChildNodes[i]);
        }
      } else {
        // 通过key属性找到oldChildNodes里面被删除的节点
        for (let i = 0; i < oldChildNodes.length; i++) {
          let oldChild = oldChildNodes[i];
          let oldChildKey = oldChild._virtualDOM.props.key;
          let found = false;

          // 新节点里面没有这个key，就说明被删除了
          for (let n = 0; n < virtualDOM.children.length; n++) {
            if (oldChildKey === virtualDOM.children[n].props.key) {
              found = true;
              break;
            }
          }
          
          !found && unmountNode(oldChild);
        }
      }
    }
  }
}
