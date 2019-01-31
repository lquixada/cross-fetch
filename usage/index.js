import React from 'react'
import { AppRegistry, NavigatorIOS } from 'react-native'
import { name as appName } from './app.json'
import Home from './native'

const App = () => (
  <NavigatorIOS
    initialRoute={{
      component: Home,
      title: 'cross-fetch'
    }}
    style={{ flex: 1 }}
  />
)

AppRegistry.registerComponent(appName, () => App)
