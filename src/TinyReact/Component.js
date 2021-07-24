import diff from "./diff"

export default class Component {
  constructor(props) {
    // 所以子类必须要super(props),不然拿不到props
    this.props = props
  }

  setState(state) {
    this.state = Object.assign({}, this.state, state)

    let newVDOM = this.render()     // 最新的要渲染的 newVDOM 对象
    let oldDOM = this.getDOM()      // 旧的 virtualDOM 对象 进行比对
    let container = oldDOM.parentNode

    diff(newVDOM, container, oldDOM)
  }

  setDOM(dom) {
    this._dom = dom
  }

  getDOM() {
    return this._dom
  }

  updateProps(props) {
    this.props = props
  }

  // 生命周期函数
  componentWillMount() {}
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {}
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps != this.props || nextState != this.state
  }
  componentWillUpdate(nextProps, nextState) {}
  componentDidUpdate(prevProps, preState) {}
  componentWillUnmount() {}
}
