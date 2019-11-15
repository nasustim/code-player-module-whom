/**
 * environment:
 *  'production' || 'unitTest/coding' || 'unitTest/filtering'
 */
const env = 'production';
//const env = 'unitTest/coding';
//const env = 'unitTest/fileLoad'

/**
 * mode:
 *  playing mode
 * 
 *  'contain' || 'separate'
 */
//const mode = 'contain'
const mode = 'separate'

const setting = {
  env,
  mode
}

export default setting