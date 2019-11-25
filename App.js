/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import setting from './setting';

import React, {Component, Fragment} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  Alert,
  ScrollView,
} from 'react-native';

import Video from 'react-native-video';
import ImagePicker from 'react-native-image-picker';

/**
 * Production
 */
import {codeVideoList} from './resources/videoList';
import experiences from './resources/experiences';
import {codeSize} from './resources/sizes';

/**
 * unitTest/coding
 */
//import {codeVideoList} from './deviceTest/unit/coding/videoList';
//import experiences from './deviceTest/unit/coding/experiences';
//import {codeSize} from './deviceTest/unit/coding/sizes';

/**
 * unitTest/filtering
 */
//import {codeVideoList} from './deviceTest/unit/filtering/videoList';
//import experiences from './deviceTest/unit/filtering/experiences';
//import {codeSize} from './deviceTest/unit/filtering/sizes';

import Wipe from './components/Wipe';

const selectorOption = {
  mediaType: 'video',
  storageOptions: {
    skipBackup: true,
  }
};

export default class App extends Component {
  ws;
  constructor(props) {
    super(props);

    this.state = {
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
        誰が: "*"
      },
      isSteppable: true,
      programmerVideo: '',
      codingVideo: '',
    };
    this.ws = null;
    this.callWebsocketDaemon = this.callWebsocketDaemon.bind(this);
    this.selectCodingVideo = this.selectCodingVideo.bind(this);
    this.selectProgrammerVideo = this.selectProgrammerVideo.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  callWebsocketDaemon() {
    if (!this.state.addr.match(/^ws:\/\//)) {
      Alert.alert('NOTICE', 'サーバアドレスは"ws://~~:~~"の形式');
      return;
    }
    if (!this.state.movieId.match(/^[0-9]$/)) {
      Alert.alert('NOTICE', 'Movie IDは0から9の間で入力してください。');
      return;
    }
    if (this.state.movieId.match(/^[0-8]$/) && !this.state.codingVideo) {
      Alert.alert('NOTICE', '映像ファイルを選択してください。');
      return;
    }

    this.ws = new WebSocket(this.state.addr);

    this.ws.onopen = () => {
      this.ws.send(
        JSON.stringify({
          movieId: this.state.movieId,
          signal: 0,
        }),
      );
      this.setState({
        isConnectionEstablished: true,
        isPaused: true,
      });
    };
    this.ws.onmessage = event => {
      const data = JSON.parse(event.data);
      let count = this.state.count + 1;
      console.log(data);
      if (data.signal == 0 && data.movieId == this.state.movieId) {
        this.setState({
          isPaused: false,
          startTime: this.state.currentTime,
          stopTime: data.time,
          count: count,
        });
      } else if (data.signal == 1 && data.movieId == this.state.movieId) {
        this.setState({
          markerTime: data.time,
          startTime: this.state.currentTime,
          isPaused: false,
          count: count,
        });
      } else if (data.signal == 2) {
        if (this.state.movieId != '9') {
          this.player.seek(0);
          this.setState({
            isPaused: true,
            isSteppable: true,
            stopTime: 980,
            markerTime: -1,
          });
        } else {
          this.setState({
            rule: {
              誰が: "*"
            },
          });
        }
      } else if (data.signal == 3 && this.state.movieId == '9') {
        this.setState({
          rule: data.rule,
        });
      }
    };
    this.ws.onerror = err => {
      this.ws = null;
    };
    this.ws.onclose = event => {
      console.log(
        `connection closed, code: ${event.code}, reason: ${event.reason}`,
      );
    };
  }

  sendMessage(obj) {
    this.ws.send(JSON.stringify(obj));
  }

  selectCodingVideo() {
    ImagePicker.launchImageLibrary(selectorOption, response => {
      if (typeof response.origURL !== 'undefined') {
        this.setState({
          codingVideo: response.origURL,
        });
      }
    });
  }
  selectProgrammerVideo() {
    ImagePicker.launchImageLibrary(selectorOption, response => {
      if (typeof response.origURL !== 'undefined') {
        this.setState({
          programmerVideo: response.origURL,
        });
      }
    });
  }

  render() {
    const isEstablished = this.state.isConnectionEstablished;
    const stopTime = this.state.stopTime;
    const currentTime = this.state.currentTime;
    const startTime = this.state.startTime;
    const isPaused = this.state.isPaused;
    const movieId = this.state.movieId;
    const rule = this.state.rule;
    const markerTime = this.state.markerTime;
    const programmerVideo = this.state.programmerVideo;
    const codingVideo = this.state.codingVideo;

    return !isEstablished ? (
      <View style={styles.container}>
        <View style={styles.menu}>
          <Text style={styles.controlChild}>
            サーバアドレスを入力(ws://**(:**)(/**))
          </Text>
          <TextInput
            style={styles.controlChild}
            onChangeText={addr => this.setState({addr})}
            value={this.state.addr}
          />
          <Text style={styles.controlChild}>動画IDを入力(0 - 8)</Text>
          <TextInput
            style={styles.controlChild}
            onChangeText={movieId => this.setState({movieId})}
            value={this.state.movieId}
          />
          <View style={styles.row}>
            <Button
              style={
                programmerVideo ? styles.selectedChild : styles.controlChild
              }
              title="プログラマ動画を選択"
              onPress={this.selectProgrammerVideo}
            />
            <Button
              style={codingVideo ? styles.selectedChild : styles.controlChild}
              title="コーディング動画を選択"
              onPress={this.selectCodingVideo}
            />
          </View>
          <Text>コ: {codingVideo}</Text>
          <Text>プ: {programmerVideo}</Text>
          <Button
            style={styles.controlChild}
            title="Send"
            onPress={this.callWebsocketDaemon}
          />
        </View>
      </View>
    ) : movieId !== '9' ? (
      <View style={styles.container}>
        <View style={styles.videoContainer}>
          <Video
            fullscreen={true}
            style={styles.video}
            source={{uri: codingVideo}}
            ref={ref => {
              this.player = ref;
            }}
            selectedVideoTrack={{
              type: "resolution",
              value: codeSize.height
            }}
            onBuffer={this.onBuffer}
            paused={isPaused}
            onProgress={movie => {
              if (Math.floor(movie.currentTime) !== currentTime) {
                this.setState({
                  currentTime: Math.floor(movie.currentTime),
                });

                if (Math.floor(movie.currentTime) === stopTime) {
                  this.sendMessage({
                    signal: 1,
                    movieId: movieId,
                  });
                  this.setState({
                    isPaused: true,
                  });
                } else if (Math.floor(movie.currentTime) === markerTime) {
                  this.sendMessage({
                    signal: 2,
                    movieId: movieId,
                  });
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
                  return true;
                }
                for (let i in rule) {
                  if (!Array.isArray(rule[i])) {
                    if (e[i].includes(rule[i])) {
                    } else {
                      return false;
                    }
                  } else {
                    let flag = false;
                    for (let j in rule[i]) {
                      if (rule[i][j].includes(e[i])) {
                        flag = true;
                      }
                    }
                    if (flag === false) {
                      return false;
                    }
                  }
                }
                return true;
              }),
              null,
              4,
            )}
          </Text>
        </Fragment>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //flexDirection: 'row',
    //justifyContent: 'space-between',
    //alignItems: 'center',
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
});
