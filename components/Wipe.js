/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react'
import {StyleSheet, View} from 'react-native'
import Video from 'react-native-video'

import {meVideoList} from '../resources/videoList'

export default class Wipe extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isPaused: this.props.isPaused,
      currentTime: this.props.currentTime,
      movieId: this.props.movieId,
    }
  }
  componentDidMount() {
    this.player.seek(this.state.currentTime)
  }
  render() {
    const {movieId, isPaused} = this.state
    return (
      <View
        style={styles.container}>
        <Video
          style={styles.video}
          source={{uri: meVideoList[parseInt(movieId)]}}
          ref={ref => {
            this.player = ref;
          }}
          volume={0}
          paused={isPaused}
          />
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    width: 170,
    height: 170,
    zIndex: 2,

    right: 20,


    position: "absolute"

  },
  video: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  }
})