import {Alert} from 'react-native'
import {toCliSignal} from './index.js'

function routeSignal ({setState, state, player, data}) {
  switch (data.signal){
    case toCliSignal.SET_PAUSE_POINT:
      if(state.movieId === data.movieId){
        setState({
          isPaused: false,
          startTime: state.currentTime,
          stopTime: data.time,
        })
      }
      break
    case toCliSignal.SET_SEARCH_POINT:
      if(state.movieId === data.movieId){
        setState({
          isPaused: false,
          startTime: state.currentTime,
          markerTime: data.time,
        })
      }else if(state.movieId === '9'){
        setState({
          rule: data.rule,
        })
      }
      break
    case toCliSignal.SEEK_INIT:
      if(state.movieId !== '9'){
        setState({
          isPaused: true,
          currentTime: 0,
          startTime: 0,
          markerTime: 1000,
          stopTime: 1000,
        })
      }else {
        setState({
          rule: {
            誰が: '*',
          },
        })
      }
      player.seek(0)
      break
    case toCliSignal.SET_SEEK_TIME:
      if(state.movieId !== '9'){
        setState({
          currentTime: data.time,
          isPaused: true,
        })
        seek(data.time)
      }
      break
    case toCliSignal.SEEK_PAUSE:
      if(state.movieId !== '9'){
        setState({
          isPaused: true,
        })
      }
      break
    case toCliSignal.SEEK_PLAY:
      if(state.movieId !== '9'){
        setState({
          isPaused: false,
        })
      }
      break
    case toCliSignal.NONE:
      break
    default:
      Alert.alert('ERROR', 'incoming invalid signal')
  }
}

export default routeSignal