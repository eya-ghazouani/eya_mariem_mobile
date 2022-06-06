import React, {useContext} from 'react'
import { createStackNavigator } from '@react-navigation/stack';

import UserReservations from '../screens/user_medicament/UserReservations'
import Details_UserReservation from '../screens/user_medicament/Details_UserReservation'
const Stack = createStackNavigator();

const UserReservNav = () => {


  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
        <Stack.Screen name='Reservation' component={UserReservations} />
        <Stack.Screen name='Details_UserReservation' component={Details_UserReservation} />
        
    </Stack.Navigator>
  )
}

export default UserReservNav