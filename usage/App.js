import React, { Component } from 'react'
import { Platform, StyleSheet, Text, View } from 'react-native'
import fetch from 'cross-fetch'

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu'
})

export default class App extends Component {
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
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>{instructions}</Text>
        <Text style={styles.instructions}>{JSON.stringify(this.state.user, null, 2)}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    color: '#333333',
    marginBottom: 5
  }
})
