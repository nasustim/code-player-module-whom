import React, {Fragment} from 'react'
import {
  ScrollView,
  StyleSheet,
  Text
} from 'react-native'

import experiences from '../../resources/experiences'

export const Experiences = ({strRule}) => {
  const rule = JSON.parse(strRule)
  return <ScrollView style={styles.expContainer}>
    <Fragment>
      <Text style={styles.experiences}>
        let 経験 ={' '}
        {judge(rule) ? JSON.stringify(experiences, null, 4) : JSON.stringify(
          experiences.filter(e => {
            for (const i in rule) {
              if (!Array.isArray(rule[i])) {
                if (e[i].includes(rule[i])) {
                } else {
                  return false
                }
              } else {
                let flag = false
                for (const j in rule[i]) {
                  if (rule[i][j].includes(e[i])) {
                    flag = true
                  }
                }
                if (flag === false) {
                  return false
                }
              }
            }
            return true
          }),
          null,
          4
        )}
      </Text>
    </Fragment>
  </ScrollView>
}

export default Experiences

const styles = StyleSheet.create({
  expContainer: {
    padding: 20,
    backgroundColor: '#F5FCFF',
  },
  experiences: {
    textAlign: 'left',
  },
})

function judge (rule) {
  if(rule.hasOwnProperty('誰が')){
    if(rule.誰が == '*'){
      return true
    }
  }
  return false
}