import React, {useState,useContext, useEffect} from 'react';
import { StyleSheet, Text,View, Alert, ScrollView, Image, Dimensions, TouchableOpacity,Modal,
         TextInput, StatusBar } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';  
import {Card} from 'react-native-shadow-cards';
import {Button, Title}from 'react-native-paper'
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import mime from 'mime';
import { MainContext } from '../hooks/MainContext'
import moment from 'moment';
import * as Animatable from 'react-native-animatable';

const WindowHeight = Dimensions.get('window').height;
const today = new Date();

const Details_Medic = ({ route, navigation }) => {

    const [error, setError] =useState('')
    const [date, setDate] = useState(today);
    const [show, setShow] = useState(false);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
        console.log(moment(date).format('DD/MM/YYYY'));
    };
    

    const { auth, setChanged } = useContext(MainContext); const [password, setPassword] = useState(null);
    let { id } = route.params;

    const [imageOrd, setImageOrd] = useState(null);
    const [modalOrd, setModalOrd]= useState(false);
    const [qte_reserv, setQteReserv] = useState('');

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
    
    const [modal, setModal]= useState(false)
    const [pic, setPic] = useState(null);
    const [title, setTitle] = useState('')
    const [qte, setQte] = useState('')
    const [type, setType] = useState('')
    const [forme, setForme] = useState('')
    const [deadline, setDeadline] = useState('')
    const [category, setCategory] = useState('')
    const [categories, setCategories] = useState([]);


const updateError = (error, stateUpdater)=>{
        stateUpdater(error);
        setTimeout(()=>{
           stateUpdater('')
        }, 4500)
   }

