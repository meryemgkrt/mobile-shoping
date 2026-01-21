import {createNativeStackNavigator} from '@react-navigation/native-stack'
import React from 'react'
import MainTabsNavigator from './MainTabsNavigator'  // Bunu import et
import { RootStackParamList } from '../types'
import ProductDetailsScreen from '../screen/ProductDetailsScreen'

const RootNavigation = () => {
    const Stack = createNativeStackNavigator<RootStackParamList>()
  return (
    <Stack.Navigator screenOptions={{headerShown:false}}>
        <Stack.Screen name='MainTabs' component={MainTabsNavigator}/>
        <Stack.Screen name='ProductDetails' component={ProductDetailsScreen}/>
    </Stack.Navigator>
  )
}

export default RootNavigation