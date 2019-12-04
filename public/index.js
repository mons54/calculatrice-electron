function init () {
  if (result !== null) {
    setAns()
  }
  result = null
  started = false
  paranthese = 0
  screenStart.innerHTML = 0
  remove.innerHTML = "CE"
}

function encode (str) {
  let buf = []
	for (let i = str.length - 1; i >= 0; i--) {
		buf.unshift(['&#', str[i].charCodeAt(), ';'].join(''))
	}
  return buf.join('')
}

function setAns() {
  screenLast.innerHTML = 'Ans = ' + result
}

function addToScreenStart (value, isSymbol = false) {
  if (result) {
    remove.innerHTML = "CE"
    setAns()
  }
  if (!started) {
    if (!isSymbol)
      screenStart.innerHTML = null
    started = true
  }

  if (lastIsSymbol())
    value = addSpace(value)

  screenStart.innerHTML += value
}

function addToScreenEnd (value) {
  screenEnd.innerHTML += value
}

function addSpace (str) {
  return ' ' + str
}

function removeToScreenStart () {
  let length = -1
  if (lastIsSymbol())
    length = -2
  screenStart.innerHTML = screenStart.innerHTML.slice(0, length).trim()
}

function removeToScreenEnd () {
  screenEnd.innerHTML = screenEnd.innerHTML.slice(0, -1).trim()
}

function isSymbol (char) {
  return ['&#247;', '&#215;', '&#45;', '&#43;'].indexOf(char) !== -1
}

function isParenthese (char) {
  return char === '&#40;'
}

function getLast () {
  let last = encode(screenStart.innerHTML.substr(-1))
  if (last === ' ')
    last = encode(screenStart.innerHTML.substr(-2, 1))
  return last
}

function lastIsParenthese () {
  return isParenthese(getLast())
}

function lastIsPoint () {
  return getLast() === '&#46;'
}

function lastIsSymbol () {
  const last = getLast()
  if (last === '&#45;' && (isSymbol(encode(screenStart.innerHTML.substr(-3, 1))) || isParenthese(encode(screenStart.innerHTML.substr(-2, 1)))))
    return false
  return isSymbol(last)
}

function lastIsLess () {
  return !lastIsSymbol() && getLast() === '&#45;'
}

const screenLast = document.querySelector('[data-screen-last]')
const screenStart = document.querySelector('[data-screen-start]')
const screenEnd = document.querySelector('[data-screen-end]')
const remove = document.querySelector('[data-paranthese-remove]')

let started, pOpen, symbol, less, point, result = null

init()

document.querySelector('[data-result]').addEventListener('click', function () {
  const value = (screenStart.innerHTML + screenEnd.innerHTML).
  replace(/÷/gi, '/').
  replace(/×/gi, '*').
  replace(/%/gi, '/100')

  try {
    result = eval(value)
    screenLast.innerHTML = value + ' ='
    screenStart.innerHTML = result
    screenEnd.innerHTML = null
    if (result === 0) {
      init()
    } else {
      remove.innerHTML = "AC"
    }
  } catch (e) {}
})

document.querySelectorAll('[data-number]').forEach((element) => {
  element.addEventListener('click', function () {
    let value = encode(this.dataset.number)
    addToScreenStart(value)
  })
})

document.querySelectorAll('[data-symbol]').forEach((element) => {
  element.addEventListener('click', function () {
    let value = encode(this.dataset.symbol)
    const isLess = value === '&#45;'
    if (less || lastIsLess() || (lastIsParenthese() && !isLess))
      return

    if (isLess && (!started || lastIsParenthese() || lastIsSymbol())) {
      addToScreenStart(value)
      return
    }

    value = addSpace(value)

    if (lastIsSymbol())
      removeToScreenStart()

    addToScreenStart(value, true)
  })
})

document.querySelector('[data-point]').addEventListener('click', function () {
  const data = screenStart.innerHTML.split(' ')
  if (encode(data[data.length - 1]).includes('&#46;'))
    return
  addToScreenStart('&#46;')
  paranthese++
})

document.querySelector('[data-paranthese-open]').addEventListener('click', function () {
  if (lastIsParenthese() || lastIsLess() || (!lastIsSymbol() && started)) return
  addToScreenStart('&#40;')
  addToScreenEnd('&#41;')
  paranthese++
})

document.querySelector('[data-paranthese-close]').addEventListener('click', function () {
  if (!paranthese || lastIsParenthese() || lastIsSymbol() || lastIsLess()) return
  addToScreenStart('&#41;')
  removeToScreenEnd()
  paranthese--

})

document.querySelector('[data-paranthese-percent]').addEventListener('click', function () {
  if (lastIsParenthese() || lastIsSymbol() || lastIsLess()) return
  started = true
  addToScreenStart('&#37;')
})

remove.addEventListener('click', function () {

  if (result) {
    return init()
  }

  if (lastIsParenthese()) {
    screenEnd.innerHTML = screenEnd.innerHTML.slice(0, -1)
    paranthese--
  }

  const last = getLast()

  removeToScreenStart()

  if (last === '&#41;') {
    addToScreenEnd('&#41;')
    paranthese++
  }

  const length = screenStart.innerHTML.length

  if (length === 0 || (length === 1 && getLast() === '&#48;'))
    init()
})
