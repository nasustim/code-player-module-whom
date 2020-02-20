/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useState} from 'react'
import {
  Alert,
} from 'react-native'

import StartMenu from './components/StartMenu'
import MainVideo from './components/MainVideo'
import Experiences from './components/Experiences'

import {globalInitialState} from './const'
import routeSignal from './utils/routeSignal'

// tryReconnectフラグ作った方がいいかもしれん

let ws = null
let player = null

export const App = () => {

  const [state, setState] = useState(globalInitialState)

  function referChildState (diff) {
    setState(Object.assign({}, state, diff))
  }

  function callWebsocketDaemon() {

    // Alert.alert('TEST', `addr: ${this.state.addr}, \ncodingVideo: ${this.state.codingVideo}, \nprogrammerVideo: ${this.state.programmerVideo}, \nmovieId${this.state.movieId}, \nisTurned: ${this.state.isTurned}`)

    if (!state.addr.match(/^ws:\/\//)) {
      Alert.alert('NOTICE', 'サーバアドレスは"ws://~~:~~"の形式')
      return
    }
    if (!state.movieId.match(/^[0-9]$/)) {
      Alert.alert('NOTICE', 'Movie IDは0から9の間で入力してください。')
      return
    }
    if (state.movieId.match(/^[0-8]$/) && !state.codingVideo) {
      Alert.alert('NOTICE', '映像ファイルを選択してください。')
      return
    }
    

    ws = new WebSocket(state.addr)

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          movieId: state.movieId,
          signal: 0,
        })
      )
      referChildState({
        isConnectionEstablished: true,
      })
    }
    ws.onmessage = event => {
      // @note SET_SEEL_TIME の際はdata.timeが渡っている

      const data = JSON.parse(event.data)
      console.log(data)
      
      routeSignal({state: state, setState: referChildState, player: player, data})
    }
    ws.onerror = err => {
      ws = null
    }
    ws.onclose = event => {
      ws = null
      setTimeout(() => {
        callWebsocketDaemon()
        //this.ws = new WebSocket(this.state.addr)
      }, 5000)
    }
  }

  function sendMessage(obj) {
    ws.send(JSON.stringify(obj))
  }

  function setCodePlayer (_player) {
    player = _player
  }

  const addr = state.addr
  const isEstablished = state.isConnectionEstablished
  const stopTime = state.stopTime
  const currentTime = state.currentTime
  const startTime = state.startTime
  const isPaused = state.isPaused
  const isTurned = state.isTurned
  const movieId = state.movieId
  const rule = state.rule
  const markerTime = state.markerTime
  const programmerVideo = state.programmerVideo
  const codingVideo = state.codingVideo

  const startMenuProps = {codingVideo, programmerVideo, isTurned, movieId, addr,}
  const mainVideoProps = {codingVideo, programmerVideo, isPaused, isTurned, currentTime, startTime, stopTime, markerTime,}

  return !isEstablished ? (
    <StartMenu 
      referChildState={referChildState}
      callWebsocketDaemon={callWebsocketDaemon}
      {...startMenuProps} 
    />
  ) : movieId !== '9' ? (
    <MainVideo 
      referChildState={referChildState} 
      sendMessage={sendMessage} 
      setCodePlayer={setCodePlayer} 
      {...mainVideoProps} 
    />
  ) : (
    <Experiences 
      strRule={rule}
    />
  )
}

export default App