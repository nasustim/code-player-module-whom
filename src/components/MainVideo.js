import React from 'react'
import {
  View,
  StyleSheet,
} from 'react-native'
import Video from 'react-native-video'

import {codeSize} from '../resources/sizes'

import Wipe from './components/Wipe'
import Experiences from './Experiences'

export const MainVideo = ({
  setState, 
  sendMessage, 
  setCodePlayer, 
  codingVideo,
  programmerVideo, 
  isPaused, 
  currentTime,
  startTime,
  stopTime,
  markerTime,
}) => 
  <View style={styles.container}>
    <View style={styles.videoContainer}>
      <Video
        fullscreen={true}
        style={styles.video}
        source={{uri: codingVideo}}
        ref={ref => {
          setCodePlayer(ref)
        }}
        selectedVideoTrack={{
          type: 'resolution',
          value: codeSize.height,
        }}
        paused={isPaused}
        onProgress={movie => {
          if (Math.floor(movie.currentTime) !== currentTime) {
            setState({
              currentTime: Math.floor(movie.currentTime),
            })

            if (Math.floor(movie.currentTime) >= stopTime) {  // @note ストップ後に変な動きをしたらここを === に戻す
              sendMessage({
                signal: 1,
                movieId: movieId,
              })
              setState({
                isPaused: true,
              })
            } else if (Math.floor(movie.currentTime) === markerTime) {
              sendMessage({
                signal: 2,
                movieId: movieId,
              })
            }
          }
        }}
      />
    </View>
    {isPaused === false ? (
      <Wipe
        isPaused={isPaused}
        currentTime={startTime}
        uri={programmerVideo}
      />
    ) : null}
    {isPaused === true ? <View style={styles.mask} /> : null}
  </View>

export default Experiences


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
})
