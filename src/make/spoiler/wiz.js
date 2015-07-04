let cheerio = require('cheerio')
let _ = require('../../_')

let $
let images = {}

function parse() {
  let $el = $(this)

  let name = _.ascii($el.attr('alt')).toLowerCase()
  let url = $el.attr('src')

//Uncomment for sets with Korean cards
  .replace('en', "kr")

  images[name] = url
}

module.exports = function (html) {
  $ = cheerio.load(html)
  $('div[align] img').each(parse)

  return images
}
