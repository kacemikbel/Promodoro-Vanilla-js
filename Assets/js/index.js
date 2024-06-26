const settingsBtn = document.querySelector('#settings-btn')
const settingsCloseBtn = document.querySelector('#settings-close-btn')
const settingsModal = document.querySelector('#settings-modal')
const timerDisplay = document.querySelector('.min-sec')
const startBtn = document.querySelector('#start')
const circleSvg = document.querySelector('.timer-path-elapsed')
const controlDiv = document.querySelector('.control')
const controlBtns = controlDiv.querySelectorAll('.btn')

console.log(controlBtns);

const root = document.querySelector(':root')


const fontPushster = getComputedStyle(root).getPropertyValue('--pushster-font').trim()
const fontOswald = getComputedStyle(root).getPropertyValue('--oswald-font').trim()
const fontLora = getComputedStyle(root).getPropertyValue('--lora-font').trim()


const pomodoroInput = document.querySelector('#pomodoro-input')
const shortInput = document.querySelector('#short-input')
const longInput = document.querySelector('#long-input')
const upPomodoro = document.querySelector('#upPomodoro')
const downPomodoro = document.querySelector('#downPomodoro')
const upShort = document.querySelector('#upShort')
const downShort = document.querySelector('#downShort')
const upLong = document.querySelector('#upLong')
const downLong = document.querySelector('#downLong')
const fontPickers = document.querySelectorAll('.font-picker')
const themeRed = document.querySelector('#primary-red')
const themeTeal = document.querySelector('#primary-teal')
const themePurple = document.querySelector('#primary-purple')
const colorSettings = document.getElementsByName('colors')
const settingsForm = document.querySelector('#settings-form')
const applyBtn = document.querySelector('#apply-btn')




function setMaxInputValue(input) {
  input.addEventListener('keyup', (e) => {
    if (e.target.value > 90) {
      input.value = 90
    }
  })
}

function increaseInputValue(input, button) {
  button.addEventListener('click', () => {
    if (input.value < 90) {
      return input.value++
    }
    return
  })
}

function decreaseInputValue(input, button) {
  button.addEventListener('click', () => {
    
    if (input.value > 0) {
      input.value--
    }
  })
}

function saveUserPreferences() {
    let data = {
        theme: '',
        font: '',
        pomodoroTime: Number(pomodoroInput.value * 60),
        shortBreakTime: Number(shortInput.value * 60),
        longBreakTime: Number(longInput.value * 60),
    }

    for (let i = 0; i < fontPickers.length; i++) {
        const element = fontPickers[i]
        if (element.checked) {
        if (element.value === 'pushster') {
            data.font = fontPushster
        }
        if (element.value === 'oswald') {
            data.font = fontOswald
        }
        if (element.value === 'lora') {
            data.font = fontLora
        }
        }
    }

    for (let i = 0; i < colorSettings.length; i++) {
        const element = colorSettings[i]
        if (element.checked) {
            data.theme = element.value
        }
    }

  
    localStorage.setItem('promodoro', JSON.stringify(data))
}

function getUserPreferences() {
  
  const saved = JSON.parse(localStorage.getItem('promodoro'))
    console.log(saved)
  if (saved !== null) {
    document.documentElement.style.setProperty('--set-theme-primary', saved.theme)

    document.documentElement.style.setProperty('--set-font-style', saved.font)
    renderTime(saved.pomodoroTime)
  } else {
   
    const defaultPreferences = {
      theme: '#f87070',
      font: 'Pushster, cursive',
      pomodoroTime: 1500,
      shortBreakTime: 300,
      longBreakTime: 600,
    }

    localStorage.setItem('promodoro', JSON.stringify(defaultPreferences))

   
    document.documentElement.style.setProperty('--set-theme-primary', defaultPreferences.theme)
    document.documentElement.style.setProperty('--set-font-style', defaultPreferences.font)
  }
}


const radius = circleSvg.r.baseVal.value
let circumference = radius * 2 * Math.PI
circleSvg.style.strokeDasharray = circumference

