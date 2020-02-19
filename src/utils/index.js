export const toCliSignal = {
  /** @note この2つは isPaused: false の挙動; 他は全て isPaused: true */
  SET_PAUSE_POINT: 0,
  SET_SEARCH_POINT: 1,
  /** ここまで */

  SEEK_INIT: 2,
  FILTER_EXPERIENCE: 3,

  /** @note この3つは data.time と data.movieIdがわたる */
  SEEK_PAUSE: 4,
  SEEK_PLAY: 5,
  SET_SEEK_TIME: 6,
  /** ここまで */

  NONE: 202,
}
export const fromCliSignal = {
  SET_DEVICE: 0,
  CLI_PLAY_STOP: 1,
  CLI_SEARCH_EXPERIENCE: 2,
  RES_SUCCESS: 3,
  RES_FAILURE: 4,
}