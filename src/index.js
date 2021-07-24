import TinyReact from "./TinyReact"

const root = document.getElementById("root")

const virtualDOM = (
  <div className="container">
    <h1>你好 Tiny React</h1>
    <span>这是一段内容</span>
    <br />xxx
    
    <h2 data-test="test">这个元素应该有data-test的attribute</h2>
    
    <div>
      嵌套1 <div>嵌套 1.1</div>
    </div>

    <h3>两秒后这个将会被改变…………</h3>
    <h3>两秒后这个将会被删除</h3>

    {2 == 1 && <div>这个不会被渲染</div>}
    {2 == 2 && <div>这个会被渲染</div>}

    <button onClick={() => alert("你好")}>你好</button><br />
  
    <input type="text" value="13" />
  </div>
)

const modifyDOM = (
  <div className="container">
    <h1>你好 Tiny React</h1>
    <span>这是一段内容</span>
    <br />xxx
    
    <h2 data-test="test">这个元素应该有data-test的attribute</h2>
    
    <div>
      嵌套1 <div>嵌套 1.1</div>
    </div>

    <h3>变变变变变变变变变</h3>

    {2 == 1 && <div>这个不会被渲染</div>}
    {2 == 2 && <div>这个会被渲染</div>}
    
    <button onClick={() => alert("你好")}>你好</button><br />
  
    <input type="text" />
  </div>
)

function Demo() {
  return <div>Hello</div>
}

function Heart(props) {
  return (
    <div>
      {props.title}
      &hearts; <Demo />
    </div>
  )
}

// TinyReact.render(<Heart title="Hello React" />, root)

class Alert extends TinyReact.Component {
  constructor(props) {
    super(props)
    this.state = {
      title: "Default Title"
    }
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick() {
    this.setState({ title: "Changed Title" })
  }
  componentWillReceiveProps(nextProps) {
    console.log("componentWillReceiveProps")
  }
  componentWillUpdate() {
    console.log("componentWillUpdate")
  }
  componentDidUpdate() {
    console.log("componentDidUpdate")
  }
  render() {
    return (
      <div>
        测试name，age：<br />
        {this.props.name}
        {this.props.age}

        <br /><br />
        <div>
          测试title和onclick：<br />
          {this.state.title}
          <button onClick={this.handleClick}>改变Title</button>
        </div>
      </div>
    )
  }
}

// TinyReact.render(<Alert name="张三" age={20} />, root)

// setTimeout(() => {
//   TinyReact.render(<Alert name="李四" age={50} />, root)
//   // TinyReact.render(<Heart title="我是Heart组件" />, root)
// }, 2000)

class DemoRef extends TinyReact.Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick() {
    // console.log(this.input.value)
    console.log(this.input)
    console.log(this.alert)
  }
  componentDidMount() {
    console.log("componentDidMount")
  }
  componentWillUnmount() {
    console.log("componentWillUnmount")
  }
  render() {
    return (
      <div>
        <button onClick={this.handleClick}>console lof refs (should show input and Alert component)</button><br /><br />
        <input type="text" ref={input => (this.input = input)} />
        <br /><br />
        Alert Component:
        <br /><br />
        <Alert ref={alert => (this.alert = alert)} name="张三" age={20} />
      </div>
    )
  }
}

// TinyReact.render(<DemoRef />, root)

class KeyDemo extends TinyReact.Component {
  constructor(props) {
    super(props)
    this.state = {
      persons: [
        {
          id: 1,
          name: "张1"
        },
        {
          id: 2,
          name: "李2"
        },
        {
          id: 3,
          name: "王3"
        },
        {
          id: 4,
          name: "赵4"
        }
      ]
    }
  }
  deleteLast = () => {
    const newState = JSON.parse(JSON.stringify(this.state))
    newState.persons.pop()
    this.setState(newState)
  }
  shift = () => {
    const newState = JSON.parse(JSON.stringify(this.state))
    newState.persons.push(newState.persons.shift())
    this.setState(newState)
  }
  add = () => {
    const newState = JSON.parse(JSON.stringify(this.state))
    newState.persons.splice(1, 0, { id: 100, name: "李100" })
    this.setState(newState)
  }
  addFirst = () => {
    const newState = JSON.parse(JSON.stringify(this.state))
    newState.persons.splice(0, 0, { id: -1, name: "孙第一" })
    this.setState(newState)
  }
  addLast = () => {
    const newState = JSON.parse(JSON.stringify(this.state))
    newState.persons.push({ id: 10000, name: "郑最后" })
    this.setState(newState)
  }
  render() {
    return (
      <div>
        <ul>
          {this.state.persons.map(person => (
            <li key={person.id}>
              {person.name}
            </li>
          ))}
        </ul>
        <button onClick={this.deleteLast}>删除最后一个</button>
        <button onClick={this.shift}>第一个放到最后一个</button>
        <button onClick={this.add}>添加</button>
        <button onClick={this.addFirst}>添加第一</button>
        <button onClick={this.addLast}>添加最后</button>
      </div>
    )
  }
}

const renderDemo = () => <Demo />
const renderHeart = () => <Heart title="Hello React" />
const renderAlert = () => <Alert name="张三" age={20} />
const renderDemoRef = () => <DemoRef />
const renderKeyDemo = () => <KeyDemo />

class Sandbox extends TinyReact.Component {
  constructor(props) {
    super(props);
    this.state = {
      renderComponent: renderDemo
    }
  }

  switchDemo = f => {
    this.setState({ renderComponent: f });
  }

  render() {
    console.log('render');
    return (
      <div className='Sandbox'>
        { this.state.renderComponent() }

        <br />
        <button onClick={() => this.switchDemo(renderDemo) }>demo</button>
        <button onClick={() => this.switchDemo(renderHeart) }>heart</button>
        <button onClick={() => this.switchDemo(renderAlert) }>alert</button>
        <button onClick={() => this.switchDemo(renderDemoRef) }>ref</button>
        <button onClick={() => this.switchDemo(renderKeyDemo) }>key</button>
      </div>
    )
  }
}


TinyReact.render(virtualDOM, root)

// setTimeout(() => {
//   TinyReact.render(modifyDOM, root)
// }, 2000)

setTimeout(() => {
  TinyReact.render(<Sandbox />, root)
}, 0)



