import React, {useState} from 'react'
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Alert,
  ScrollView,
  Picker,
  Modal,
} from 'react-native'
import ImagePicker from 'react-native-image-picker'

import {startMenuInitValues, startMenuKeys} from '../const'

const selectorOption = {
  mediaType: 'video',
  storageOptions: {
    skipBackup: true,
  },
  noData: true,
}

const StartMenu = ({setWorkState}) => {
  const [state, changeState] = useState(startMenuInitValues)
  
  function sendProps() {
    setWorkState(state)
  }
  function updateState(key, value) {
    if (startMenuKeys.indexOf(key) < 0) return -1
    changeState(Object.assign({}, state, {[key]: value}))
  }
  function selectVideo(key) {
    if (['codingVideo', 'programmerVideo'].indexOf(key) < 0) return -1

    ImagePicker.launchImageLibrary(selectorOption, response => {
      if (typeof response.origURL !== 'undefined'){
        updateState(key, response.origURL)
      }else{
        Alert.alert('ERROR', 'Cannot Read Video')
      }
    })
  }

  return (
    <View style={styles.container}>
        <Modal
          style={styles.historyModal}
          animationType="slide"
          transparent={false}
          visible={state.isShowURIHistory || state.isShowCodingVideoHistory || state.isShowProgrammerVideoHistory}
          presentationStyle={'pageSheet'}
        >
          <Text style={styles.headerText}>{
            state.isShowURIHistory ?
              'Server URL' :
            state.isShowCodingVideoHistory ?
              'Coding Video History' :
            state.isShowProgrammerVideoHistory ?
              'Programmer Video History':
            ``
          }</Text>
          <Text
          style={styles.closeButton}
          onPress={() => {
            state.isShowURIHistory ?
              updateState('isShowURIHistory', false) :
            state.isShowCodingVideoHistory ?
              updateState('isShowCodingVideoHistory', false) :
            updateState('isShowProgrammerVideoHistory', false)
          }}>Close</Text>
          {() => {
            const id = state.isShowURIHistory ? 'addr' : state.isShowCodingVideoHistory ? 'codingVideo' : 'programmerVideo'
            const flag = state.isShowURIHistory ? 'isShowURIHistory' : state.isShowCodingVideoHistory ? 'isShowCodingVideoHistory' : 'isShowProgrammerVideoHistory'
            return history[id].map(item => (<Text style={styles.selectButton} onPress={()=>{updateState(id, item.v);updateState(flag, false)}}>{item.v}</Text>))
          }}
        </Modal>

      <ScrollView style={styles.menu}>
        <Text style={styles.headerText}>Start Menu for 《/module/Whom》</Text>


        <Text style={styles.text}>Server URL: (ws://**.**.**.**/)</Text>
        <View style={styles.row}>
          <TextInput
            style={styles.input}
            onChangeText={addr => updateState('addr', addr)}
            value={state.addr}
            keyboardType={'url'}
          />
          <Text
            style={styles.openSelector}
            onPress={() => {updateState('addr', 'ws://192.168.8.10:3003')}}
          >load iamas2020 addr</Text>
        </View>

        <Text style={styles.text}>Movie ID: (0 - 9)</Text>
        <View style={styles.row}>
          <Picker
            selectedValue={state.movieId}
            style={styles.picker}
            onValueChange={(itemValue) => {updateState('movieId', itemValue)}}
          >{
              [...(Array(10))].map((v, i) => (<Picker.Item key={`mov-${i}`} label={i.toString()} value={i.toString()} />))
          }</Picker>
        </View>

        <Text style={styles.text}>Programmer Video URI</Text>
        <View style={styles.row}>
          <TextInput
            style={styles.uncontrolledInput}
            value={state.programmerVideo}
            keyboardType={'url'}
            editable={false}
          />
          <Text
            style={styles.openSelector}
            onPress={() => {selectVideo('programmerVideo')}}
          >Browse</Text>
        </View>

        <Text style={styles.text}>Coding Video URI</Text>
        <View style={styles.row}>
          <TextInput
            style={styles.uncontrolledInput}
            value={state.codingVideo}
            keyboardType={'url'}
            editable={false}
          />
          <Text
            style={styles.openSelector}
            onPress={() => {selectVideo('codingVideo')}}
          >Browse</Text>
        </View>


        <Text
          style={styles.okButton}
          onPress={() => sendProps()}
        >
          Submit
        </Text>


        <Text style={styles.notice}>展示中に何かあれば M2日比野 まで: (hibino17@iamas.ac.jp)</Text>
      </ScrollView>
    </View>
  )
}

export default StartMenu

const COLOR = 'rgba(245,245,245,1)'
const REV_COLOR = 'rgba(10,10,10,1)'
const UN_COLOR = 'rgba(205,205,205,1)'
const UN_REV_COLOR = 'rgba(50,50,50,1)'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // alignItems: 'center',
    backgroundColor: COLOR,
    padding: 10,
  },
  menu: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 38,
  },
  headerText: {
    margin: 20,
    color: 'black',
//    width: codeSize.width * 1.8,
    fontWeight: 'bold',
    fontSize: 32,
  },
  text: {
    marginLeft: 20,
    marginBottom: 5,
    fontSize: 16,
  },
  input: {
    padding: 7,
    margin: 5,
    color: REV_COLOR,
    fontSize: 16,
    backgroundColor: COLOR,
    borderColor: REV_COLOR,
    borderBottomWidth: 1,
//    width: codeSize.width - (20 * 2) ,
    flex: 9,
  },
  uncontrolledInput: {
    padding: 7,
    margin: 5,
    color: REV_COLOR,
    fontSize: 16,
    backgroundColor: UN_COLOR,
    borderColor: UN_REV_COLOR,
    borderWidth: 1,
//    width: codeSize.width - (20 * 2) ,
    flex: 9,
  },
  openSelector: {
    padding: 7,
    color: REV_COLOR,
    fontSize: 12,
    borderWidth: 1,
    flex: 1,
    margin: 5,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  picker: {
    flex: 1,
    margin: 5,
    padding: 7,
  },
  selectedChild: {
    margin: 10,
    color: REV_COLOR,
//    backgroundColor: 'rgba(100,100,200,0.4)',
//    width: codeSize.width,
  },
  okButton: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
    padding: 8,
    color: COLOR,
    fontSize: 17,
    backgroundColor: REV_COLOR,
    textAlign: 'center',
  },
  closeButton: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
    marginTop: 10,
    padding: 8,
    color: COLOR,
    fontSize: 17,
    backgroundColor: 'rgba(245, 12, 12, 1)',
    textAlign: 'center',
  },
  selectButton: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
    marginTop: 10,
    padding: 8,
    color: REV_COLOR,
    fontSize: 17,
    backgroundColor: COLOR,
    textAlign: 'center',
  },
  okMarker: {
    fontSize: 16,
    color: 'green',
    fontWeight: 'bold',
  },
  ngMarker: {
    fontSize: 16,
    color: 'red',
    fontWeight: 'bold',
  },
  notice: {
    fontSize: 12,
    color: 'red',
    textAlign: 'center',
    bottom: 4,
  },
  historyModal: {
    margin: 60,
  },
})

// not use
function judge (target, category) {
  if(typeof target === 'string' && category === 'addr')
    return target.match(/^ws:\/\//) !== null
  else if(typeof target === 'number' && category === 'movieId')
    return target <= 0 && 9 <= target ? true : false
  else
    return false
}