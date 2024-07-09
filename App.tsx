import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native'
import React, { useState } from 'react'
import firestore from '@react-native-firebase/firestore';
import { useEffect } from 'react';


export default function App() {


const [showList, setShowList] = useState(false)
const [List, setList] = useState<any>(null)
const [HideList, setHideList] = useState(null);


  useEffect(() => {
    getdb();
  }, [])

  const getdb = async () => 
    {
    try {        
      firestore().collection('Show').orderBy('createdAt', 'desc').onSnapshot((snap) => {
        const tempArray : any = []
        snap.forEach((item) => {
          tempArray.push({
            ...item.data(),
            id: item.id
          });
        })

        setList(tempArray)
        
      })
      } catch (error) {
            console.log(error);
      }    
    }


  useEffect(() => {
    gethidedb();
  }, [])

  const gethidedb = async () => 
    {
      try 
      {
          firestore().collection('Hide').onSnapshot((snap) => 
          {
            const temphide : any = []
            snap.forEach((item) => temphide.push({...item.data(), id : item.id}));

            setHideList(temphide);
          })
      }
      catch(err)
      {
        console.log(err);
      }
    }
  
  const handleLike = async () => 
    {
      console.log("Like Pressed");
      // console.log(List);

      try {
       const docRef = await firestore()
        .collection('Show')
        .add({
         Name: 'D',
         createdAt: firestore.FieldValue.serverTimestamp()
      })
     .then(() => {
      console.log('User added!');
    //  console.log('Document written with ID: ', docRef.id);
      });

      } catch (error) {
        console.log(error);
        
      }


    }
   const handleList = async () => 
    {
      console.log(List);
      console.log(List.length);
      showList == true ? setShowList(false) : setShowList(true);
      console.log(showList);
      console.log(List);
      // console.log(HideList);


    }

  const handleLongPress = async (cardId : any, cardVal: any) => 
    {
       console.log(cardId);
       console.log(cardVal);

       try {
        Alert.alert('Delete Note', `Do you really want to Delete ${cardVal} ?`, [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'OK', onPress: () => {firestore().collection('Show').doc(cardId).delete().then(() => {console.log('Deleted')})}},
        ]);
       }
       catch(error)
       {
        console.log(error);
       }
    }

  
  return (
    <View>
    <View>
  <TouchableOpacity onPress={handleLike}>
    <Text style = {styles.button}> Like </Text>
    </TouchableOpacity>
  </View>
  <View>
    <TouchableOpacity onPress={handleList}>
      <Text style = {styles.button}>List</Text>
    </TouchableOpacity>
    {showList && (<FlatList
          data={List}
          renderItem={item => {
            const cardIndex = item.index;
            if (item.item !== null) {
              return (
                <TouchableOpacity onLongPress={ () => handleLongPress(item.item.id, item.item.Name)}>
                  <Text style = {styles.button}>{item.item.Name}</Text>
                </TouchableOpacity>
              );
            }
          }}
        />
    )}

{/* </TouchableOpacity> */}
  
  </View>
  </View>
  )
}

const styles = StyleSheet.create ({
  button : 
  {
    margin: 20, 
    padding: 20, 
    backgroundColor: '#DDDDDD',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: "center"
  }
})