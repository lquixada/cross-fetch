import React, { Component } from 'react'
import { StyleSheet, Text, ScrollView } from 'react-native'
import fetch from 'cross-fetch'

export default class Ponyfill extends Component {
  constructor (props) {
    super(props)
    this.state = {
      user: {}
    }
  }

  componentDidMount () {
    fetch('https://api.github.com/users/lquixada')
      .then(res => {
        if (res.status >= 400) {
          throw new Error('Bad response from server')
        }
        return res.json()
      })
      .then(user => {
        this.setState({ user })
      })
      .catch(err => {
        console.error(err)
      })
  }

  render () {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.instructions}>
          {JSON.stringify(this.state.user, null, 2)}
        </Text>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  }
})
