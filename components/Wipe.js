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

//import {meSize, meRatio, codeSize} from '../resources/sizes'

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
    const {movieId, isPaused} = this.state;
    return (
      <View style={styles.container}>
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
    );
  }
}

const styles = StyleSheet.create({
  container: {
    zIndex: 2,
    right: 20,
    top: 0, //codeSize.height -  Math.floor(meSize.height * meRatio) - 20, // 何故かbottom:20が効かない
    position: 'absolute',
  },
  video: {
    width: 100,//Math.floor(meSize.width * meRatio),
    height: 20//Math.floor(meSize.height * meRatio),
  },
});
