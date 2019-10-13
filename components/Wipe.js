/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import Video from 'react-native-video';

import {meVideoList} from '../resources/videoList';

import {meSize, meRatio, codeSize} from '../resources/sizes'

export default class Wipe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPaused: this.props.isPaused,
      currentTime: this.props.currentTime,
      movieId: this.props.movieId,
    };
  }
  componentDidMount() {
    this.player.seek(this.state.currentTime);
  }
  render() {
    console.log('wipe rend')
    console.log(this.props)
    const {movieId, isPaused} = this.state;
    return (
      <View style={styles.container1}>
        <Video
          style={styles.video1}
          source={{uri: meVideoList[parseInt(movieId)]}}
          ref={ref => {
            this.player = ref;
          }}
          volume={0}
          paused={isPaused}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container1: {
    position: "absolute",
    zIndex: 5,
    right: 50,//20,
    top: codeSize.height -  Math.floor(meSize.height * meRatio) - 20, // 何故かbottom:20が効かない
  },
  video1: {
    width: Math.floor(meSize.width * meRatio),
    height: Math.floor(meSize.height * meRatio),
  },
});
