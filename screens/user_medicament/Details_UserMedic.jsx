import React, {useState,useContext, useEffect} from 'react';
import { StyleSheet, Text,View, Alert, ScrollView,StatusBar,
         Image, Dimensions, TouchableOpacity,Modal, TextInput  } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';  
import {Card} from 'react-native-shadow-cards';
import {Button, Title, FAB}from 'react-native-paper'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Dialog } from '@rneui/themed';
import * as ImagePicker from 'expo-image-picker';
import mime from 'mime';
import { MainContext } from '../../hooks/MainContext'
import * as Animatable from 'react-native-animatable';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import AntDesign from 'react-native-vector-icons/AntDesign';

const WindowHeight = Dimensions.get('window').height;
const today = new Date();


const Details_UserMedic = ({ route, navigation }) => {

    const [error, setError] =useState('')

    const updateError = (error, stateUpdater)=>{
        stateUpdater(error);
        setTimeout(()=>{
           stateUpdater('')
        }, 4500)
   }
    const deleteMedic =() =>{
            fetch(`${path}/produit/${id}`,{
                method:'delete',
                headers:{
                    'Conten-Type': 'application/json'
                },
                params: JSON.stringify({
                    id : id
                })
                })
                .then(res=>res.json())
                .then(deletedMedic=>{
                    Alert.alert("Produit annulé avec succès")
                })
                .catch(err=>{
                    Alert.alert("something went wrong")
            })
            navigation.push("Medics")
    }
    const [date, setDate] = useState(today);
    const [show, setShow] = useState(false);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
        console.log(moment(date).format('DD/MM/YYYY'));
    };
  
      
  
    const showDatepicker = () => {
        setShow(true);
    };

    const [selectedValueType, setSelectedValueType] = useState('');
    const [selectedValueForme, setSelectedValueForme] = useState('');
    const [selectedValueCategory, setSelectedValueCategory] = useState('');


    const { auth, setChanged } = useContext(MainContext); const [password, setPassword] = useState(null);
    let { id } = route.params;

    const [modal, setModal]= useState(false)
    const [visible1, setVisible1] = useState(false);
    const [image, setImage] = useState(null);
    const [pic, setPic] = useState(null);
    const [title, setTitle] = useState('')
    const [qte, setQte] = useState('')
    const [type, setType] = useState('')
    const [forme, setForme] = useState('')
    const [etat, setEtat] = useState(null)
    const [confirm, setConfirm] = useState(null)
    const [deadline, setDeadline] = useState('')
    const [category, setCategory] = useState('')
    const [categories, setCategories] = useState([]);

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
            setEtat(resultData.data.etat);

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

    if ((!title)||(!qte)) return updateError('Tous les champs sont obligatoire!', setError)

        const url = `${path}/produit/${id}`;
        const formData = new FormData();
        if(image) {
            const fileUri = image.uri;
            const newImageUri = "file:///" + fileUri.split("file:/").join("");
            formData.append("image", {
            uri: newImageUri,
            type: mime.getType(newImageUri),
            name: newImageUri.split("/").pop(),
            });
        }
        if(((selectedValueType!='Produit Paramedical')&&(type=='Medicament'))
        ||((selectedValueType=='Medicament')&&(type=='Produit Paramedical')))
        {
            if ((!forme)&&(!selectedValueForme)) return updateError('La forme est obligatoire!', setError)

        formData.append("title", title);
        formData.append("qte", qte);
        if(selectedValueType)
           {
        formData.append("type", selectedValueType);
           }else{
            formData.append("type", type);
            }
        if(selectedValueForme)
            {
        formData.append("forme", selectedValueForme);
            }else{
            formData.append("forme", forme);
            }
        if(selectedValueCategory)
            {
        formData.append("category", selectedValueCategory);
            }else{
        formData.append("category", category);
            }
            if ((!deadline)&&(!moment(date).format('DD/MM/YYYY'))) return updateError("La date d'expération est obligatoire!", setError)
            else if(deadline){
                formData.append("deadline",  deadline);
            }
          else  {
                if(moment(date).isBefore(moment(today).add(10, 'days')))
                   {
                return updateError('Date invalide', setError)
                   }else{ 
                formData.append("deadline",  moment(date).format('DD/MM/YYYY'));
                        }
        }

    }else { 
    formData.append("title", title);
    formData.append("qte", qte);
    if(selectedValueType)
    {
        formData.append("type", selectedValueType);
    }else{
        formData.append("type", type);
         }
    if(selectedValueCategory){
        formData.append("category", selectedValueCategory);
    }else{
        formData.append("category", category);
        }
    }

        
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
       
        if (result.success === true ) {
            Alert.alert("Succès", result.message, [
            { text: "fermer" },
            ]);
         
            fetchData();
            setModal(false);
            
        } else {
            Alert.alert("Erreur", result.message, [
            { text: "fermer" },
            ]);
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
                    <Text style={{fontWeight:'bold'}}>Quanitité à donner : </Text>{qte} {forme} {forme ? <Text>(s)</Text> : null}
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
        <View style={{flexDirection:'row', justifyContent:'space-around', padding:10}}>
     {confirm===null  ? <Button
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
    <View style={{ position:'absolute',bottom:1, width:'100%',flex: 1, paddingTop: WindowHeight * 0.02 , paddingHorizontal: WindowHeight * 0.01}}>          
            <LinearGradient
                             colors={['#01ab9d', '#01ab9d']}
                             style={styles.background}
    />
        <View style={{width: '100%'}}>
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
                        source={{ uri:`${path}/uploads/images/${pic}`}}
                    /> 
                }
            </TouchableOpacity>
            <View style={{flexDirection:'row'}}>
            <Title style={{padding:5, margin:5,width: '30%'}}>Nom :</Title>
                <TextInput
                    style={{width: '60%', height: WindowHeight * 0.06, marginBottom: "4%", borderWidth: 1, paddingHorizontal: "5%", borderRadius: 5, backgroundColor: 'rgba(230,238,241,1)', borderColor: 'white', fontSize: 16, fontWeight: '700'}}
                    onChangeText={(text) => setTitle(text)}
                    value={title}
                    placeholderTextColor='#6d6e6e'
                    placeholder="Title"
                    keyboardType="default"
                    autoCapitalize='none'
                />
                </View>

                <View style={{flexDirection:'row'}}>
         <Title style={{padding:5, margin:5,width: '30%'}}>Quantité :</Title>
               <TextInput
                    style={{width: '60%', height: WindowHeight * 0.06, marginBottom: "4%", borderWidth: 1, paddingHorizontal: "5%", borderRadius: 5, backgroundColor: 'rgba(230,238,241,1)', borderColor: 'white', fontSize: 16, fontWeight: '700'}}
                     onChangeText={(text) => setQte(text)}
                    value={qte.toString()}
                    placeholderTextColor='#6d6e6e'
                     placeholder={`${qte}`}
                     keyboardType="numeric"
                    autoCapitalize='none'
                /> 
                </View>
                    
                <View style={{flexDirection:'row'}}>
                 <Title style={{padding:5, margin:5,width: '30%'}}>Type:</Title>
                    <View style={{}}>
                         <Picker
                            selectedValueType={selectedValueType}
                            style={{ height: 50, width: 250 }}
                            onValueChange={(itemValue, itemIndex) => setSelectedValueType(itemValue)}
                            mode='dropdown'
                        >
                            <Picker.Item label="Choisir le type"/>
                            <Picker.Item label="Medicament" value="Medicament" />
                            <Picker.Item label="Produit paramedical" value="Produit Paramedical" />    
                        </Picker> 
                        </View>
                    </View> 

    { (((selectedValueType!='Produit Paramedical')&&(type=='Medicament'))
       ||((selectedValueType=='Medicament')&&(type=='Produit Paramedical'))) ?  
          <View style={{flexDirection:'row'}}>
               <Title style={{padding:5, margin:5,width: '30%'}}>Forme:</Title>
                    <View style={{}}>
                         <Picker
                            selectedValueForme={selectedValueForme}
                            style={{ height: 50, width: 250 }}
                            onValueChange={(itemValue, itemIndex) => setSelectedValueForme(itemValue)}
                            mode='dropdown'
                        >
                            <Picker.Item label="Choisir la forme" />
                            <Picker.Item label="Comprimé" value="Comprimé" />
                            <Picker.Item label="Tablette" value="Tablette" /> 
                            <Picker.Item label="Sachet" value="Sachet" />  
                            <Picker.Item label="Paquet" value="Paquet" />              
                            <Picker.Item label="Bouteille" value="Bouteille" /> 
                            <Picker.Item label="Tube" value="Tube" />   
                            <Picker.Item label="Ampoule" value="Ampoule" /> 
                            <Picker.Item label="Injection" value="Injection" />             
                        </Picker> 
                        </View>
                    </View>  :null }
                    <View style={{flexDirection:'row'}}>
                 <Title style={{padding:5, margin:5,width: '30%'}}>Catégorie:</Title>
                        <Picker
                            style={{ height: 50, width: 250}}
                            onValueChange={(itemValue, itemIndex) => setSelectedValueCategory(itemValue)}
                            mode='dropdown'               
                        >   
                             <Picker.Item label="Choisir la catégorie"  /> 
   
                            {categories &&
                                categories.map(({nom, _id}, idx) => {
                                    return (
                                        <Picker.Item   key={idx} label={nom} value={_id} />
                                        
                                    );
                                })
                            }
                        </Picker>
                        </View>
                    
     { (((selectedValueType!='Produit Paramedical')&&(type=='Medicament'))
       ||((selectedValueType=='Medicament')&&(type=='Produit Paramedical'))) ?  
            <View style={{flexDirection:'row'}}>
                 <Title style={{padding:5, margin:5,width: '50%'}}>Date d'expiration:</Title>
                    <TouchableOpacity 
                        style={{width: '100%', flexDirection: 'row', color: "#383838", alignItems: 'center', marginLeft: 8 }}
                        onPress={showDatepicker}
                    >
                        {/* <Text style={{ fontSize: 18, color: "#383838"}} >{moment(date).format('DD/MM/YYYY')}</Text> */}
                        <TextInput 
                            label="Date d'expiration"
                            style={{height: 35, marginRight: 5,width: '35%', height: WindowHeight * 0.06, borderWidth: 1, paddingHorizontal: "5%", borderRadius: 5, backgroundColor: 'rgba(230,238,241,1)', borderColor: 'white', fontSize: 16, fontWeight: '700'}}
                            value={moment(date).format('DD/MM/YYYY')}
                            mode='outlined'
                            theme={theme}
                            editable={false}
                            keyboardType='default'
                        /> 
                        <AntDesign name='calendar' size={35} color='#383838' />
                    </TouchableOpacity>
                    {show && (
                        <DateTimePicker
                        value={date}
                        mode="date"
                        is24Hour={true}
                        display="default"
                        onChange={onChange}
                        />
                    )} 
                    </View> : null }
    {error ? <Text style={{ color: 'red', fontSize:18, textAlign:'center', marginTop:5}}>{error}</Text> : null} 

    <View style={{alignItems:'center', margin:10}}>
        <TouchableOpacity 
                    style={{width: "40%", backgroundColor: '#fff',  
                    paddingVertical: "3%",  borderRadius: 5, 
                    borderWidth: 1, borderColor: '#01ab9d'}}
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
{confirm===null ? <Button
        icon="delete"
        mode='contained'
        theme={theme}
        onPress={() => deleteMedic()}>
         Annuler
     </Button> :null}
</View>
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
                    <Text>Caméra</Text>
                </TouchableOpacity>
            </View>
 
</Dialog>
</ScrollView>
        </Animatable.View>
    </View>
  )
}

export default Details_UserMedic;
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