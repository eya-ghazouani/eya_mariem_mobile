import React, {useContext, useState, useEffect} from 'react'
import { View, Text, TouchableOpacity, Dimensions, StyleSheet, TextInput, ScrollView, StatusBar} from 'react-native'
import Ionicons from "react-native-vector-icons/Ionicons"
import * as Animatable from 'react-native-animatable';
import EvilIcons from 'react-native-vector-icons/EvilIcons'

import {Picker} from '@react-native-picker/picker';


import Card_Reservation from '../../components/Card_Reservation';

import { MainContext } from '../../hooks/MainContext';

const windowheight = Dimensions.get('window').height;

const UserReservations = ({ navigation }) => {

  let {auth, setChanged} = useContext(MainContext);
  const [selectedValue, setSelectedValue] = useState('');



  const [filterData, setfilterData] = useState([]);
  const [masterData, setmasterData] = useState([]);
  const [search, setsearch] = useState('');
  
  const fetchdata = async () => {
    let response = await fetch(`${path}/produit/reservation/`,{
      method:"POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: auth._id
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
       <ScrollView  showsVerticalScrollIndicator={false}>

       <View style={styles.section}>

        {filterData.length === 0 ?
          <View style={{width: '100%', marginTop: '15%'}}  >
            <Text style={{fontSize: 35, color: 'grey', alignSelf: 'center'}}>Pas de réservations!</Text>
          </View>
        :
          <>
            {filterData.map(({date_reserv, ordonnance,qte_reserv, _id}, idx)=> {
              return (
                  <TouchableOpacity key={idx}
                      onPress={() => navigation.push('Details_UserReservation', {id: _id})}
                  >
                      <Card_Reservation  date_reserv={date_reserv} ordonnance={ordonnance} qte_reserv={qte_reserv} id={_id} />
                  </TouchableOpacity>
              )
            })}
          </>
        }
      </View>

   </ScrollView>     
   </Animatable.View>
    </View>
  )
}

export default UserReservations 

const styles = StyleSheet.create({
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: windowheight ,
    },
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
  width: 160,
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