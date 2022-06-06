import React, {useContext, useState, useEffect} from 'react'
import { View,TouchableOpacity, Text, TextInput,StyleSheet, StatusBar, ScrollView } from 'react-native'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import * as Animatable from 'react-native-animatable';
import Ionicons from "react-native-vector-icons/Ionicons"

import {Picker} from '@react-native-picker/picker';


import Card_product from '../components/Card_product';

import { MainContext } from '../hooks/MainContext';


const Medic_cards = ({ navigation, route}) => {

  let categorie_id = route.params.id;
  let {auth, setChanged} = useContext(MainContext);
  const [selectedValue, setSelectedValue] = useState('');
  console.log(auth)
  

  const [filterData, setfilterData] = useState([]);
  const [masterData, setmasterData] = useState([]);
  const [search, setsearch] = useState('');
  
  const fetchdata  = async () => {

      let response = await fetch(`${path}/produit/categorie`,{
          method:"POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            categorie_id: categorie_id
          })
      });

      let result = await response.json();
      if (result.message === "success") {
          setmasterData(result.data);
          setfilterData(result.data);
      }
  }


  useEffect(() => {
      fetchdata();
  }, [])
  

  const searchFilter = (text) => {
    if(text) {
      const NewData = masterData.filter((item) => {
        const itemData = item.title ? item.title.toUpperCase() : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setfilterData(NewData);
      setsearch(text);
    } else {
      setfilterData(masterData);
      setsearch(text);
    }
  }
  
  const TypeFilter = (text) => {
    if(text) {
      const NewData = masterData.filter((item) => {
        const itemData = item.type ? item.type.toUpperCase() : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setfilterData(NewData);   
      setSelectedValue(text);
    } else {
      setfilterData(masterData);
      setSelectedValue(text);
    }
  }


  return (
    <View style={styles.container}>
       <View style={styles.headerContainer}>
            <Ionicons name="chevron-back-outline" size={30}  color={'#fff'} onPress={()=>navigation.goBack()}/>
            <Text style={styles.headerTitle}>Produits</Text>
        </View>
          <StatusBar backgroundColor="#01ab9d" barStyle="light-content"/>
          <View style={styles.header}>
          <View style={styles.searchContainer}>
          <EvilIcons name="search" size={40} style={{marginLeft:10, marginTop:10}}/>
          <TextInput
              placeholder='Chercher'
              style={{ backgroundColor: '#fff', borderRadius: 5,  fontSize: 18, width: '55%'}}
              onChangeText={(text) => searchFilter(text)}
          />    
          </View>
          <View style={{ width: '26%', backgroundColor: '#fff', borderRadius: 5}} >
              <Picker
                  selectedValue={selectedValue}
                  onValueChange={(itemValue, itemIndex) => TypeFilter(itemValue)}
              >
                  <Picker.Item label="Tous" value="" />
                  <Picker.Item label="Medicament" value="Medicament" />
                  <Picker.Item label="Produit Paramedical" value="Produit Paramedical" /> 
              </Picker>
          </View>
        </View>  

        <Animatable.View 
                        animation="fadeInUpBig"
                        style={styles.footer}
        >

<ScrollView showsVerticalScrollIndicator={false}>
     

      <View style={styles.section}>
      {filterData.length === 0 ?
          <View style={{width: '100%', marginTop: '15%'}}  >
            <Text style={{fontSize: 35, color: 'grey', alignSelf: 'center'}}>Catégorie vide!</Text>
          </View>
        :
         <>
        {filterData.map(({image, _id, title, qte, etat}, idx)=> {
         if ( qte > 0) {   return (
                <TouchableOpacity key={idx}
                      onPress={() => navigation.push('Details_Medic', {id: _id})}
                  >
                   {etat === true ?    <Card_product  image={image} title={title} id={_id} /> 
                   : null }
                  </TouchableOpacity>
            ) }
        })}  
        </>
        }
      </View>
      </ScrollView>
      </Animatable.View>

    </View>
  )
}

export default Medic_cards

const styles = StyleSheet.create({

  container:{
      flex:1,
      backgroundColor:'#01ab9d'
  },
  header:{
    flexDirection:'row',
    marginTop:80,
    justifyContent:'space-around',
    paddingBottom:80,
    height:130    
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