import setting from '../../setting'

export const startMenuInitValues = {
  'addr': 'ws://192.168.8.5:3003', // initilal value for exhibit network
  'movieId': '0',
  'codingVideo': '',
  'programmerVideo': '',
  'isTurned': false,
}

export const startMenuKeys = Object.keys(startMenuInitValues)

export const globalInitialState = Object.assign({}, startMenuInitValues, {
  isConnectionStarted: false,
  isConnectionEstablished: false,
  startTime: 0,
  stopTime: 9999,
  markerTime: 9999,
  currentTime: 0,
  isPaused: true,
  rule: {
    誰が: '*',
  },
})
