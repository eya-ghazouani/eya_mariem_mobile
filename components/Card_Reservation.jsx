import React from 'react'
import { View, Text, Dimensions, Image } from 'react-native'
import {Card} from 'react-native-shadow-cards';

const windowWidth = Dimensions.get('window').width;
const windowheight = Dimensions.get('window').height;

const Card_Reservation = ({ date_reserv, ordonnance, id }) => {
  console.log('====================================');
  console.log(ordonnance + '  ' + date_reserv );
  console.log('====================================');
  return (
    <View >
      <Card style={{width: windowWidth * 0.3, height:  windowheight * 0.2, borderRadius: 5, alignContent: 'center', alignItems: 'center', backgroundColor: '#fff', margin: windowWidth * 0.01 }}>
        
          <Image
              source={{ uri: `${path}/uploads/images/${ordonnance}`}}
              style={{ width: '100%', height: windowheight * 0.15, borderTopLeftRadius: 5, borderTopRightRadius: 5}}
          />
          <View style={{ width: '100%', height: windowheight * 0.05, alignItems: 'center', alignContent: 'center'}}  >
              <Text>{date_reserv}</Text>
          </View>
      </Card>
    </View>
  )
}

export default Card_Reservation