import React, {useState, useContext, useEffect } from 'react'
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, Image, TextInput, Alert, Linking, 
         Platform, Modal, StatusBar} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import { FAB, Card, Title, Button} from 'react-native-paper';
import { Dialog } from '@rneui/themed';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import mime from 'mime';
import {MaterialIcons, Entypo} from '@expo/vector-icons'
import { MainContext } from '../../hooks/MainContext';
import openMap from 'react-native-open-maps'
import Feather from 'react-native-vector-icons/Feather'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AntDesign from 'react-native-vector-icons/AntDesign'

const WindowHeight = Dimensions.get('window').height;

const Profile = () => {
   
    const { auth, setChanged } = useContext(MainContext); const [password, setPassword] = useState(null);
    const [visible1, setVisible1] = useState(false);
    const [image, setImage] = useState(null);
    const [nom, setNom] = useState('')
    const [prenom, setPrenom] = useState('')
    const [adresse, setAdresse] = useState('')
    const [email, setEmail] = useState('')
    const [avatar, setAvatar] = useState(null)
    const [tel, setTel] = useState('')
    const [modal, setModal]= useState(false)
    const[confirm_password, setConfirmPassword] = useState('')
    const [error, setError] =useState('')


    
const updateError = (error, stateUpdater)=>{
         stateUpdater(error);
         setTimeout(()=>{
            stateUpdater('')
         }, 4500)
    }  
    const [data, setData] = React.useState({
        password:'',
        confirm_password:'',
        secureTextEntry: true,
        confirm_secureTextEntry: true,
    }) 
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
const redirectToMap=()=>{
        openMap({query: `${adresse}`});
    }

const openDial=()=>{
   if(Platform.OS === "android"){
      Linking.openURL(`tel: ${tel}`)
    }else {
      Linking.openURL(`telprompt: ${tel}`)
           }
    }

const toggleDialog1 = () => {
        setVisible1(!visible1);
    };

const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
    });
    
        console.log(result);
    
        if (!result.cancelled) {
          setImage(result);
          toggleDialog1();

        }
    };
    
const pickCamera = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
    });
    
        console.log(result);
    
        if (!result.cancelled) {
          setImage(result);
          toggleDialog1();
        }
    };


const fetchData = async () => {
        console.log(auth);
        let result = await fetch(`${path}/user/${auth._id}`);

        let resultData = await result.json();

        if (resultData.success === true ){
            setNom(resultData.data.nom);
            setPrenom(resultData.data.prenom);
            setAdresse(resultData.data.adresse);
            setEmail(resultData.data.email);
            setAvatar(resultData.data.avatar);
            setTel(resultData.data.tel);
        } else {
            Alert.alert(
                'ERROR',
                "Something went Wrng",
                [{ text: 'fermer' }]
            );
        }

    };

    useEffect(() => {
        fetchData();
    }, []);

const logout = async () => {
        await AsyncStorage.removeItem('user');
        setChanged('logedout');
    }


const Submit = async () => {

    if (!nom.trim() || nom.length<3) return updateError('Nom doit etre sup??rieur ?? 2 caract??res!', setError)

        else if (!prenom.trim() || prenom.length<3) return updateError('Pr??nom doit etre sup??rieur ?? 2 caract??res!!', setError)

        else if (!adresse.trim() || adresse.length<3) return updateError('Adresse doit etre sup??rieur ?? 2 caract??res!', setError)

        else if (!tel.toString().trim() || tel.length<8 || tel.length>8) return updateError('Le num??ro de t??l??phone doit etre 8 chiffres!', setError)

        else if((password!==null)&&(password.length <8)) {

         return updateError('Le mot de passe doit etre sup??rieur ?? 8 caract??res!', setError)

        }
        else if((password!==null)&&(password!==confirm_password)) {
        return updateError('Le mot de passe ne correspond pas!', setError)
        }

    else{
        const url = `${path}/user/${auth._id}`;
        const formData = new FormData();
        if(image) {
            const fileUri = image.uri;
            const newImageUri = "file:///" + fileUri.split("file:/").join("");
            formData.append("avatar", {
            uri: newImageUri,
            type: mime.getType(newImageUri),
            name: newImageUri.split("/").pop(),
            });
        }
        if (password) {
            formData.append("password", password);
        }
        formData.append("nom", nom);
        formData.append("email", email);
        formData.append("prenom", prenom);
        formData.append("adresse", adresse);
        formData.append("tel", tel);
        
        const options = {
            method: "PATCH",
            body: formData,
            headers: {
                Accept: "application/json",
                "Content-Type": "multipart/form-data",
            },
        };
        // console.log(formData);

        let response = await fetch( url, options);

        let result = await response.json();
        console.log('====================================');
        console.log(result);
        console.log('====================================');
        if (result.success === true ) {
            Alert.alert("Succ??s", result.message, [
            { text: "fermer" },
            ]);
            await AsyncStorage.removeItem('user');
            const jsonValue = JSON.stringify(result.data);
            await AsyncStorage.setItem('user', jsonValue);
            // setChanged(result.data.avatar);
             setChanged(new Date());
            fetchData();
            setModal(false)
            
        } else {
            Alert.alert("Error", result.message, [
            { text: "fermer" },
            ]);
        }
    }
        
    }
    

