import React, {useContext, useState, useEffect} from 'react'
import { View, Text, TouchableOpacity, StatusBar,SafeAreaView , Image,StyleSheet, 
         ScrollView, TextInput} from 'react-native'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Categorie_card from '../components/Categorie_card';
import Card_product from '../components/Card_product';
import { MainContext } from '../hooks/MainContext';
import * as Animatable from 'react-native-animatable';


const HameScreen = ({ navigation }) => {


  let {auth, setChanged} = useContext(MainContext);

  const [filterData, setfilterData] = useState([]);
  const [masterData, setmasterData] = useState([]);
  const [filterDataCat, setfilterDataCat] = useState([]);
  const [masterDataCat, setmasterDataCat] = useState([]);
  const [search, setsearch] = useState('');

  const fetchcat = async () => {

    let response = await fetch(`${path}/categorie`,{
      method:"GET",
      headers: {
          "Content-Type": "application/json"
      
      }
  });

  let result = await response.json();
  if (result.message === "success") {
      setmasterDataCat(result.data);
      setfilterDataCat(result.data);
  }
}

  const fetchdata = async () => {

    let response = await fetch(`${path}/produit`,{
        method:"GET",
        headers: {
            "Content-Type": "application/json"
        
        }
    });

    let result = await response.json();
    if (result.message === "success") {
        setmasterData(result.data);
        setfilterData(result.data);
    }
}

useEffect(() => {
  fetchdata();
  fetchcat();
}, [])

  const searchFilterProd = (text) => {
    if(text) {
        const NewData = masterData.filter((item) => {
            const itemData = item.title? item.title.toUpperCase() : ''.toUpperCase();
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
const searchFilterCat = (text) => {
  if(text) {
      const NewData = masterDataCat.filter((item) => {
          const itemData = item.nom? item.nom.toUpperCase() : ''.toUpperCase();
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
      });
      setfilterDataCat(NewData);
      setsearch(text);
  } else {
      setfilterDataCat(masterDataCat);
      setsearch(text);
  }
}


  return (

    <SafeAreaView style={styles.container}> 
                   <StatusBar backgroundColor="#01ab9d" barStyle="light-content"/>
                   
    <View>
      <Image style={{width:55,height:55,borderRadius:55/2, marginLeft:330, marginBottom:10, marginTop:10}} source={require('../assets/dawini6.png')}/>
    </View>

            <Animatable.View 
                        animation="fadeInUpBig"
                        style={styles.footer}
        >
                      <ScrollView showsVerticalScrollIndicator={false}>
    <View style={{marginTop:30, flexDirection:'row'}}>
      <View style={styles.searchContainer}>
              <EvilIcons name="search" size={25} style={{marginLeft:20}} />
              <TextInput placeholder='Chercher une categorie' onChangeText={(texte) => searchFilterCat(texte)}/>
      </View>
    </View>
    <View>
      <Text style={styles.titleCategories}>Catégories</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollViewCategories}>
      {filterDataCat.length === 0 ?
          <View style={{width: '100%', marginTop: '15%'}}  >
            <Text style={{fontSize: 35, color: 'grey', alignSelf: 'center'}}>Pas des gatégories!</Text>
          </View>
        :
         <>
          
          {filterDataCat.map(({nom, image, _id}, idx) => {
            return (
              <TouchableOpacity 
                key={idx}
                onPress={() => navigation.push('Medics', {id: _id})}
              >
               { nom != 'Inconnu' ? <Categorie_card image={image} nom={nom} id={_id} /> : null }
              </TouchableOpacity>
            );
          })} 
          </>
}
          
      </ScrollView>
    </View>
    <View style={{marginTop:30, flexDirection:'row'}}>
      <View style={styles.searchContainer}>
              <EvilIcons name="search" size={25} style={{marginLeft:20}} />
              <TextInput placeholder='Chercher un produit' onChangeText={(texte) => searchFilterProd(texte)}/>
      </View>
    </View>
 
    <View>
    <View style={styles.wrapperHeadProducts}>
    <Text style={styles.titleProducts}>Produits</Text>

    </View>
    <View style={styles.section}>
    {filterData.length === 0 ?
          <View style={{width: '100%', marginTop: '15%'}}  >
            <Text style={{fontSize: 35, color: 'grey', alignSelf: 'center'}}>Pas des produits!</Text>
          </View>
        :
         <>
    {filterData.map(({title, image,qte, _id, etat}, idx) => {
               if ( qte > 0) {   
            return (
              <TouchableOpacity 
                key={idx}
                onPress={() => navigation.push('Details_Medic', {id: _id})}
              >
              <Card_product image={image} title={title} id={_id}/> 
             
              </TouchableOpacity>
            ); }
          })} 
          </> 
          }
    </View>
    </View>
    </ScrollView> 
    </Animatable.View>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  container:{
     flex:1,
     backgroundColor:'#01ab9d',
  },
  header:{
    flexDirection:'row',
    justifyContent:'space-between',

  },
  searchContainer:{
    height:40,
    backgroundColor:'#F1F1F1',
    borderRadius:12,
    flex:1,
    flexDirection:'row',
    alignItems:'center'
  },
  categoryText:{
    fontSize:16,
    color:'grey',
    fontWeight:'bold'
  },
  scrollViewCategories: {
    paddingLeft: 20,
  },
  titleCategories:{
    fontSize:18,
    fontWeight:'bold',
    color:'#01ab9d',
    padding:10,

  },
  wrapperHeadProducts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  titleProducts: {
    color:'#01ab9d',
    fontWeight:'bold',
    fontSize: 18,
    padding:10,

  },
  textSeeAll: {
    color: 'black',
    fontWeight:'bold',
    fontSize: 12,
    padding:15,

  },
  section: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  footer:{
    flex:4,
    backgroundColor:'#fff',
    borderTopLeftRadius:30,
    borderTopRightRadius:30,
    paddingVertical:10,
  },
})
export default HameScreen