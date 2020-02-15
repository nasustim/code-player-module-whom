import React, {useState} from 'react'
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  Alert,
  ScrollView,
} from 'react-native'
import {load} from '../utils/data'

import {startMenuKeys} from '../const'

const initialState = Object.fromEntries(new Map(startMenuKeys.map(v => [v, ''])))

const StartMenu = ({setWorkState}) => {
  const [state, changeState] = useState(initialState)

  load('ipaddr')

  function sendProps() {
    setWorkState(state)
  }
  function updateState (key, value) {
    if(startMenuKeys.indexOf(key) < 0)
      return -1
    changeState(key, value)
  }
  function selectVideo (key) {
    if(['codingVideo', 'programmerVideo'].indexOf(key) < 0)
      return -1

    // @ToDO 履歴からも入力できるようにする

    ImagePicker.launchImageLibrary(selectorOption, response => {
      if (typeof response.origURL !== 'undefined')
        updateState(key, response.origURL)
      else
        Alert.alert('ERROR', 'Cannot Read Video')
    })
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.menu}>
        <Text style={styles.controlChild}>
          サーバアドレスを入力(ws://**(:**)(/**))
        </Text>
        <TextInput
          style={styles.controlChild}
          onChangeText={addr => changeState('addr', addr)}
          value={state.addr}
        />
        <Text style={styles.controlChild}>動画IDを入力(0 - 9)</Text>
        <TextInput
          style={styles.controlChild}
          onChangeText={movieId => updateState('movieId', movieId)}
          value={state.movieId}
        />
        <View style={styles.row}>
          <Button
            style={codingVideo ? styles.selectedChild : styles.controlChild}
            title="Select Coding"
            onPress={() => selectVideo('codingVideo')}
          />
          <Button
            style={programmerVideo ? styles.selectedChild : styles.controlChild}
            title="Select Wipe"
            onPress={() => selectVideo('programmerVideo')}
          />
        </View>
        <Text>Code: {state.codingVideo}</Text>
        <Text>Wipe:   {state.programmerVideo}</Text>
        <Button
          style={styles.controlChild}
          title="Send"
          onPress={() => sendProps()}
        />
      </ScrollView>
    </View>
  )
}

export default StartMenu

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
})
