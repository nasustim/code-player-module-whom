import AsyncStorage from '@react-native-community/async-storage'

export const keys = ['addr', 'codingVideo', 'programmerVideo']
const emptyList = JSON.stringify([])
export async function save({key, value}) {
  if (keys.indexOf(key) < 0) throw new Error('undefined key')

  const list = await load({key})
  const newList = JSON.stringify([value, ...list].slice(0, 10))

  try {
    await AsyncStorage.setItem(key, newList)
    return 'save: successful'
  } catch (e) {
    throw new Error('save: failure')
  }
}

export async function load({key}) {
  let value
  if (keys.indexOf(key) < 0) value = emptyList

  try {
    value = await AsyncStorage.getItem(key)
    if (value === null) value = emptyList
  } catch (e) {
    value = emptyList
  }

  return JSON.parse(value)
}