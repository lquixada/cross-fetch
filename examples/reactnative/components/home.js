import React from 'react'
import { Button, Text, ScrollView, Platform, StyleSheet } from 'react-native'

class Home extends React.Component {
  goToPolyfillPage () {
    this.props.navigation.navigate('PolyfillPage', {
      title: 'Test Polyfill'
    })
  }

  goToPonyfillPage () {
    this.props.navigation.navigate('PonyfillPage', {
      title: 'Test Ponyfill'
    })
  }

  render () {
    return (
      <ScrollView>
        <Text style={styles.instructions}>
          {Platform.select({
            ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
            android:
              'Double tap R on your keyboard to reload,\n' +
              'Shake or press menu button for dev menu'
          })}
        </Text>
        <Button
          onPress={this.goToPonyfillPage.bind(this)}
          title='Test Ponyfill!'
        />
        <Button
          onPress={this.goToPolyfillPage.bind(this)}
          title='Test Polyfill!'
        />
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  },
  instructions: {
    color: '#333333',
    marginBottom: 5
  }
})

export default Home
