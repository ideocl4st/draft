import _ from '../../lib/utils'
import App from '../app'
let d = React.DOM

export default React.createClass({
  getInitialState() {
    return {
      messages: []
    }
  },
  componentDidMount() {
    this.refs.entry.getDOMNode().focus()
    App.on('hear', this.hear)
    App.on('chat', messages => this.setState({ messages }))
  },
  componentWillUnmount() {
    App.off('hear')
    App.off('chat')
  },
  render() {
    // must be mounted to receive messages
    let {hidden} = this.props
    return d.div({ hidden, id: 'chat' },
      d.div({ id: 'messages', ref: 'messages'},
        this.state.messages.map(this.Message)),
      this.Entry())
  },

  hear(msg) {
    this.state.messages.push(msg)
    this.forceUpdate(this.scrollChat)
  },
  scrollChat() {
    let el = this.refs.messages.getDOMNode()
    el.scrollTop = el.scrollHeight
  },
  Message(msg) {
    if (!msg)
      return

    let {time, name, text} = msg
    let date = new Date(time)
    let hours   = _.pad(2, '0', date.getHours())
    let minutes = _.pad(2, '0', date.getMinutes())
    time = `${hours}:${minutes}`

    return d.div({},
      d.time({}, time),
      ' ',
      d.span({ className: 'name' }, name),
      ' ',
      text)
  },

  Entry() {
    return d.input({
      ref: 'entry',
      onKeyDown: this.key,
      placeholder: '닉변은 /nick (이름)'
    })
  },

  key(e) {
    if (e.key !== 'Enter')
      return

    let el = e.target
    let text = el.value.trim()
    el.value = ''

    if (!text)
      return

    if (text[0] === '/')
      this.command(text.slice(1))
    else
      App.send('say', text)
  },

  command(raw) {
    let [, command, arg] = raw.match(/(\w*)\s*(.*)/)
    arg = arg.trim()
    let text

    switch(command) {
      case 'name':
      case 'nick':
        let name = arg.slice(0, 15)

        if (!name) {
          text = '이름을 입력하세요'
          break
        }

        text = `이제부터 당신의 이름은 ${name} 입니다.`
        App.save('name', name)
        App.send('name', name)
        break
      default:
        text = `지원하지 않는 명령어 입니다: ${command}`
    }

    this.state.messages.push({ text,
      time: Date.now(),
      name: ''
    })
    this.forceUpdate(this.scrollChat)
  }
})
