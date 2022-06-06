import React, {useContext, } from 'react'
import { View, Text, Dimensions, TouchableOpacity, Image } from 'react-native';
import { createDrawerNavigator , DrawerContentScrollView,
         DrawerItemList} from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { MainContext } from '../hooks/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FAB} from 'react-native-paper';
import MainNav from './MainNav';


const Drawer = createDrawerNavigator();
const MainNavStack = createStackNavigator();


const windowheight = Dimensions.get('window').height;

const CustomDrawer = (props)=>{
  const {auth} = useContext(MainContext);
  const {setChanged} = useContext(MainContext);

  const logout = async () => {
    await AsyncStorage.removeItem('user');
    setChanged('logedout');
}
   return ( 
     <View style={{flex:1}}>
 <DrawerContentScrollView {...props}>
     <View style={{flexDirection:'row', justifyContent:'space-between', padding:20, alignItems:'center',
                    backgroundColor:'#f6f6f6', marginBottom:20}}>
     <View>
     {auth &&   <Text style={{color:'#01ab9d'}}>{auth.nom} {auth.prenom}</Text>}
     {auth &&  <Text style={{color:'#01ab9d'}}> {auth.email}</Text> }
     </View>
     <TouchableOpacity   onPress={() => navigation.navigate('Profile')} >
                  
                  {auth &&     <Image  
                        style={{width: 60, height: 60, borderRadius:30 }}
                        source={{ uri: `${path}/uploads/images/${auth.avatar}`}}
                      />
                  }
                  </TouchableOpacity>
     </View>
     <DrawerItemList {...props}/>
   </DrawerContentScrollView>
   <TouchableOpacity style={{position:'absolute', bottom:50, right:0, left:0, backgroundColor:'#f6f6f6',
                             padding:20}}
                             onPress={logout}      
                             >
   <View style={{flexDirection:'row'}}>
   <FAB
        style={{paddingLeft: 2,backgroundColor: '#01ab9d',borderWidth: 1, borderColor: 'white'}}
        icon="logout"
        color='#fff'
        theme='#01ab9d'
        small
        onPress={logout}
    />
   <Text style={{color:'#01ab9d', marginLeft:10,marginTop:10}}>Déconnexion</Text>
   </View>
   </TouchableOpacity>
   </View> 

  )
};

const DrawerNav = () => {

    return (
    <Drawer.Navigator
    drawerContent={(props) => <CustomDrawer {...props}  />}
        screenOptions={{
            headerShown: false,
            // drawerActiveBackgroundColor:'#f6f6f6',
        }}    >
        <Drawer.Screen  name='Accueil' component={MainNavStackScreen} />
        {/* <Drawer.Screen  name='Medicament' component={Medic_cardsStackScreen} />
        <Drawer.Screen  name='Ajout de medicament' component={AddMedickScreen} /> */}
    </Drawer.Navigator>
  )
}

export default DrawerNav


const MainNavStackScreen = ({navigation}) => {
    
    const {auth} = useContext(MainContext);
    
    return (
        <MainNavStack.Navigator screenOptions={{
            headerStyle:{
              height: windowheight * 0.08
            },
            headerTintColor: '#fff',
            headerTintStyle:{
              fontWeight: 'bold'
            },
            headerTransparent: true,
            headerTitle: '',   
          }}>
              
            <MainNavStack.Screen name="HomeStack" component={MainNav} options={{
                headerLeft: () =>(
                  < TouchableOpacity style={{marginLeft: "10%"}} onPress={() =>navigation.openDrawer()} >
                  <Icon name="md-menu-sharp" size={30} color="#fff"   />
                  </TouchableOpacity>
                ),
            }} />
          </MainNavStack.Navigator>
    )
}






