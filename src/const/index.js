import setting from '../../setting'

export const startMenuInitValues = {
  'addr': 'ws://192.168.8.10:3003', // initilal value for exhibit network
  'movieId': '',
  'codingVideo': '',
  'programmerVideo': '',
}

export const startMenuKeys = Object.keys(startMenuInitValues)

export const globalInitialState = Object({}, startMenuInitValues, {
  isConnectionStarted: false,
  isConnectionEstablished: false,
  startTime: 0,
  stopTime: -1,
  markerTime: -1,
  currentTime: 0,
  isPaused: true,
  rule: {
    誰が: '*',
  },
})
