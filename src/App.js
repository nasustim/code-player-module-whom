/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react'
import {
  Alert,
} from 'react-native'

import StartMenu from './components/StartMenu'
import MainVideo from './components/MainVideo'
import Experiences from './components/Experiences'

import {globalInitialState} from './const'
import routeSignal from './utils/routeSignal'
import experiences from '../resources/experiences'

// tryReconnectフラグ作った方がいいかもしれん

export default class App extends Component {
  constructor(props) {
    super(props)

    this.state = globalInitialState
    this.ws = null
    this.player = null
    this.callWebsocketDaemon = this.callWebsocketDaemon.bind(this)
    this.setWorkState = this.setWorkState.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
    this.setCodePlayer = this.setCodePlayer.bind(this)
  }

  setWorkState({addr, movieId, codingVideo, programmerVideo}) {
    this.setState({
      addr,
      movieId,
      codingVideo,
      programmerVideo,
      isTurned,
    })
    this.callWebsocketDaemon()
  }

  callWebsocketDaemon() {

    Alert.alert('TEST', `addr: ${this.state.addr}, \ncodingVideo: ${this.state.codingVideo}, \nprogrammerVideo: ${this.state.programmerVideo}, \nmovieId${this.state.movieId}, \nisTurned: ${this.state.isTurned}`)

    if (!this.state.addr.match(/^ws:\/\//)) {
      Alert.alert('NOTICE', 'サーバアドレスは"ws://~~:~~"の形式')
      return
    }
    if (!this.state.movieId.match(/^[0-9]$/)) {
      Alert.alert('NOTICE', 'Movie IDは0から9の間で入力してください。')
      return
    }
    if (this.state.movieId.match(/^[0-8]$/) && !this.state.codingVideo) {
      Alert.alert('NOTICE', '映像ファイルを選択してください。')
      return
    }

    this.ws = new WebSocket(this.state.addr)

    this.ws.onopen = () => {
      this.ws.send(
        JSON.stringify({
          movieId: this.state.movieId,
          signal: 0,
        })
      )
      this.setState({
        isConnectionEstablished: true,
      })
    }
    this.ws.onmessage = event => {
      // @note SET_SEEL_TIME の際はdata.timeが渡っている

      const data = JSON.parse(event.data)
      console.log(data)
      
      routeSignal({state: this.state, setState: this.setState, player: this.player, data})
    }
    this.ws.onerror = err => {
      this.ws = null
    }
    this.ws.onclose = event => {
      this.ws = null
      setTimeout(() => {
        this.ws = new WebSocket(this.state.addr)
      }, 5000)
    }
  }

  sendMessage(obj) {
    this.ws.send(JSON.stringify(obj))
  }

  setCodePlayer (player) {
    this.player = player
  }

  render() {
    const isEstablished = this.state.isConnectionEstablished
    const stopTime = this.state.stopTime
    const currentTime = this.state.currentTime
    const startTime = this.state.startTime
    const isPaused = this.state.isPaused
    const isTurned = this.state.isTurned
    const movieId = this.state.movieId
    const rule = this.state.rule
    const markerTime = this.state.markerTime
    const programmerVideo = this.state.programmerVideo
    const codingVideo = this.state.codingVideo

    const startMenuProps = {}
    const mainVideoProps = {codingVideo, programmerVideo, isPaused, isTurned, currentTime, startTime, stopTime, markerTime,}
    const experiencesProps = {rule,}

    return !isEstablished ? (
      <StartMenu 
        setWorkState={this.setWorkState} 
        {...startMenuProps} 
      />
    ) : movieId !== '9' ? (
      <MainVideo 
        setState={this.setState} 
        sendMessage={this.sendMessage} 
        setCodePlayer={this.setCodePlayer} 
        {...mainVideoProps} 
      />
    ) : (
      <Experiences 
        {...experiencesProps} 
      />
    )
  }
}