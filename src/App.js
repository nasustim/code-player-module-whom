/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import setting from '../setting'

import React, {Component, Fragment} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Alert,
  ScrollView,
} from 'react-native'

import Video from 'react-native-video'

/**
 * Production
 */
import {codeVideoList} from '../resources/videoList'
import experiences from '../resources/experiences'
import {codeSize} from '../resources/sizes'

/**
 * unitTest/coding
 */
// import {codeVideoList} from './deviceTest/unit/coding/videoList';
// import experiences from './deviceTest/unit/coding/experiences';
// import {codeSize} from './deviceTest/unit/coding/sizes';

/**
 * unitTest/filtering
 */
// import {codeVideoList} from './deviceTest/unit/filtering/videoList';
// import experiences from './deviceTest/unit/filtering/experiences';
// import {codeSize} from './deviceTest/unit/filtering/sizes';

import Wipe from './components/Wipe'
import StartMenu from './components/StartMenu'

import {globalInitialState} from './const'
import routeSignal from './utils/routeSignal'

// tryReconnectフラグ作った方がいいかもしれん

export default class App extends Component {
  constructor(props) {
    super(props)

    this.state = globalInitialState
    this.ws = null
    this.callWebsocketDaemon = this.callWebsocketDaemon.bind(this)
    this.setWorkState = this.setWorkState.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
  }

  setWorkState({addr, movieId, codingVideo, programmerVideo}) {
    this.setState({
      addr,
      movieId,
      codingVideo,
      programmerVideo,
    })
    this.callWebsocketDaemon()
  }

  callWebsocketDaemon() {
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

  render() {
    const isEstablished = this.state.isConnectionEstablished
    const stopTime = this.state.stopTime
    const currentTime = this.state.currentTime
    const startTime = this.state.startTime
    const isPaused = this.state.isPaused
    const movieId = this.state.movieId
    const rule = this.state.rule
    const markerTime = this.state.markerTime
    const programmerVideo = this.state.programmerVideo
    const codingVideo = this.state.codingVideo

    return !isEstablished ? (
      <StartMenu setWorkState={this.setWorkState} />
    ) : movieId !== '9' ? (
      <View style={styles.container}>
        <View style={styles.videoContainer}>
          <Video
            fullscreen={true}
            style={styles.video}
            source={{uri: codingVideo}}
            ref={ref => {
              this.player = ref
            }}
            selectedVideoTrack={{
              type: 'resolution',
              value: codeSize.height,
            }}
            onBuffer={this.onBuffer}
            paused={isPaused}
            onProgress={movie => {
              if (Math.floor(movie.currentTime) !== currentTime) {
                this.setState({
                  currentTime: Math.floor(movie.currentTime),
                })

                if (Math.floor(movie.currentTime) >= stopTime) {  // @note ストップ後に変な動きをしたらここを === に戻す
                  this.sendMessage({
                    signal: 1,
                    movieId: movieId,
                  })
                  this.setState({
                    isPaused: true,
                  })
                } else if (Math.floor(movie.currentTime) === markerTime) {
                  this.sendMessage({
                    signal: 2,
                    movieId: movieId,
                  })
                }
              }
            }}
          />
        </View>
        {isPaused === false && setting.mode == 'separate' ? (
          <Wipe
            isPaused={isPaused}
            currentTime={startTime}
            uri={programmerVideo}
          />
        ) : null}
        {isPaused === true ? <View style={styles.mask} /> : null}
      </View>
    ) : (
      <ScrollView style={styles.expContainer}>
        <Fragment>
          <Text style={styles.experiences}>
            let 経験 ={' '}
            {JSON.stringify(
              experiences.filter(e => {
                if (rule.誰が === '*') {
                  return true
                }
                for (const i in rule) {
                  if (!Array.isArray(rule[i])) {
                    if (e[i].includes(rule[i])) {
                    } else {
                      return false
                    }
                  } else {
                    let flag = false
                    for (const j in rule[i]) {
                      if (rule[i][j].includes(e[i])) {
                        flag = true
                      }
                    }
                    if (flag === false) {
                      return false
                    }
                  }
                }
                return true
              }),
              null,
              4
            )}
          </Text>
        </Fragment>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // alignItems: 'center',
    backgroundColor: '#AAAAAA',
  },
  mask: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: codeSize.width,
    height: codeSize.height,
    position: 'absolute',
    zIndex: 200,
  },
  menu: {
    width: codeSize.width,
    height: codeSize.height,
    flexDirection: 'column',
  },
  expContainer: {
    padding: 20,
    backgroundColor: '#F5FCFF',
  },
  row: {
    flexDirection: 'row',
  },
  controlChild: {
    margin: 10,
    color: 'black',
    backgroundColor: 'rgba(200,200,200,0.2)',
    width: codeSize.width,
  },
  selectedChild: {
    margin: 10,
    color: 'black',
    backgroundColor: 'rgba(100,100,200,0.4)',
    width: codeSize.width,
  },
  videoContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 1,
  },
  video: {
    width: codeSize.width,
    height: codeSize.height,
  },
  experiences: {
    textAlign: 'left',
  },
})
