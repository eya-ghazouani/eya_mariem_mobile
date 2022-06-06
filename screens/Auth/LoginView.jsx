import React, { useState, useContext } from 'react'
import { View, Text, Dimensions, TouchableOpacity, Image, TextInput, ScrollView, Alert , StyleSheet,Platform } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import Feather from 'react-native-vector-icons/Feather'
import { MainContext } from '../../hooks/MainContext';
import { StatusBar } from 'expo-status-bar';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const LoginScreen = ({ navigation }) => {

    const [data, setData] = React.useState({
        email:'',
        password:'',
        check_textInputChange:false,
        check_textInputChangePassword:false,
        secureTextEntry: true,   
        isValidUser:true,
        isValidPassword:true
    })

    const [form, setForm] = React.useState({
        email:'',
        password:'',
    })
    const isValidObjField =(obj) =>{
        return Object.values(obj).every(value=> value.trim())
    }

    const isValidEmail = (value)=>{
        const regx = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        return regx.test(value)
    }
    const textInputChange=(val) =>{
        if(isValidEmail(val)){
            setData({
                ... data,
                email:val,
                check_textInputChange:true,
                isValidUser:true,

            });
        }
        else if(val.length != 0){
            setData({
                ... data,
                email:val,
                check_textInputChange:false,
                isValidUser:false,
            });

        }
    }
    const textInputChangePassword=(val) =>{
        if(val.trim().length >=8){
            setData({
                ... data,
                password:val,
                check_textInputChangePassword:true,
                isValidPassword:true
            });
        }
        else if(val.length != 0){
            setData({
                ... data,
                password:val,
                check_textInputChangePassword:false,
                isValidPassword:false
            });

        }
    }
    const handleOnChangeText =(value, fieldName)=>{
        setForm({... form, [fieldName]: value})
    }
    const updateSecureTextEntry=()=>{
        setData({
            ... data,
            secureTextEntry: !data.secureTextEntry
        })
    } 

    let { setChanged } = useContext(MainContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const submit = async () => {
        if (!isValidObjField(form)){
            Alert.alert('Mouvaise saisie!',"L'email ou le mot de passe ne peut pas etre vide.",
                         [{ text: "D'accord" }]
            );
        } 
        else if (!isValidEmail(email)){
            Alert.alert('Mouvaise saisie!',"E-mail invalide.",
            [{ text: "D'accord" }]
            );
        }
        else if(password.trim().length <8)  {
            Alert.alert('Mouvaise saisie!',"Le mot de passe doit etre supérieur ou égale a 8 caractères.",
            [{ text: "D'accord" }]
            );
        }
else{

        let result = await fetch(`${path}/user/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password,
            })
        });

        //convertin responce to json
        let resultData = await result.json();
        
        if (resultData.success === true) {
            const jsonValue = JSON.stringify(resultData.data);
            await AsyncStorage.setItem('user', jsonValue);
            setChanged("logged");
            
            Alert.alert(`Bienvenue ${resultData.data.nom} ${resultData.data.prenom}`,'',
                         [{ text: 'fermer' }]
            );
        } else {
            Alert.alert(
                'Utilisateur invalide',
                resultData.message,
                [{ text: "D'accord" }]
            );

        }
    }
    }

  return (
    <View style={styles.container}>
        <StatusBar backgroundColor="#01ab9d" barStyle="light-content"/>

        <View style={styles.header}>
            <Text style={styles.text_header}>Bienvenue!</Text>         
        </View>

        <Animatable.View 
                        animation="fadeInUpBig"
                        style={styles.footer}
        >
                <Text style={styles.text_footer}>E-mail : </Text>
                <View style={styles.action}>
                    <FontAwesome 
                                 name="user-o"
                                 color="#05375a"
                                 size={20}
                    />
                       <TextInput
                    style={styles.textInput}
                    onChangeText={(text)=> [setEmail(text), textInputChange(text),handleOnChangeText(text, 'email')]}
                    placeholder="Votre E-mail"
                    keyboardType="email-address"
                    autoCapitalize='none'
                />
                { data.check_textInputChange ?
                <Animatable.View
                               animation="bounceIn"
                >
                <Feather 
                        name="check-circle"
                        color='green'
                        size={20}

                 />       
                 </Animatable.View>
                  : null
                }
                {data.isValidUser ? null :
                <Animatable.View
                               animation="bounceIn"
                >
                <Feather 
                        name="check-circle"
                        color='red'
                        size={20}

                 />       
                 </Animatable.View>
                  
                }
                
             </View>
           {data.isValidUser ? null :  <Animatable.View animation="fadeInLeft" duration={500}>
             <Text style={{color:'red'}}>E-mail invalide</Text>
             </Animatable.View> }
             <Text style={[styles.text_footer, {marginTop:35}]}>Mot de passe : </Text>
                <View style={styles.action}>
                    <Feather
                                 name="lock"
                                 color="#05375a"
                                 size={20}
                    />
                    <TextInput
                    style={styles.textInput}
                    onChangeText={(val) =>[ setPassword(val), textInputChangePassword(val),handleOnChangeText(val, 'password')]}
                    placeholder="Votre mot de passe"
                    secureTextEntry={data.secureTextEntry ? true : false}
                    keyboardType="default"
                    autoCapitalize='none'

                />
                <TouchableOpacity
                              onPress={updateSecureTextEntry}
                >
                    {data.secureTextEntry ? 
                 <Feather 
                        name="eye-off"
                        color='grey'
                        size={20}

                 />  :
                 <Feather 
                        name="eye"
                        color='grey'
                        size={20}

                 /> 

                    }
                </TouchableOpacity>
                {data.check_textInputChangePassword ?
                <Animatable.View
                               animation="bounceIn"
                >
                <Feather 
                        name="check-circle"
                        color='green'
                        size={20}

                 />       
                 </Animatable.View>
                  : null
                }
                {data.isValidPassword ? null :
                <Animatable.View
                               animation="bounceIn"
                >
                <Feather 
                        name="check-circle"
                        color='red'
                        size={20}

                 />       
                 </Animatable.View>
                 
                }
               
                </View>
               {data.isValidPassword ? null : <Animatable.View animation="fadeInLeft" duration={500}>
             <Text style={{color:'red'}}>Le mot de passe doit etre supérieur ou égale à 8 caractères</Text>
             </Animatable.View>}
                <TouchableOpacity
                style={styles.button}
                             onPress={submit}
                >
                    <LinearGradient
                             colors={['#08d4c4', '#01ab9d']}
                              style={styles.signIn}
                     >
                         <Text style={[styles.textSign, {color:"#fff"}]}>Connexion</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                                 onPress={() => navigation.navigate('register')}
                                 style={[styles.signIn, {borderColor:"#01ab9d", 
                                                         borderWidth:1, marginTop:15}]}
                >
                    <Text style={[styles.textSign,{color:"#01ab9d"}]}>S'inscrire</Text>
                </TouchableOpacity>           
              
            </Animatable.View>
        </View>
  
  )
}

export default LoginScreen

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#01ab9d'
    },
    header:{
        flex:1,
        justifyContent:'flex-end',
        paddingHorizontal:20,
        paddingBottom:50
    },
    footer:{
        flex:3,
        backgroundColor:'#fff',
        borderTopLeftRadius:30,
        borderTopRightRadius:30,
        paddingVertical:30, 
        paddingHorizontal:20, 
    },
   
    title:{
        color:'#05375a',
        fontSize:30,
        fontWeight:'bold'
    },
    text_header:{
        color:'#fff',
        fontWeight:'bold',
        fontSize:30
    },
    text_footer:{
        color:'#05375a',
        fontSize:18
    },
    action:{
        flexDirection:'row',
        marginTop:10,
        borderBottomWidth:1,
        borderBottomColor:'#f2f2f2',
        paddingBottom:5
    },
    textInput:{
        flex:1,
        marginTop: Platform.OS ==='ios' ? 0 : -12,
        paddingLeft:10,
        color:'#05375a'
    },
    button:{
        alignItems:'center',
        marginTop:50
    },

    signIn:{
        width:'100%',
        height:50,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10,
    },
    textSign:{
        fontSize:18,
        fontWeight:'bold'
    },
    
})