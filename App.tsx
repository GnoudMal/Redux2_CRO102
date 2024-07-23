import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Provider } from 'react-redux'
import store from './src/redux/store'
import ExpenseManager from './src/screens/ExpenseManager '

const App = () => {
  return (
    <Provider store={store} >
      <ExpenseManager />
    </Provider>
  )
}

export default App

const styles = StyleSheet.create({})