import _ from '../../lib/utils'
import App from '../app'
import data from '../data'
//import Chat from './chat'
let d = React.DOM

export default React.createClass({
  componentDidMount() {
    App.send('join', 'lobby')
  },
  render() {
    return d.div({},
      //Chat(),
      d.h1({}, 'drafts.in 비공식 한글 버전'),
      d.div({},
        d.small({}, '생성된 로비는 2시간 이후 자동 폭파됩니다.')),
      d.div({},
        d.small({}, '채팅은 생성된 로비 내부에서만 가능합니다.')),      
      d.div({},
        d.small({}, '봇은 인공지능이 없다시피 하니 드랩하실때 참고하시기 바랍니다.')),      
      d.p({ className: 'error' }, App.err),
      Create(),
      d.footer({},
        d.div({},
          d.a({ className: 'icon ion-social-github', href: 'https://github.com/ideocl4st/draft' })),
          //d.a({ className: 'icon ion-social-twitter', href: 'https://twitter.com/aeosynth' }),
          //d.a({ className: 'icon ion-android-mail', href: 'mailto:james.r.campos@gmail.com' })),
        d.div({},
          d.small({}, 'Forked from https://github.com/aeosynth/draft')),
        d.div({},
          d.small({}, 'unaffiliated with wizards of the coast'))))
  }
})

function Sets(selectedSet, index) {
  let groups = []
  for (let label in data) {
    let sets = data[label]
    let options = []
    for (let name in sets) {
      let code = sets[name]
      options.push(d.option({ value: code }, name))
    }
    groups.push(d.optgroup({ label }, options))
  }
  return d.select({
    valueLink: App.link('sets', index)
  }, groups)
}

function content() {
  let sets = App.state.sets.map(Sets)
  let setsTop = d.div({}, sets.slice(0, 3))
  let setsBot = d.div({}, sets.slice(3))

  let cube = [
    d.div({}, '한줄당 한장의 카드를 영문으로 입력하여 주세요.'),
    d.textarea({
      placeholder: '큐브 목록',
      valueLink: App.link('list')
    })
  ]

  let cards = _.seq(15, 8).map(x => d.option({}, x))
  let packs = _.seq( 7, 3).map(x => d.option({}, x))
  let cubeDraft = d.div({},
    d.select({ valueLink: App.link('cards') }, cards),
    '장의 ',
    d.select({ valueLink: App.link('packs') }, packs),
    '팩')

  switch(App.state.type) {
    case 'draft' : return setsTop
    case 'sealed': return [setsTop, setsBot]
    case 'cube draft' : return [cube, cubeDraft]
    case 'cube sealed': return cube
    case 'editor': return d.a({ href: 'http://editor.drafts.in' }, 'editor')
  }
}

function Create() {
  let seats = _.seq(8, 2).map(x =>
    d.option({}, x))

  let types = ['draft', 'sealed', 'cube draft', 'cube sealed', 'editor']
    .map(type =>
      d.button({
        disabled: type === App.state.type,
        onClick: App._save('type', type)
      }, type))

  return d.div({},
    d.div({},
      '이벤트 참가 인원 : ',
      d.select({ valueLink: App.link('seats') }, seats)),
      d.button({ onClick: App._emit('create') }, '로비 생성'),
    d.div({}, types),
    content())
}
