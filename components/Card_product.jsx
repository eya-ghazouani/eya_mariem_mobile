import { View, Text, Dimensions, StyleSheet,Image, TouchableOpacity } from 'react-native'
import React from 'react'
import {Card} from 'react-native-shadow-cards';

const windowWidth = Dimensions.get('window').width;


const Card_product = ({title,image,id}) => {
  return (
    <Card style={styles.mycard}  >
    <View  key={id} style={styles.cardView}>

      <View style={{ width: '100%', }}>
        <Image
            source={{ uri: `${path}/uploads/images/${image}`}}
        style={styles.image}/>
      </View>
      <View style={styles.viewDesc}>
          <Text numberOfLines={2} style={styles.title}>{title}</Text>
      </View>
    </View> 
  </Card>
  )
}

export default Card_product

const styles = StyleSheet.create({
    viewDesc:{
      // paddingTop: 7,
      // marginLeft:10,
      // fontSize:20,
      width: '100%',
    },
    title:{
      alignSelf: 'center',
      fontWeight:'600',
      fontSize:14
    },
    desc:{
      fontWeight:'600',
      fontSize:10
    },
    mycard:{
      // justifyContent: 'center',
      width: windowWidth * 0.40,
      margin: windowWidth * 0.02,
      borderRadius: 5,
      padding: 3,
      // height: 100,
    },
    cardView:{
      // flexDirection:'row',
      padding:6
  
    },
    image :{
      width:60,
      height:60,
      alignSelf: 'center',
      
    },
})