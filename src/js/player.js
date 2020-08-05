export const player = () => {
  const songUrl = 'images/bigcityboi.mp3'
  const song = new Audio()
  const control = document.querySelector('.control')

  song.src = songUrl
  song.muted = false
  // song.autoplay = true
  song.loop = true

  control.addEventListener('click', () => {
    control.classList.remove('play')
    control.classList.remove('pause')

    song.paused ? control.classList.add('pause') : control.classList.add('play')
    song.paused ? song.play() : song.pause()
  })
}

export const text = () => {
  const headline = document.querySelector("h1")

  const string = headline.innerText

  headline.dataset.text = string.length
  let spaned = ''
  for (let i = 0; i < string.length; i++) {
    spaned += (string.substring(i, i + 1) === ' ')
      ? string.substring(i, i + 1)
      : `<span style="animation-delay: ${(i + 1) * .05}s">${string.substring(i, i + 1)}</span>`
    }

    headline.innerHTML = spaned
}
