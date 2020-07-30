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
