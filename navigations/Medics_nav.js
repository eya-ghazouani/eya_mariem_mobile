import React, {useContext} from 'react'
import { View, Text } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';

import HameScreen from '../screens/HameScreen';
import Medic_cards from '../screens/Medic_cards';
import Details_Medic from '../screens/Details_Medics'
import Reservation from '../screens/user_medicament/UserReservations'
const Stack = createStackNavigator();

const Medics_nav = () => {


  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      
      <Stack.Screen name='Home_cat' component={HameScreen} />
       <Stack.Screen name='Medics' component={Medic_cards} /> 
       <Stack.Screen name='Details_Medic' component={Details_Medic} />
       {/* <Stack.Screen name='Reservation' component={Reservation} /> */}

        
    </Stack.Navigator>
  )
}

export default Medics_nav