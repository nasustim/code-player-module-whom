import {AsyncStorage} from 'react-native'

const keys = ['ipaddr', 'id', 'codeuri', 'manuri']
const emptyList = JSON.stringify([])
/**
 * keys:
 *   "ipaddr" or "id" or "codeuri" or "manuri"
 */
export async function save ({key, value}) {
  if(keys.indexOf(key) < 0)
    throw new Error('undefined key')

  const list = await load(key)
  const newList = JSON.stringify(list.unshift(value).slice(0,10))

  try{
    await AsyncStorage.setItem(key, newList)
    return 'save: successful'
  }catch(e) {
    return 'save: failure'
  }
}

export async function load ({key}) {
  if(keys.indexOf(key) < 0)
    throw new Error('undefined key')

  let value
  try{
    value = await AsyncStorage.getItem(key)
    if(value === null)
      value = emptyList
  }catch (e) {
    value = emptyList
  }

  return JSON.parse(value)
}