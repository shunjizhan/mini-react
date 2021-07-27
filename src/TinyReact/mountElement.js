import mountNativeElement from './mountNativeElement';
import mountComponent from './mountComponent';
import { isFunction } from './utils';

export default function mountElement(virtualDOM, container, oldDOM, remove=true) {
  if (isFunction(virtualDOM)) {
    mountComponent(virtualDOM, container, oldDOM);
  } else {
    mountNativeElement(virtualDOM, container, oldDOM, remove);
  }
}