function setProgress(percent) {
  
  circleSvg.style.strokeDashoffset = circumference - (percent / 100) * circumference
}

function renderTime(seconds) {
  const minutes = Math.floor(seconds / 60)
  const secondsLeft = seconds % 60
  const adjustedSeconds = secondsLeft < 10 ? '0' : ''
  const display = `${minutes}:${adjustedSeconds}${secondsLeft}`
  timerDisplay.textContent = display
}



let countdown

function timer(seconds) {
  clearInterval(countdown)

  const now = Date.now()
  const then = now + seconds * 1000

  renderTime(seconds)

  countdown = setInterval(() => {
    const secondsLeft = Math.round((then - Date.now()) / 1000)

    if (secondsLeft < 0) {
      clearInterval(countdown)
      return
    }

    setProgress((secondsLeft / seconds) * 100)
    renderTime(secondsLeft)
  }, 1000)
}

function btnTimerControl(e) {
 
  clearInterval(countdown)
 
  const settingsObj = JSON.parse(localStorage.getItem('promodoro'))

  const current = document.querySelectorAll('.btn--active')

  
  if (current.length > 0) {
    current[0].className = current[0].className.replace(' btn--active', '')
  }

  e.target.classList.add('btn--active')

  if (current[0].id === 'pomodoro') {
    renderTime(settingsObj.pomodoroTime)
  } else if (current[0].id === 'short-break') {
    renderTime(settingsObj.shortBreakTime)
  } else if (current[0].id === 'long-break') {
    renderTime(settingsObj.longBreakTime)
  }
}




setMaxInputValue(pomodoroInput)
setMaxInputValue(shortInput)
setMaxInputValue(longInput)

increaseInputValue(pomodoroInput, upPomodoro)
increaseInputValue(shortInput, upShort)
increaseInputValue(longInput, upLong)


decreaseInputValue(pomodoroInput, downPomodoro)
decreaseInputValue(shortInput, downShort)
decreaseInputValue(longInput, downLong)


getUserPreferences()



settingsBtn.addEventListener('click', () => {
    settingsModal.classList.add('show-modal')
})


settingsCloseBtn.addEventListener('click', () => {
    settingsModal.classList.remove('show-modal')
})

window.addEventListener('click', (e) => {
    if (e.target === settingsModal) {
        settingsModal.classList.remove('show-modal')
    }
})


applyBtn.addEventListener('click', (e) => {
    settingsModal.classList.remove('show-modal')
})

controlBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        btnTimerControl(e)
    })
})

settingsForm.addEventListener('submit', (e) => {
    e.preventDefault()
    clearInterval(countdown)
    saveUserPreferences()
    getUserPreferences()
})


startBtn.addEventListener('click', (e) => {
    clearInterval(countdown)
    
    const settingsObj = JSON.parse(localStorage.getItem('promodoro'))

    const current = document.querySelectorAll('.btn--active')
  
    if (current[0].id === 'pomodoro') {
      renderTime(settingsObj.pomodoroTime)
      timer(settingsObj.pomodoroTime)
    } else if (current[0].id === 'short-break') {
      renderTime(settingsObj.shortBreakTime)
      timer(settingsObj.shortBreakTime)
    } else {
      renderTime(settingsObj.longBreakTime)
      timer(settingsObj.longBreakTime)
    }
})


settingsForm.addEventListener('submit', (e) => {
    e.preventDefault()
   
    clearInterval(countdown)

    
    saveUserPreferences()
    
    getUserPreferences()

    const settingsObj = JSON.parse(localStorage.getItem('promodoro'))

    const current = document.querySelectorAll('.btn--active')

    if (current[0].id === 'pomodoro') {
        renderTime(settingsObj.pomodoroTime)
    } else if (current[0].id === 'short-break') {
        renderTime(settingsObj.shortBreakTime)
    } else {
        renderTime(settingsObj.longBreakTime)
    }
})