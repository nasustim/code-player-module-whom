import {toCliSignal} from './index.js'
import { DrawerLayoutAndroid } from 'react-native'

function routeSignal ({setState, state, player, data}) {
  if (data.signal == toCliSignal.SET_PAUSE_POINT && data.movieId == state.movieId) {
    setState({
      isPaused: false,
      startTime: state.currentTime,
      stopTime: data.time,
    })
  } else if (data.signal == toCliSignal.SET_SEARCH_POINT && data.movieId == state.movieId) {
    setState({
      markerTime: data.time,
      startTime: state.currentTime,
      isPaused: false,
    })
  } else if (data.signal == toCliSignal.SEEK_INIT) {
    if (state.movieId != '9') {
      player.seek(0)
      setState({
        isPaused: true,
        stopTime: 980,
        markerTime: -1,
      })
    } else {
      setState({
        rule: {
          誰が: '*',
        },
      })
    }
  } else if (data.signal == toCliSignal.FILTER_EXPERIENCE && state.movieId == '9') {
    setState({
      rule: data.rule,
    })
  } else if (data.signal == toCliSignal.SET_SEEK_TIME && state.movieId != '9') {
    player.seek(data.time)
  }
}

export default routeSignal