return (
 <View style={styles.root}>
            <StatusBar backgroundColor="#01ab9d" barStyle="light-content"/>
  <LinearGradient
                             colors={[ '#01ab9d','#08d4c4']}
                             style={{height:"20%"}}
  />
         <View style={{alignItems:"center"}}>
      <Image  
      style={{width:140, height:140, borderRadius:140/2, marginTop:-50}}
      source={{ uri: `${path}/uploads/images/${avatar}`}}

          /> 
           </View>
   

    <View style={{alignItems:'center', margin:15}}>
         <Title>{nom} {prenom}</Title>
    </View>

  <Card style={styles.mycard} onPress={()=>{
       Linking.openURL(`mailto: ${email}`)
    }}>
        <View style={styles.cardContent} >
           <MaterialIcons name='email' size={32} color='#01ab9d'/>
           <Text style={styles.mytext}>{email}</Text>
        </View>
   </Card>

   <Card style={styles.mycard} onPress={()=>
        openDial()
     }>
      <View style={styles.cardContent}>
          <Entypo name='phone' size={32} color='#01ab9d'/>
          <Text style={styles.mytext}>{tel}</Text>
      </View>
   </Card>

    <Card style={styles.mycard} onPress={()=>{
         redirectToMap()
     }}>
       <View style={styles.cardContent}>
           <Entypo name='location' size={32} color='#01ab9d'/>
           <Text style={styles.mytext}>{adresse} </Text>
       </View>
    </Card>

<View style={{flexDirection:'row', justifyContent:'space-around', padding:10}}>
  <Button
        icon="account-edit"
        mode="contained"
        theme={theme} 
        onPress={() => setModal(true)}> Modifier
    </Button>

  <Modal animationType='slide'
        transparent={true}
        visible={modal}
        onRequestClose={()=>{
            setModal(false)
        }}>
<View style={{ position:'absolute',bottom:20, width:'100%',flex: 1, paddingTop: WindowHeight * 0.1 , paddingHorizontal: WindowHeight * 0.01}}>          
    <LinearGradient
            // Background Linear Gradient
            colors={[ '#01ab9d','#01ab9d']}
            style={styles.background}
    />
        <View style={{width: '100%'}}>
          <View style={{width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <TouchableOpacity 
                    style={{width: '25%'}}
                    onPress={toggleDialog1}
             >
                {image ?
                    <Image  
                        style={{width: '100%', height: 90, width:90,borderRadius: 90/2}}
                        source={{ uri: image.uri }}
                    /> 
                    :
                    <Image  
                        style={{width: '100%', height: 90, width:90,borderRadius: 90/2}}
                        source={{ uri: `${path}/uploads/images/${avatar}`}}
                    /> 
                    }
            </TouchableOpacity>
                <TextInput
                    style={{width: '33%', height: WindowHeight * 0.06, marginBottom: "4%", borderWidth: 1, paddingHorizontal: "5%", borderRadius: 5, backgroundColor: 'rgba(230,238,241,1)', borderColor: 'white', fontSize: 16, fontWeight: '700'}}
                    onChangeText={(text) => setNom(text)}
                    value={nom}
                    placeholderTextColor='#6d6e6e'
                    placeholder="Nom"
                    keyboardType="default"
                    autoCapitalize='none'
                />
                <TextInput
                    style={{width: '33%', height: WindowHeight * 0.06, marginBottom: "4%", borderWidth: 1, paddingHorizontal: "5%", borderRadius: 5, backgroundColor: 'rgba(230,238,241,1)', borderColor: 'white', fontSize: 16, fontWeight: '700'}}
                    onChangeText={(text) => setPrenom(text)}
                    value={prenom}
                    placeholderTextColor='#6d6e6e'
                    placeholder="Pr??nom"
                    keyboardType="default"
                    autoCapitalize='none'
                />
            </View>
            <View style={[styles.action,{ marginTop: "4%"}]}>
             <AntDesign 
                                 name="phone"
                                 color="#fff"
                                 size={35}
             />
               <TextInput
                    style={{width: '80%',textAlign:'center', height: WindowHeight * 0.05, marginBottom: "4%",borderWidth: 1, paddingHorizontal: "5%", borderRadius: 5, backgroundColor: 'rgba(230,238,241,1)', borderColor: 'white', fontSize: 16, fontWeight: '700'}}
                    onChangeText={(text) => setTel(text)}
                    value={tel.toString()}
                    placeholderTextColor='#6d6e6e'
                    placeholder={`${tel}`}
                     keyboardType="numeric"
                    // keyboardType="default"
                    autoCapitalize='none'
                /> 
                </View>
                <View style={styles.action}>
             <Ionicons 
                                 name="location-outline"
                                 color="#fff"
                                 size={35}
             />
                <TextInput
                    style={{width: '80%',textAlign:'center', height: WindowHeight * 0.05, marginBottom: "4%", borderWidth: 1, paddingHorizontal: "5%", borderRadius: 5, backgroundColor: 'rgba(230,238,241,1)', borderColor: 'white', fontSize: 16, fontWeight: '700'}}
                    onChangeText={(text) => setAdresse(text)}
                    value={adresse}
                    placeholderTextColor='#6d6e6e'
                    placeholder='adress'
                    keyboardType="default"
                    autoCapitalize='none'
                />
                </View>
                  <View style={styles.action}>

                <Feather
                         name="lock"
                         color="#fff"
                         size={33}/> 
                 <TextInput
                               
                    style={{width: '80%',textAlign:'center',height: WindowHeight * 0.05, marginBottom: "4%", borderWidth: 1, paddingHorizontal: "5%", borderRadius: 5, backgroundColor: 'rgba(230,238,241,1)', borderColor: 'white', fontSize: 16, fontWeight: '700',marginRight:5}}
                    onChangeText={(text) => setPassword(text)}
                    placeholderTextColor='#6d6e6e'
                    placeholder="Nouveau mot de passe"
                    keyboardType="default"
                    secureTextEntry={data.secureTextEntry ? true : false}
                    autoCapitalize='none'
                    value={password}

                />  
                <TouchableOpacity
                              onPress={updateSecureTextEntry} style={{marginRight:200}}
                >
                    {data.secureTextEntry ? 
                 <Feather 
                        name="eye-off"
                        color='grey'
                        size={33}

                 />  :
                 <Feather 
                        name="eye"
                        color='#fff'
                        size={33}

                 /> 

                    }
                </TouchableOpacity> 
                </View>
                <View style={styles.action}>

                <Feather
                         name="lock"
                         color="#fff"
                         size={34}/> 
                 
                 <TextInput
                    style={{width: '80%',textAlign:'center', height: WindowHeight * 0.05, marginBottom: "4%", borderWidth: 1, paddingHorizontal: "5%", borderRadius: 5, backgroundColor: 'rgba(230,238,241,1)', borderColor: 'white', fontSize: 16, fontWeight: '700',marginRight:5}}
                    onChangeText={(text) => setConfirmPassword(text)}
                    placeholderTextColor='#6d6e6e'
                    placeholder="Confirmer mot de passe"
                    keyboardType="default"
                    secureTextEntry={data.confirm_secureTextEntry ? true : false}
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
                        size={33}

                 />  :
                 <Feather 
                        name="eye"
                        color='#fff'
                        size={33}

                 /> 

                    }
                </TouchableOpacity>
                </View>  
    {error ? <Text style={{ color: 'red', fontSize:18, textAlign:'center', marginTop:5}}>{error}</Text> : null} 

    <View style={{alignItems:'center', margin:10}}>
        <TouchableOpacity 
                    style={{width: "40%", backgroundColor: 'white',  
                    paddingVertical: "3%",  borderRadius: 5,
                    borderWidth: 1, borderColor: '#01ab9d'}}
                    onPress={Submit}
                >
                <Text style={{fontWeight: 'bold', color: '#01ab9d', alignSelf: 'center', fontSize: 16}}>Modifier</Text>
            </TouchableOpacity>

     <Button  
         style={{width: "40%"}}
         color="white"
          onPress={()=>setModal(false)}  
        >
         Annuler
     </Button>  

    </View>
    </View>
    </View>

</Modal>       
</View>
<FAB
        style={styles.fab}
        // small
        icon="logout"
        color='#fff'
        theme={theme}
        onPress={logout}
        // onPress={() => console.log('Pressed')}
    />
        <Dialog
            isVisible={visible1}
            onBackdropPress={toggleDialog1}
        >
            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', 
                           padding:0, margin: 0}}>
                <TouchableOpacity
                    onPress={pickImage}
                >
                    <Ionicons name='image-outline' size={45}  />
                    <Text>Galerie</Text>
                </TouchableOpacity>
            <View style={{height: '100%', borderWidth: 1, borderColor: 'grey'}} />
                <TouchableOpacity
                    onPress={pickCamera}
                >
                    <Ionicons name='camera-outline' size={45}  />
                    <Text>Cam??ra</Text>
                </TouchableOpacity>
            </View>
 
        </Dialog>
  </View>
  
  )
}

export default Profile
const theme={
    colors:{
      primary:'#01ab9d'
    }
  }
const styles = StyleSheet.create({
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: WindowHeight ,
    },
    fab: {
        position: 'absolute',
        // display: 'flex',
        // alignItems: 'center',
        // justifyContent: 'center',
        margin: 16,
        right: 0,
        bottom: 0,
        paddingLeft: 2,
        backgroundColor: '#01ab9d',
        borderWidth: 1, 
        borderColor: 'white'
    },
    root:{
        flex:1, 
    },
    mycard:{
      margin:3
    }, 
    cardContent:{
      flexDirection:'row',
      padding:8
    }, 
    mytext: {
      fontSize:18,
      marginTop:3,
      marginLeft:5
    },
    action:{
        flexDirection:'row',
    },
})
