import React, { useState, useContext } from 'react'
import { View, Text,TouchableOpacity, Image, TextInput, ScrollView, Alert, StyleSheet  } from 'react-native'
import {Dialog} from '@rneui/themed';
import Ionicons from 'react-native-vector-icons/Ionicons'
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import * as ImagePicker from 'expo-image-picker'
import mime from 'mime';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { MainContext } from '../../hooks/MainContext';

const RegisterScreen = ({ navigation }) => {

    let { setChanged } = useContext(MainContext);
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [email, setEmail] = useState('');
    const [image, setImage] = useState(null);
    const [visible, setVisible] = useState(false);
    const [adresse, setAdresse] = useState('');
    const [tel, setTel] = useState();
    const [password, setPassword] = useState('');
    const[confirm_password, setConfirmPassword] = useState('')


    const [data, setData] = React.useState({
        email:'',
        nom:'',
        tel:'',
        prenom:'',
        adresse:'',
        password:'',
        confirm_password:'',
        check_textInputChangeEmail:false,
        check_textInputChangeNom:false,
        check_textInputChangePrenom:false,
        check_textInputChangeTel:false,
        check_textInputChangeAdresse:false,
        check_textInputChangePassword:false,
        check_textInputChangeConfirmPassword:false,
        secureTextEntry: true,
        confirm_secureTextEntry: true,
        isValidEmail:true,
        isValidNom:true,
        isValidPrenom:true,
        isValidAdresse:true,
        isValidTel:true,
        isValidPassword:true,
        isValidConfirmPassword:true
    })

    const textInputChangeEmail=(val) =>{
        if(isValidEmail(val)){
            setData({
                ... data,
                email:val,
                check_textInputChangeEmail:true,
                isValidEmail:true,
                
            });
        }  

        else if(val.length != 0){
            setData({
                ... data,
                email:val,
                check_textInputChangeEmail:false,
                isValidEmail:false,
            });
        }
    }
    const textInputChangeNom=(val) =>{
        if(val.length >2){
            setData({
                ... data,
                nom:val,
                check_textInputChangeNom:true,
                isValidNom:true
            });
        }
        else if (val.length!=0){
            setData({
                ... data,
                nom:val,
                check_textInputChangeNom:false,
                isValidNom:false

            });
        }
    }
    const textInputChangePrenom=(val) =>{
        if(val.length >2){
            setData({
                ... data,
                prenom:val,
                check_textInputChangePrenom:true,
                isValidPrenom:true
            });
        }
        else  if(val.length != 0){
            setData({
                ... data,
                prenom:val,
                check_textInputChangePrenom:false,
                isValidPrenom:false
            });
        }
    }
    const textInputChangeTel=(val) =>{
        if(val.length == 8){
            setData({
                ... data,
                tel:val,
                check_textInputChangeTel:true,
                isValidTel:true
            });
        }
        else if(val.length != 0){
            setData({
                ... data,
                tel:val,
                check_textInputChangeTel:false,
                isValidTel:false
            });
        }
    }
    const textInputChangeAdresse=(val) =>{
        if(val.length >2){
            setData({
                ... data,
                adresse:val,
                check_textInputChangeAdresse:true,
                isValidAdresse:true
            });
        }
        else if(val.length != 0){
            setData({
                ... data,
                adresse:val,
                check_textInputChangeAdresse:false,
                isValidAdresse:false
            });

        }
    }
    const textInputChangePassword=(val) =>{
        if(val.length >7){
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
    const textInputChangeConfirmPassword=(val) =>{
        if((password.trim() === val)&&(val.length>7)){
            setData({
                ... data,
                confirm_password:val,
                check_textInputChangeConfirmPassword:true,
                isValidConfirmPassword:true
            });
        }
        else if(val.length != 0){
            setData({
                ... data,
                confirm_password:val,
                check_textInputChangeConfirmPassword:false,
                isValidConfirmPassword:false
            });

        }
    }
    const updateSecureTextEntry=()=>{
        setData({
            ... data,
            secureTextEntry: !data.secureTextEntry
        })
    } 
    const updateConfirmSecureTextEntry=()=>{
        setData({
            ... data,
            confirm_secureTextEntry: !data.confirm_secureTextEntry
        })
    } 

    const [form, setForm] = React.useState({
        email:'',
        nom:'',
        tel:'',
        prenom:'',
        adresse:'',
        password:'',
        confirm_password:''
    })

    const isValidEmail = (value)=>{
        const regx = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        return regx.test(value)
    }
    const isValidObjField =(obj) =>{
        return Object.values(obj).every(value=> value.trim())
    }
    const handleOnChangeText =(value, fieldName)=>{
        setForm({... form, [fieldName]: value})
    }

    const pickFromGallery = async()=>{

        let data= await ImagePicker.launchImageLibraryAsync({
            mediaTypes:ImagePicker.MediaTypeOptions.Images,
            allowsEditing:true,
            aspect:[1,1],
            quality:0.5
        })
        // console.log(data);
        if(!data.cancelled){
            setImage(data);
            setVisible(!visible);
        }

    } 

    const pickFromCamera= async()=>{
        let data= await ImagePicker.launchCameraAsync({
            mediaTypes:ImagePicker.MediaTypeOptions.Images,
            allowsEditing:true,
            aspect:[1,1],
            quality:0.5
        })
        // console.log(data);
        if(!data.cancelled){
            setImage(data);
            setVisible(!visible);
        }

    } 

    const submit = async () => {
     
    if (!isValidObjField(form)){
        Alert.alert('Mouvaise saisie!',"Tous les champs sont obligatoires.",
                         [{ text: "D'accord" }]
            );
    }
        else if ((nom.trim().length<3)||(prenom.trim().length<3)||(adresse.trim().length<3)
                  ||(tel.trim().length<8 || tel.trim().length>8)||(password.trim().length <8)
                  ||(confirm_password !== password))
              {
                Alert.alert('Mouvaise saisie!',"Vérifier vos informations.",
                [{ text: "D'accord" }]
                 );
              } 
   else{
        const formData = new FormData();
      

        if (image) {

            const fileUri = image.uri;
            const newImageUri = "file:///" + fileUri.split("file:/").join("");        
            formData.append("avatar", {
                uri: newImageUri,
                type: mime.getType(newImageUri),
                name: newImageUri.split("/").pop(),
            });
        }

        formData.append('email', email);
        formData.append('nom', nom);
        formData.append('prenom', prenom);
        formData.append('adresse', adresse);
        formData.append('tel', tel);
        formData.append('password', password);
        console.log(formData);
    
        let response = await fetch(`${path}/user/register`,{
            method:"POST",
            headers: {
                Accept: "application/json",
            "Content-Type": "multipart/form-data",
            },
            body:formData
        });
    

        //convertin responce to json
        let resultData = await response.json();
        //checking if there is data
        if (!resultData) {
            return Alert.alert(
                'Erreur',
                "Nothing came back",
                [{ text: 'fermer' }]
            );
        }
    

        if (resultData.message === 'success') {
            const jsonValue = JSON.stringify(resultData.data);
            await AsyncStorage.setItem('user', jsonValue);
            setChanged("logged");
            
            Alert.alert(
                'Inscription effectué avec succès',
                `Bienvenue ${resultData.data.nom} ${resultData.data.prenom} `,
                [{ text: 'fermer' }]
            );
          }  else {
            Alert.alert(
                'Désolé!',
                resultData.message,
                [{ text: "D'accord" }]
            );}
}
    }

  return (
    <View style={styles.container}>
      
          <StatusBar backgroundColor="#01ab9d" barStyle="light-content"/>
          <View style={styles.header}>
            <Text style={styles.text_header}>Inscrivez vous maintenant !</Text>         
          </View>

      <Animatable.View 
                        animation="fadeInUpBig"
                        style={styles.footer}
        >
       <ScrollView showsVerticalScrollIndicator={false}>
     
            <TouchableOpacity
                        style={{borderRadius: 250, borderWidth: 1, width: 45.5, height: 46.5, borderColor: '#05375a',
                                 padding: 0, marginLeft:300, display: 'flex', alignContent: 'center', alignItems: 'center'}}
                        onPress={() => setVisible(!visible)}
            >
                        {image ?
                            <Image
                                style={{width: 45, height: 45, resizeMode: 'contain', borderRadius: 250,  }}
                                source={{uri: image.uri}}
                            />
                        :
                            <Image
                                style={{width: 45, height: 45, resizeMode: 'contain', borderRadius: 250,  }}
                                source={ require('../../assets/avatar.png')}
                            />
                        }
            </TouchableOpacity>

                <Text style={styles.text_footer}>E-mail : </Text>
                <View style={styles.action}>
                    <FontAwesome 
                                 name="user-o"
                                 color="#05375a"
                                 size={20}
                    />
                <TextInput
                    style={styles.textInput}
                    onChangeText={(text)=> [setEmail(text), textInputChangeEmail(text), handleOnChangeText(text, 'email')]}
                    placeholder="Votre E-mail"
                    keyboardType="email-address"
                    autoCapitalize='none'
                    value={email}
                />
                {data.check_textInputChangeEmail ?
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
                {data.isValidEmail ? null :
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
             {data.isValidEmail ? null :  <Animatable.View animation="fadeInLeft" duration={500}>
             <Text style={{color:'red'}}>E-mail invalide</Text>
             </Animatable.View> }
             <Text style={[styles.text_footer, {marginTop:15}]}>Nom : </Text>
             <View style={styles.action}>
             <AntDesign 
                                 name="tago"
                                 color="#05375a"
                                 size={20}
             />
            <TextInput
                        style={styles.textInput}
                        onChangeText={(text)=>[ setNom(text), textInputChangeNom(text),handleOnChangeText(text, 'nom')]}
                        placeholder="Votre nom"
                        keyboardType="default"
                        value={nom}

                    />
                {data.check_textInputChangeNom ?
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
                 {data.isValidNom ? null :
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
                {data.isValidNom ? null :  <Animatable.View animation="fadeInLeft" duration={500}>
             <Text style={{color:'red'}}>Le nom doit etre supérieur à 2 caractères</Text>
             </Animatable.View> }
                <Text style={[styles.text_footer, {marginTop:15}]}>Prénom : </Text>
             <View style={styles.action}>
             <AntDesign 
                                 name="tago"
                                 color="#05375a"
                                 size={20}
             />
                      <TextInput
                        style={styles.textInput}
                        onChangeText={(text)=> [setPrenom(text), textInputChangePrenom(text),handleOnChangeText(text, 'prenom')]}
                        placeholder="Votre prénom"
                        keyboardType="default"
                        value={prenom}

                    />
                    {data.check_textInputChangePrenom ?
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
                {data.isValidPrenom ? null :
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
            {data.isValidPrenom ? null :  <Animatable.View animation="fadeInLeft" duration={500}>
             <Text style={{color:'red'}}>Le prénom doit etre supèrieur à 2 caractères</Text>
             </Animatable.View> }
            <Text style={[styles.text_footer, {marginTop:15}]}>Adresse : </Text>
             <View style={styles.action}>
             <Ionicons 
                                 name="location-outline"
                                 color="#05375a"
                                 size={20}
             />
                    <TextInput
                        style={styles.textInput}
                        onChangeText={(text)=> [setAdresse(text), textInputChangeAdresse(text),handleOnChangeText(text, 'adresse')]}
                        placeholder="Votre adresse"
                        keyboardType="default"
                        value={adresse}

                    />
                    {data.check_textInputChangeAdresse ?
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
                {data.isValidAdresse ? null :
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
                {data.isValidAdresse ? null :  <Animatable.View animation="fadeInLeft" duration={500}>
             <Text style={{color:'red'}}>L'adresse doit etre supèrieur à 2 caractères</Text>
             </Animatable.View> }
            <Text style={[styles.text_footer, {marginTop:15}]}>Numéro de téléphone: </Text>
             <View style={styles.action}>
             <AntDesign 
                                 name="phone"
                                 color="#05375a"
                                 size={20}
             />
                    <TextInput
                        style={styles.textInput}
                        onChangeText={(text)=> [setTel(text),textInputChangeTel(text),handleOnChangeText(text, 'tel')]}
                        placeholder="Votre numéro de Téléphone"
                        keyboardType="numeric"
                        value={tel}

                    />
              {data.check_textInputChangeTel ?
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
                {data.isValidTel ? null :
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
                {data.isValidTel ? null :  <Animatable.View animation="fadeInLeft" duration={500}>
             <Text style={{color:'red'}}>Le numéro de téléphone doit etre composé de 8 chiffres</Text>
             </Animatable.View> }
             <Text style={[styles.text_footer, {marginTop:15}]}>Mot de passe : </Text>
                <View style={styles.action}>
                    <Feather
                                 name="lock"
                                 color="#05375a"
                                 size={20}
                    /> 
                     
                    <TextInput
                    style={styles.textInput}
                    onChangeText={(val) =>[ setPassword(val),textInputChangePassword(val),handleOnChangeText(val, 'password')]}
                    placeholder="Votre mot de passe"
                    secureTextEntry={data.secureTextEntry ? true : false}
                    keyboardType="default"
                    autoCapitalize='none'
                    value={password}

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
                {data.isValidPassword ?  null :
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
                {data.isValidPassword ? null :  <Animatable.View animation="fadeInLeft" duration={500}>
             <Text style={{color:'red'}}>Le mot de passe doit etre supèrieur ou égale à 8 caractères</Text>
             </Animatable.View> }
                 <Text style={[styles.text_footer, {marginTop:15}]}>Confirmer le mot de passe : </Text>
                <View style={styles.action}>
                    <Feather
                                 name="lock"
                                 color="#05375a"
                                 size={20}
                    />
                    <TextInput
                    style={styles.textInput}
                    onChangeText={(val) =>[ setConfirmPassword(val),textInputChangeConfirmPassword(val),handleOnChangeText(val, 'confirm_password')]}
                    placeholder="Votre mot de passe"
                    secureTextEntry={data.confirm_secureTextEntry ? true : false}
                    keyboardType="default"
                    autoCapitalize='none'
                    value={confirm_password}

                />
                <TouchableOpacity
                              onPress={updateConfirmSecureTextEntry}
                >
                    {data.confirm_secureTextEntry ? 
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
                {data.check_textInputChangeConfirmPassword ?
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
                {data.isValidConfirmPassword ? null :
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
                {data.isValidConfirmPassword ? null :  <Animatable.View animation="fadeInLeft" duration={500}>
             <Text style={{color:'red'}}>Les mots de passe sont trop courts ou ne correspondent pas</Text>
             </Animatable.View> }
                <Dialog
                isVisible={visible}
                onBackdropPress={() => setVisible(!visible)}

            >
                {/* <Dialog.Title title="Dialog Title"/> */}
                <View style={{ alignItems: 'center', alignContent: 'center', flexDirection: 'row', margin: 0}}>

                    <TouchableOpacity
                        style={{width: '50%', alignItems: 'center', alignContent: 'center'}}
                        onPress={pickFromGallery}
                    >
                        <Ionicons name='image-outline' size={40} />
                    </TouchableOpacity>
                    <View style={{height: 50, borderWidth: 0.5, borderColor: 'grey'}} />
                    <TouchableOpacity
                        style={{width: '50%', alignItems: 'center', alignContent: 'center'}}
                        onPress={pickFromCamera}
                    >
                        <Ionicons name='ios-camera-outline' size={40} />
                    </TouchableOpacity>
                </View>
            </Dialog>
            
            <TouchableOpacity
                             style={styles.button}
                             onPress={submit}
            >
                <LinearGradient
                             colors={['#08d4c4', '#01ab9d']}
                              style={styles.signIn}
                >
                   <Text style={[styles.textSign, {color:"#fff"}]}>S'inscrire</Text>
              </LinearGradient>
            </TouchableOpacity>
           <TouchableOpacity
                     onPress={() => navigation.navigate('login')}
                     style={[styles.signIn, {borderColor:"#01ab9d", 
                     borderWidth:1, marginTop:15}]}
                >
                    <Text style={[styles.textSign,{color:"#01ab9d"}]}>Connexion</Text>
           </TouchableOpacity>
               
                    </ScrollView>            
            </Animatable.View>
 
        </View>

  )
}

export default RegisterScreen

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#01ab9d'
    },
    header:{
        flex:1,
        justifyContent:'flex-end',
        paddingHorizontal:20,
        paddingBottom:5
        
    },
    footer:{
        flex:4,
        backgroundColor:'#fff',
        borderTopLeftRadius:30,
        borderTopRightRadius:30,
        paddingVertical:10,
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
        marginTop:20
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