const handleUpload= async()=>{
    
    if ((!qte_reserv)||(!imageOrd)) return updateError('Tous les champs sont obligatoire!', setError)

    else{
    let resultprod = await fetch(`${path}/produit/${id}`);

    let resultData = await resultprod.json();


        const fileUri = imageOrd.uri;
        const newImageUri = "file:///" + fileUri.split("file:/").join("");
        
        const formData = new FormData();
        
        formData.append("ordonnance", {
            uri: newImageUri,
            type: mime.getType(newImageUri),
            name: newImageUri.split("/").pop(),
        });
        
        formData.append('qte_reserv', qte_reserv);
        formData.append('date_reserv', moment(date).format('DD/MM/YYYY'));
        formData.append('idproduit', resultData.data._id);
        formData.append('iduser', auth._id);

      
        let response = await fetch(`${path}/reservation/reserver`,{
            method:"POST",
            headers: {
                Accept: "application/json",
            "Content-Type": "multipart/form-data",
            },
            body:formData
        });

        let result = await response.json();
        console.log(result);

        if (result.success === true){
            Alert.alert("Succès", result.message, [
                { text: "fermer" },
            ]);

            setImageOrd(null);
            setQteReserv('');
            setDate(new Date());
            navigation.goBack();
        } else {
            Alert.alert("Erreur", result.message, [
                { text: "fermer" },
            ]);
        }
    }
    }

    const fetchData = async () => {

        let result = await fetch(`${path}/produit/${id}`);

        let resultData = await result.json();

        if (resultData.success === true ){
            setTitle(resultData.data.title);
            setType(resultData.data.type);
            setCategory(resultData.data.category);
            setQte(resultData.data.qte);
            setForme(resultData.data.forme)
            setPic(resultData.data.image)
            setDeadline(resultData.data.deadline);
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

   
  return (
    <View style={styles.container}>
               <StatusBar backgroundColor="#01ab9d" barStyle="light-content"/>
         <View style={styles.headerContainer}>
            <Ionicons name="chevron-back-outline" size={30}  color={'#fff'} onPress={()=>navigation.goBack()}/>
            <Text style={styles.headerTitle}>Détails</Text>
        </View>
     <View style={styles.header}>
        <Text style={styles.text_header}>Détails du produit :</Text>         
        </View>
        <Animatable.View 
                        animation="fadeInUpBig"
                        style={styles.footer}
        >
             <Card style={{width: '50%', height:'30%',marginLeft:90, marginTop:10}} >
            <Image
                style={{ width: '80%', height: 80, resizeMode: 'contain', borderRadius: 10, alignSelf: 'center', marginBottom: 10}}
                source={{ uri:`${path}/uploads/images/${pic}`}}
            />
            <View style={{ width: '100%', display: 'flex' }} >
                <Text style={{fontSize: 25, fontWeight: '600',alignSelf: 'center' }}>{title}</Text>
            </View>
            </Card>
            <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ width: '100%', display: 'flex',  marginTop:10}} >

                
                <Text style={{fontSize: 20, fontWeight: '600', marginTop:20}} >
                    <Text style={{fontWeight:'bold'}}>Quanitité disponible : </Text>{qte} {forme} {forme ? <Text>(s)</Text> : null}
                </Text>
                <Text style={{fontSize: 20, fontWeight: '600', marginTop:20}}>
                <Text style={{fontWeight:'bold'}}>Type : </Text>{type}
                </Text>
                
               
                {categories &&
               
                    categories.map(({nom, _id}, idx) => {
                      
                        if (category === _id) {
                           
                            return  <Text style={{fontSize: 20, fontWeight: '600', marginTop:20}} key={idx}>
                            <Text  style={{fontWeight:'bold'}}>Catégorie : </Text>{nom}
                            </Text>
                        }
                    })
                }
               <Text style={{fontSize: 20, fontWeight: 'bold', alignSelf: 'flex-end', color: 'red', marginTop:30}}>
                    {deadline}
                </Text> 
                
            </View>
    
        <View style={{flexDirection:'row', justifyContent:'space-around', padding:20}}>
            
        <Button
            icon="shopping"
            mode="contained"
            theme={theme} 
            onPress={() => setModal(true)}
        >
             Reserver</Button>   
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

   <View style={{flexDirection:'row'}}>
     <Title style={{padding:5, margin:5,width: '70%'}}>Quantité à réserver:</Title>
     <TextInput
         style={{width: '20%', height: WindowHeight * 0.06, marginBottom: "4%", borderWidth: 1, paddingHorizontal: "5%", borderRadius: 5, backgroundColor: 'rgba(230,238,241,1)', borderColor: 'white', fontSize: 16, fontWeight: '700'}}
         onChangeText={(text) =>setQteReserv(text)}
         placeholderTextColor='#6d6e6e'
         placeholder='Qte'
         keyboardType="numeric"
      /> 
   </View>
           
    
     {imageOrd && (
         <Image
               style={{ marginTop:5,width: '70%', height: 200, resizeMode: 'contain', borderRadius: 5, alignSelf: 'center'}} 
                source={{ uri: imageOrd.uri }}
           />
                   )}
  <Button 
         icon="upload"
         mode="contained" 
         onPress={() => setModalOrd(true)}
         style={styles.inputStyle}
         theme={themeupload}
    >
         Sélectionner l'ordonnance
    </Button>
    {error ? <Text style={{ color: 'red', fontSize:18, textAlign:'center', marginTop:5}}>{error}</Text> : null} 

<Modal
    animationType="slide"
     transparent={true}
     visible={modalOrd}
      onRequestClose={()=>{
      setModalOrd(false)
    }}
  >
 <View style={styles.modalView}>
    <View style={styles.modalButtonView}>
        <Button 
          icon="camera"  
          mode="contained" 
          onPress={() => pickFromCamera()}
          theme={theme}
         >
             Caméra
        </Button>
        <Button 
           icon="image-area" 
           mode="contained"
           onPress={() => pickFromGallery()}
           theme={theme}
           >
             Galerie
        </Button>
    </View>
 <Button 
     theme={theme}
      onPress={() => setModalOrd(false)}
  >
      Annuler
 </Button>
 </View>
 
</Modal>
<View style={{alignItems:'center', margin:10}}>
        <TouchableOpacity 
                    style={{width: "40%", backgroundColor: '#fff',  
                    paddingVertical: "3%",  borderRadius: 5, 
                    borderWidth: 1, borderColor: 'white'}}
                    onPress={() => handleUpload()}
         >
                <Text style={{fontWeight: 'bold', color: '#01ab9d', alignSelf: 'center', fontSize: 16}}>Reserver</Text>
        </TouchableOpacity>
<Button  
         style={{width: "40%"}}
         theme={theme}
          onPress={()=>setModal(false)}  
 >
         Annuler
</Button>  
     
</View>
</View>
</View>

</Modal> 

</View>
</ScrollView>

</Animatable.View>
</View>
  )
}

export default Details_Medic;
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
    container:{
        flex:1,
        backgroundColor:'#01ab9d'
    },
    header:{
        flex:1,
        justifyContent:'flex-end',
        paddingHorizontal:20,
        paddingBottom:30
        
    },
    headerContainer:{
        flexDirection:'row',
        alignItems:'center',
        paddingVertical:10,
        paddingHorizontal:20,
        justifyContent:'center',
        marginTop:10
      
      },
      headerTitle:{
        fontSize:20,
        fontWeight:'bold',
        lineHeight:20 * 1.4,
        width: 80,
        textAlign:'center',
        color:'#fff'
      
      },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: WindowHeight ,
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
    flex:4,
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
})