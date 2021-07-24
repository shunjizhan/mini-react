import diff from './diff';

export default function updateComponent(
  VDOM,
  oldComponent,
  oldDOM,
  container
) {
  oldComponent.componentWillReceiveProps(VDOM.props);
  if (oldComponent.shouldComponentUpdate(VDOM.props)) {
    let prevProps = oldComponent.props;

    oldComponent.componentWillUpdate(VDOM.props);
    oldComponent.updateProps(VDOM.props);
    let nextVDOM = oldComponent.render();
    nextVDOM.component = oldComponent;

    diff(nextVDOM, container, oldDOM);
    oldComponent.componentDidUpdate(prevProps);
  }
}
