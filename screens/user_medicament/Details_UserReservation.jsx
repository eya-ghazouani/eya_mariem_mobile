import React, {useState,useContext, useEffect} from 'react';
import { StyleSheet, Text,View, Alert, Image, Dimensions, TouchableOpacity,Modal, TextInput,
         StatusBar } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';  
import {Card} from 'react-native-shadow-cards';
import {Button, Title, FAB}from 'react-native-paper'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { MainContext } from '../../hooks/MainContext'
import moment from 'moment';
import * as ImagePicker from 'expo-image-picker';
import mime from 'mime';
import * as Animatable from 'react-native-animatable';
import { Dialog } from '@rneui/themed';
import { ScrollView } from 'react-native-gesture-handler';

const WindowHeight = Dimensions.get('window').height;
const today = new Date();

const Details_UserReservation = ({ route, navigation }) => {

 const annulerReserv =() =>{

    fetch(`${path}/reservation/${id}`,{
        method:'delete',
        headers:{
            'Conten-Type': 'application/json'
        },
        params: JSON.stringify({
            id : id
        })
        })
        .then(res=>res.json())
        .then(deletedReservation=>{
            Alert.alert("Réservation annulée avec succès")
        })
        .catch(err=>{
            Alert.alert("something went wrong")
    })
    fetchData
    navigation.push("Reservation")
   
}
    const [date, setDate] = useState(today);
    const [show, setShow] = useState(false);

    const [modalOrd, setModalOrd]= useState(false);
    const [error, setError] =useState('');
    const [visible1, setVisible1] = useState(false);
    const toggleDialog1 = () => {
        setVisible1(!visible1);
    };

const updateError = (error, stateUpdater)=>{
        stateUpdater(error);
        setTimeout(()=>{
           stateUpdater('')
        }, 4500)
   }
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
        console.log(moment(date).format('DD/MM/YYYY'));
    };
    
    const pickFromGallery = async()=>{

        let data= await ImagePicker.launchImageLibraryAsync({
            mediaTypes:ImagePicker.MediaTypeOptions.Images,
            allowsEditing:true,
            aspect:[1,1],
            quality:0.5
        })
        // console.log(data);
        if(!data.cancelled){
            setImageOrd(data);
            setModalOrd(false)
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
            setImageOrd(data)
            setModalOrd(false);
            // handleUpload()
        }

    } 

    const { auth, setChanged } = useContext(MainContext); const [password, setPassword] = useState(null);
    let { id } = route.params;
   
    const [qte_reserv, setQteReserv] = useState('')
    const [date_reserv, setDateReserv] = useState('')
    const [modal, setModal]= useState(false)
    const [imageOrd, setImageOrd] = useState(null);
    const [picOrd, setPicOrd] = useState(null);
    const [pic, setPic] = useState(null);
    const [title, setTitle] = useState('')
    const [qte, setQte] = useState('')
    const [confirm, setConfirm] = useState(null)
    const [type, setType] = useState('')
    const [forme, setForme] = useState('')
    const [deadline, setDeadline] = useState('')
    const [category, setCategory] = useState('')
    const [categories, setCategories] = useState([]);

    const fetchData = async () => {
        
        let result = await fetch(`${path}/reservation/${id}`);

        let resultData = await result.json();

         let resultprod = await fetch(`${path}/produit/${resultData.data.idproduit}`);

          let resultDataprod = await resultprod.json();

        if (resultData.success === true ){
            setQteReserv(resultData.data.qte_reserv)
            setPic(resultDataprod.data.image)
            setPicOrd(resultData.data.ordonnance)
            setDateReserv(resultData.data.date_reserv);
            setTitle(resultDataprod.data.title)
            setType(resultDataprod.data.type);
            setCategory(resultDataprod.data.category);
            setQte(resultDataprod.data.qte);
            setForme(resultDataprod.data.forme)
            setPic(resultDataprod.data.image)
            setDeadline(resultDataprod.data.deadline);
            setConfirm(resultDataprod.data.confirm);
        } else {
            Alert.alert(
                'ERROR',
                "Something went Wrng",
                [{ text: 'fermer' }]
            );
        }

    }

    const fetchcateg = async () => {
        let response = await fetch(`${path}/categorie`,{
            method:"GET",
            headers: {
                "Content-Type": "application/json"
            
            }
        });

        let result = await response.json();
        if (result.message === "success") {
            setCategories(result.data);
        }
    }

    useEffect(() => {

        fetchData();
        fetchcateg();
    }, [])

    const Submit = async () => {
        if (!qte_reserv) return updateError('Tous les champs sont obligatoire!', setError)
else{
        const url = `${path}/reservation/${id}`;
        const formData = new FormData();
        if(imageOrd) {
            const fileUri = imageOrd.uri;
            const newImageUri = "file:///" + fileUri.split("file:/").join("");
            formData.append("ordonnance", {
            uri: newImageUri,
            type: mime.getType(newImageUri),
            name: newImageUri.split("/").pop(),
            });
        }
        formData.append("qte_reserv", qte_reserv);

        const options = {
            method: "PATCH",
            body: formData,
            headers: {
                Accept: "application/json",
                "Content-Type": "multipart/form-data",
            },
        };

        let response = await fetch( url, options);

        let result = await response.json();
        console.log('====================================');
        console.log(result);
        console.log('====================================');
        if (result.success === true ) {
            Alert.alert("Succès", result.message, [
            { text: "fermer" },
            ]);
         
            fetchData();
            setModal(false);
            
        } else {
            Alert.alert("Error", result.message, [
            { text: "fermer" },
            ]);
        }
    }

    }

  return (
    <View style={styles.container}>
               <StatusBar backgroundColor="#01ab9d" barStyle="light-content"/>
    <View style={styles.headerContainer}>
       <Ionicons name="chevron-back-outline" size={30}  color={'#fff'} onPress={()=>navigation.goBack()}/>
       <Text style={styles.headerTitle}>Détails</Text>
   </View>
<View style={styles.header}>
   <Text style={styles.text_header}>Détails du réservation :</Text>         
   </View>
   <Animatable.View 
                   animation="fadeInUpBig"
                   style={styles.footer}
   >

<Card style={{width: '45%', height:'22%',marginLeft:90}} >
       <Image
           style={{ width: 60, height: 60, resizeMode: 'contain', borderRadius: 10, alignSelf: 'center'}}
           source={{ uri:`${path}/uploads/images/${pic}`}}
       />
       <View style={{ width: '100%', display: 'flex' }} >
           <Text style={{fontSize: 25, fontWeight: '500',alignSelf: 'center' }}>{title}</Text>
       </View>
       </Card>
       <ScrollView showsVerticalScrollIndicator={false}>
       <View style={{ width: '100%', display: 'flex'}} >

           
           <Text style={{fontSize: 20, fontWeight: '600', marginTop:10}} >
               <Text style={{fontWeight:'bold'}}>Quanitité disponible : </Text>{qte} {forme}(s)
           </Text>
           <Text style={{fontSize: 20, fontWeight: '600', marginTop:10}}>
           <Text style={{fontWeight:'bold'}}>Type : </Text>{type}
           </Text>
           
          
           {categories &&
          
               categories.map(({nom, _id}, idx) => {
                 
                   if (category === _id) {
                      
                       return  <Text style={{fontSize: 20, fontWeight: '600', marginTop:10}} key={idx}>
                       <Text  style={{fontWeight:'bold'}}>Catégorie : </Text>{nom}
                       </Text>
                   }
               })
           }
           <Text style={{fontSize: 20, fontWeight: 'bold', alignSelf: 'flex-end', color: 'red'}}>
               {deadline}
           </Text>
           <Text style={{fontSize: 20, fontWeight: '600', marginTop:20}}>
           <Text style={{fontWeight:'bold'}}>Quantité réserver: </Text>{qte_reserv} {forme} (s)
            </Text>

            <Text style={{fontSize: 20, fontWeight: '600', marginTop:10}}>
            <Text style={{fontWeight:'bold'}}>Date de réservation:</Text> {date_reserv}
            </Text>
            <Text style={{fontSize: 20, fontWeight: '600', marginTop:10, fontWeight:'bold'}}>L'ordonnance: </Text>
                <Image
                style={{ width: '50%', height: 140, resizeMode: 'contain', borderRadius: 10, alignSelf: 'center', marginBottom: 10}}
                source={{ uri:`${path}/uploads/images/${picOrd}`}}
            />
       </View>
        <View style={{flexDirection:'row', justifyContent:'space-around', padding:10}}>
     {confirm == false || confirm == true ?   <Button
            icon="playlist-edit"
            mode="contained"
            theme={theme} 
            onPress={() => setModal(true)}
        > Modifier</Button> : null}

        <Modal animationType='slide'
            transparent={true}
            visible={modal}
            onRequestClose={()=>{
                setModal(false)
            }}
        >
            <View style={{ position:'absolute',bottom:10, width:'100%', paddingTop: WindowHeight * 0.05 , paddingHorizontal: WindowHeight * 0.02}}>          
    <LinearGradient
                             colors={['#01ab9d', '#01ab9d']}
                             style={styles.background}
    />
        <View style={{width: '100%'}}>
        <TouchableOpacity 
                    style={{width: '25%'}}
                    onPress={toggleDialog1}
             >
                {imageOrd ?
                    <Image  
                        style={{width: '100%', height: 90, width:90,borderRadius: 90/2}}
                        source={{ uri: imageOrd.uri }}
                    /> 
                :
                    <Image  
                        style={{width: '100%', height: 90, width:90,borderRadius: 90/2}}
                        source={{ uri:`${path}/uploads/images/${pic}`}}
                    /> 
                }
            </TouchableOpacity>

                <View style={{flexDirection:'row'}}>
         <Title style={{padding:5, margin:5,width: '77%'}}>Modifier la quantité à reserver :</Title>
               <TextInput
                    style={{width: '23%', height: WindowHeight * 0.06, marginBottom: "4%", borderWidth: 1, paddingHorizontal: "5%", borderRadius: 5, backgroundColor: 'rgba(230,238,241,1)', borderColor: 'white', fontSize: 16, fontWeight: '700'}}
                     onChangeText={(text) => setQteReserv(text)}
                    value={qte_reserv.toString()}
                    placeholderTextColor='#6d6e6e'
                     placeholder={`${qte_reserv}`}
                     keyboardType="numeric"
                    autoCapitalize='none'
                /> 
                </View>
                {imageOrd && (
         <Image
               style={{ marginTop:5,width: '70%', height: 200, resizeMode: 'contain', borderRadius: 5, alignSelf: 'center'}} 
                source={{ uri: imageOrd.uri}}
           />
                   )}
 
    {error ? <Text style={{ color: 'red', fontSize:18, textAlign:'center', marginTop:5}}>{error}</Text> : null} 
              
    <View style={{alignItems:'center', margin:10}}>
        <TouchableOpacity 
                    style={{width: "40%", backgroundColor: '#fff',  
                    paddingVertical: "3%",  borderRadius: 5, 
                    borderWidth: 1, borderColor: 'white'}}
                    onPress={Submit}
                >
                <Text style={{fontWeight: 'bold', color: '#01ab9d', alignSelf: 'center', fontSize: 16}}>Modifier</Text>
            </TouchableOpacity>

     <Button  
         style={{width: "40%"}}
         theme={themeupload}
          onPress={()=>setModal(false)}  
        >
         Annuler
     </Button>  
     

    </View>
    </View>
    </View>

</Modal>   
{confirm == false || confirm ==true ?<Button
        icon="delete"
        mode='contained'
        theme={theme}
        onPress={() => annulerReserv()}>
         Annuler
     </Button> : null}
</View>
<Dialog
            isVisible={visible1}
            onBackdropPress={toggleDialog1}
        >
            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', 
                           padding:0, margin: 0}}>
                <TouchableOpacity
                    onPress={pickFromGallery}
                >
                    <Ionicons name='image-outline' size={45}  />
                    <Text>Galerie</Text>
                </TouchableOpacity>
                <View style={{height: '100%', borderWidth: 1, borderColor: 'grey'}} />
                <TouchableOpacity
                    onPress={pickFromCamera}
                >
                    <Ionicons name='camera-outline' size={45}  />
                    <Text>Caméra</Text>
                </TouchableOpacity>
            </View>
 
        </Dialog>
        </ScrollView>
