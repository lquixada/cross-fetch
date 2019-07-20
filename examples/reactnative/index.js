import { AppRegistry } from 'react-native'
import { name as appName } from './app.json'
import Home from './components/home'
import PolyfillPage from './components/poly-page'
import PonyfillPage from './components/pony-page'
import { createStackNavigator, createAppContainer } from 'react-navigation'

const MainNavigator = createStackNavigator({
  Home: { screen: Home },
  PolyfillPage: { screen: PolyfillPage },
  PonyfillPage: { screen: PonyfillPage }
})

const App = createAppContainer(MainNavigator)

AppRegistry.registerComponent(appName, () => App)
