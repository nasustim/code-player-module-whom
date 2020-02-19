import setting from '../../setting'

export const startMenuInitValues = {
  'addr': 'ws://192.168.0.10:3003',
  'movieId': 'unset',
  'codingVideo': '',
  'programmerVideo': '',
  'isShowCodingVideoHistory': false,
  'isShowProgrammerVideoHistory': false,
  'isShowURIHistory': false,
  'history': {
    'codingVideo': [],
    'programmerVideo': [],
    'addr': []
  }
}

export const startMenuKeys = Object.keys(startMenuInitValues)

export const globalInitialState = {
  addr: 'ws://192.168.8.10:3003', // initilal value for exhibit network
  isConnectionStarted: false,
  isConnectionEstablished: setting.env !== 'production',
  movieId: setting.env === 'production' ? '' : '0',
  startTime: 0,
  stopTime: -1,
  markerTime: -1,
  currentTime: 0,
  isPaused: setting.env === 'production',
  rule: {
    誰が: '*',
  },
  isSteppable: true,
  programmerVideo: '',
  codingVideo: '',
}
