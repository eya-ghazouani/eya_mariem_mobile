import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Fontisto from 'react-native-vector-icons/Fontisto';

const Tab = createBottomTabNavigator();

import Profile from '../screens/Auth/Profile';
import UserMedicNav from './UserMedicNav';
import Medics_nav from './Medics_nav';
import UserReservNav from './UserReservNav';

const MainNav = () => {
  return (
    <Tab.Navigator
        screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#01ab9d',
            
            
        }}
    >
        <Tab.Screen name="Accueil"
            component={Medics_nav}
            options={{
                tabBarIcon: ({ color }) => (
                    <AntDesign name="home" color={color} size={26} />
                )
            }}    
        />
        <Tab.Screen name="Mes dons" 
            component={UserMedicNav} 
            options={{
                tabBarIcon: ({ color }) => (
                    <FontAwesome5 name="hand-holding-medical" color={color} size={26} />
                )
            }} 
        />

        <Tab.Screen name="Mes réservations" 
            component={UserReservNav} 
            options={{
                tabBarIcon: ({ color }) => (
                    <Fontisto name="shopping-basket-add" color={color} size={26} />
                )
            }} 
        />
       
        
        <Tab.Screen name="Profil" 
            component={Profile} 
            options={{
                tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name="account"  color={color} size={26} />
                )
            }} 
        />
    </Tab.Navigator>
  )
}

export default MainNav