import App from '../app'
import {BASICS, Zones} from '../cards'
import {RBox} from './checkbox'
let d = React.DOM

function Lands() {
  let colors = ['White', 'Blue', 'Black', 'Red', 'Green']
  let symbols = colors.map(x =>
    d.td({},
      d.img({ src: `http://www.wizards.com/Magic/redesign/${x}_Mana.png` })))

  let [main, side] = ['main', 'side'].map(zoneName => {
    let inputs = BASICS.map(cardName =>
      d.td({},
        d.input({
          min: 0,
          onChange: App._emit('land', zoneName, cardName),
          type: 'number',
          value: Zones[zoneName][cardName] || 0
        })))

    return d.tr({},
      d.td({}, zoneName),
      inputs)
  })

  return d.table({},
    d.tr({},
      d.td(),
      symbols),
    main,
    side)
}

function Sort() {
  return d.div({},
    ['cmc', 'color', 'type', 'rarity'].map(sort =>
      d.button({
        disabled: sort === App.state.sort,
        onClick: App._save('sort', sort)
      }, sort)))
}

function Download() {
  let filetypes = ['cod', 'json', 'mwdeck', 'txt'].map(filetype =>
    d.option({}, filetype))
  let select = d.select({ valueLink: App.link('filetype') }, filetypes)

  return d.div({},
    d.button({ onClick: App._emit('download') }, '다운로드'),
    d.input({ placeholder: '파일명', valueLink: App.link('filename') }),
    select)
}

export default React.createClass({
  render() {
    return d.div({ id: 'settings' },
      RBox('chat', '채팅'),
      Lands(),
      Download(),
      this.Copy(),
      this.Side(),
      RBox('beep', '새 팩이 오면 소리로 알림'),
      RBox('cols', '뽑은 카드 이름 및 발동비용만 보기 (MTGO식)'),
      Sort())
  },
  SideCB(e) {
    let side = e.target.checked
    App.save('side', side)
    App.emit('side')
  },
  Side() {
    return d.div({},
      d.label({},
        '카드를 사이드보드에 넣기 ',
        d.input({
          checked: App.state.side,
          onChange: this.SideCB,
          type: 'checkbox'
        })))
  },
  Copy() {
    return d.div({},
      d.textarea({
        placeholder: '덱 리스트',
        ref: 'decklist',
        readOnly: true
      }),
      d.button({
        onClick: App._emit('copy', this.refs.decklist)
      }, '복사') 
      )
  }
})
