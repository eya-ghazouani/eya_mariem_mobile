import React from 'react'
import { View, Text, Dimensions, TouchableOpacity,  StyleSheet, StatusBar} from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Splachscreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
               <StatusBar backgroundColor="#01ab9d" barStyle="light-content"/>
        <View style={styles.header}>
            <Animatable.Image
            animation="bounceIn"
            duraton="1500"
            source={require('../../assets/dawini6.png')}
            style={styles.logo}
            resizeMode="stretch"/>
        </View>
        <Animatable.View style={styles.footer} 
                          animation='fadeInUpBig'>
        <Text style={styles.title}>Bonjour !</Text>
        <Text style={styles.text}>Si vous avez des médicaments ou des produits paramédicaux que vous pouvez partager avec nous ou vous en avez besoin, rejoignez-nous tout de suite. </Text>
        <View style={styles.button}>
        <TouchableOpacity
                style={{}}
                onPress={()=>navigation.navigate('login')}
            >
               <LinearGradient 
                              colors={['#08d4c4', '#01ab9d']}
                              style={styles.signIn}>
                    <Text style={styles.textSign}>Rejoignez-nous</Text>
                   
                    <Animatable.View animation="slideInLeft" style={{marginTop: "2.5%", marginLeft: "2%"}}>
                    <MaterialIcons 
                                  name="navigate-next"
                                  color="#fff"
                                  size={20}/>
                    </Animatable.View>
                </LinearGradient>
            </TouchableOpacity>
        </View>
        </Animatable.View>

        
    </View>
  )
}

export default Splachscreen

const {height} = Dimensions.get("screen");
const height_logo = height *0.28;

const styles= StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#01ab9d'
    },
    header:{
        flex:2,
        justifyContent:'center',
        alignItems:'center'
    },
    footer:{
        flex:1,
        backgroundColor:'#fff',
        borderTopLeftRadius:30,
        borderTopRightRadius:30,
        paddingVertical:50, 
        paddingHorizontal:30
    },
    logo:{
        width: height_logo,
        height:height_logo,
        borderRadius:height_logo/2,
    },
    title:{
        color:'#05375a',
        fontSize:30,
        fontWeight:'bold'
    },
    text:{
        color:'grey',
        marginTop:30,
        fontSize:18
    },
    button:{
        alignItems:'flex-end',
        marginTop:40
    },
    signIn:{
        width:150,
        height:40,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:50,
        flexDirection:'row'
    },
    textSign:{
        color:'white',
        fontWeight:'bold'
    }
})