</Animatable.View>
    </View>
  )
}

export default Details_UserReservation;
const theme={
    colors:{
      primary:'#01ab9d'
    }
  }
  const themeupload={
    colors:{
      primary:'#fff'
    }
}
const styles = StyleSheet.create({
    modalButtonView:{
        flexDirection:"row",
        justifyContent:'space-around',
        padding:10,
      },
      modalView:{
        position:'absolute',
        bottom:2,
        width:"100%",
        backgroundColor:"white"
      
      },
      inputStyle:{
        margin:15,
        height: 35,
      },
      container:{
        flex:1,
        backgroundColor:'#01ab9d'
    },
    header:{
        flex:1,
        justifyContent:'flex-end',
        paddingHorizontal:20,
        
    },
    headerContainer:{
        flexDirection:'row',
        alignItems:'center',
        paddingVertical:10,
        paddingHorizontal:20,
        justifyContent:'center',
      
      },
      headerTitle:{
        fontSize:20,
        fontWeight:'bold',
        lineHeight:20 * 1.4,
        width: 80,
        textAlign:'center',
        color:'#fff'
      
      },
   
inputStyle:{
        margin:15,
        height: 35,
      },
  modalButtonView:{
  flexDirection:"row",
  justifyContent:'space-around',
  padding:10,
},
modalView:{
  position:'absolute',
  bottom:2,
  width:"100%",
  backgroundColor:"white"

},
footer:{
    flex:10,
    backgroundColor:'#fff',
    borderTopLeftRadius:30,
    borderTopRightRadius:30,
    paddingVertical:10,
    paddingHorizontal:20, 
  },
  text_header:{
    color:'#fff',
    fontWeight:'bold',
    fontSize:30
},
background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: WindowHeight ,
},
})