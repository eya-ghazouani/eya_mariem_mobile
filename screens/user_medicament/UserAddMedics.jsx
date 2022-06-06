import React, {useState, useContext,useEffect} from 'react'
import { View, Text, Modal, Alert, StyleSheet, ScrollView, TouchableOpacity, Image, StatusBar } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { TextInput, Button, Title} from 'react-native-paper'
import * as ImagePicker from 'expo-image-picker'
import mime from 'mime';
import DateTimePicker from '@react-native-community/datetimepicker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {MainContext} from '../../hooks/MainContext';
import * as Animatable from 'react-native-animatable';

const today = new Date();

const UserAddMedics = ( {navigation}) => {

    const [error, setError] =useState('')

    const updateError = (error, stateUpdater)=>{
        stateUpdater(error);
        setTimeout(()=>{
           stateUpdater('')
        }, 4500)
   }

   const [categories, setCategories] = useState([]);

   const fetchdata = async () => {

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
        fetchdata();
      }, [])

    const { auth } = useContext(MainContext);

    const [title, setTitle]=useState("")
    const [qte, setQte]=useState("")
    const [type, setType]=useState("")
    const [forme, setForme]=useState("")
    const [category, setCategory]=useState("")
    const [image, setImage]=useState(null);
    const [modal, setModal]=useState(false)

    const [date, setDate] = useState(today);

    const [show, setShow] = useState(false);
    const [selectedValueCategory, setSelectedValueCategory] = useState("");
    const [selectedValueType, setSelectedValueType] = useState("");
    const [selectedValueForme, setSelectedValueForme] = useState("");

    // affiche data picker :: //////////////////////////////////////////////
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
        console.log(moment(date).format('DD/MM/YYYY'));
    };
  
      
  
    const showDatepicker = () => {
        setShow(true);
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
            setImage(data);
            setModal(false)
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
            setImage(data)
            setModal(false);
            // handleUpload()
        }

    } 

    const handleUpload= async()=>{
        if((!selectedValueType)||(!title)||(!qte)||(!image)||(!selectedValueCategory)){
            return updateError('Tous les champs sont obligatoires', setError)
        }
       if(selectedValueType=='Medicament'){
            if(!selectedValueForme) return updateError('Tous les champs sont obligatoire!', setError)
            else if(moment(date).isBefore(moment(today).add(10, 'days'))){
                return updateError('Date invalide', setError)
            }
        }
       

        const fileUri = image.uri;
        const newImageUri = "file:///" + fileUri.split("file:/").join("");
        
        const formData = new FormData();
        
        formData.append("image", {
            uri: newImageUri,
            type: mime.getType(newImageUri),
            name: newImageUri.split("/").pop(),
        });
        if(selectedValueType=='Medicament'){
        formData.append('title', title);
        formData.append('qte', qte);
        formData.append('deadline', moment(date).format('DD/MM/YYYY'));
        formData.append('type', selectedValueType);
        formData.append('forme', selectedValueForme);
        formData.append('category', selectedValueCategory);
        formData.append('etat', false);
        formData.append('userid', auth._id);
        }else{
        formData.append('title', title);
        formData.append('qte', qte);
        formData.append('type', selectedValueType);
        formData.append('category', selectedValueCategory);
        formData.append('etat', false);
        formData.append('userid', auth._id);
        }

      
        let response = await fetch(`${path}/produit/add`,{
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
            Alert.alert("Votre don à été ajouté avec succès, attend la confirmation");

            setImage(null);
            setTitle('');
            setQte('');
            setDate(new Date());
            setType('');
            setForme('')
            setCategory('');

            navigation.push('Medics');
        } else {
            Alert.alert("Error", result.message, [
                { text: "fermer" },
            ]);
        }
    
    }

    return (
        <View style={styles.container}>
        <View style={styles.headerContainer}>
             <Ionicons name="chevron-back-outline" size={30}  color={'#fff'} onPress={()=>navigation.goBack()}/>
             <Text style={styles.headerTitle}>Faire un don</Text>
         </View>  
         <StatusBar backgroundColor="#01ab9d" barStyle="light-content"/>
         <View style={styles.header}>
       <View style={styles.searchContainer}></View> 
       </View>
       <Animatable.View 
                     animation="fadeInUpBig"
                     style={styles.footer}
     >        
          <ScrollView  showsVerticalScrollIndicator={false}>
                <View style={styles.root}>
                {error ? <Text style={{ color: 'red', fontSize:18, textAlign:'center', marginTop:5}}>{error}</Text> : null} 

                    {image && (
                        <Image
                            style={{ width: '40%', height: 150, resizeMode: 'contain', borderRadius: 5, alignSelf: 'center'}} 
                            source={{ uri: image.uri}}
                        />
                    )}
                    <TextInput 
                        label='Nom'
                        style={styles.inputStyle}
                        value={title}
                        mode='outlined'
                        theme={theme}
                        onChangeText={text => setTitle(text)}
                    />

                    <TextInput 
                        label='Quantité'
                        style={styles.inputStyle}
                        value={qte}
                        mode='outlined'
                        theme={theme}
                        onChangeText={text => setQte(text)}
                        keyboardType='number-pad'
                    /> 
                    {/* <TextInput 
                        label='Deadline'
                        style={styles.inputStyle}
                        value={deadline}
                        mode='outlined'
                        theme={theme}
                        onChangeText={text => setDeadline(text)}
                    /> */}

                   
                    {/* <TextInput 
                        label='Type'
                        style={styles.inputStyle}
                        value={type}
                        mode='outlined'
                        theme={theme}
                        onChangeText={text => setType(text)}
                    />  */}
                    {/* <TextInput 
                        label='Category'
                        style={styles.inputStyle}
                        value={category}
                        mode='outlined'
                        theme={theme}
                        onChangeText={text => setCategory(text)}
                    />  */}
                <View style={{flexDirection:'row'}}>
                 <Title style={{padding:5, margin:5,width: '30%'}}>Type:</Title>
                    <View style={{}}>
                         <Picker
                            selectedValueType={selectedValueType}
                            style={{ height: 50, width: 250 }}
                            onValueChange={(itemValue, itemIndex) => setSelectedValueType(itemValue)}
                            mode='dropdown'
                        >
                            <Picker.Item label="Choisir le type"  /> 
                            <Picker.Item label="Medicament" value="Medicament" />
                            <Picker.Item label="Produit paramedical" value="Produit Paramedical" />    
                        </Picker> 
                        </View>
                    </View>        
           {selectedValueType=='Medicament' ? <View style={{flexDirection:'row'}}>
                 <Title style={{padding:5, margin:5,width: '30%'}}>Forme:</Title>
                    <View style={{}}>
                         <Picker
                            selectedValueForme={selectedValueForme}
                            style={{ height: 50, width: 250 }}
                            onValueChange={(itemValue, itemIndex) => setSelectedValueForme(itemValue)}
                            mode='dropdown'
                        >
                            <Picker.Item label="Choisir la forme"  /> 
                            <Picker.Item label="Comprimé" value="Comprime" />
                            <Picker.Item label="Tablette" value="Tablette" /> 
                            <Picker.Item label="Sachet" value="Sachet" />  
                            <Picker.Item label="Paquet" value="Paquet" />              
                            <Picker.Item label="Bouteille" value="Bouteille" /> 
                            <Picker.Item label="Tube" value="Tube" />   
                            <Picker.Item label="Ampoule" value="Ampoule" /> 
                            <Picker.Item label="Injection" value="Injection" />             
                        </Picker> 
                        </View>
                    </View> : null}
                    
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
                        {selectedValueType=='Medicament' ?    <TouchableOpacity 
                        style={{width: '100%', flexDirection: 'row', color: "#383838", alignItems: 'center', marginLeft: 8 }}
                        onPress={showDatepicker}
                    >
                        {/* <Text style={{ fontSize: 18, color: "#383838"}} >{moment(date).format('DD/MM/YYYY')}</Text> */}
                        <TextInput 
                            label="Date d'expiration"
                            style={{width: '85%', padding: 0, height: 35, marginRight: 5}}
                            value={moment(date).format('DD/MM/YYYY')}
                            mode='outlined'
                            theme={theme}
                            editable={false}
                            keyboardType='default'

                        /> 
                        <AntDesign name='calendar' size={35} color='#383838' />
                    </TouchableOpacity> : null}
                    {show && selectedValueType=='Medicament' && (
                        <DateTimePicker
                        // testID="dateTimePicker"
                        value={date}
                        mode="date"
                        is24Hour={true}
                        display="default"
                        onChange={onChange}
                        />
                    )}
                    <Button 
                        icon={image==""?"upload": "check"}
                        mode="contained" 
                        onPress={() => setModal(true)}
                        style={{ margin: 10}}
                        theme={theme}
                    >   Télécharger une image</Button>
                    <Button 
                        icon="content-save"
                        mode="contained" 
                        onPress={() => handleUpload()}
                        style={{ margin: 10}}
                        theme={theme}
                    >Enregistrer</Button>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modal}
                        onRequestClose={()=>{
                            setModal(false)
                        }}
                    >
                        <View style={styles.modalView}>
                            <View style={styles.modalButtonView}>
                                <Button 
                                    icon="camera"  
                                    mode="contained" 
                                    onPress={() => pickFromCamera()}
                                    theme={theme}
                                >Caméra</Button>
                                <Button 
                                    icon="image-area" 
                                    mode="contained"
                                    onPress={() => pickFromGallery()}
                                    theme={theme}
                                >Galerie</Button>
                            </View>
                            <Button 
                                theme={theme}
                                onPress={() => setModal(false)}
                            >Annuler</Button>

                        </View>
                    </Modal>
                </View>
            </ScrollView>
            </Animatable.View>
        </View>
    )
}
const theme={
  colors:{
    primary:"#01ab9d"
  }
}
const styles=StyleSheet.create({
  root:{
    flex:1
  },
  inputStyle:{
    margin:10,
    height: 35,
    borderColor:"#01ab9d"
  },
AppContainer:{
  flex:1,
  backgroundColor:'#f7f3f3',
  paddingTop: 60
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
container:{
    flex:1,
    backgroundColor:'#01ab9d'
},
header:{
  flexDirection:'row',
  justifyContent:'space-around',
  marginTop:50,

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
width: 120,
textAlign:'center',
color:'#fff'

},
footer:{
flex:2,
backgroundColor:'#fff',
borderTopLeftRadius:30,
borderTopRightRadius:30,
paddingVertical:10,
paddingHorizontal:20, 
},
section: {
flex: 1,
flexDirection: 'row',
flexWrap: 'wrap',
justifyContent: 'center',
},
searchContainer:{
flexDirection:'row',
backgroundColor:'#fff',
borderRadius:5,

},
})
export default UserAddMedics