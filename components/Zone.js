import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import {Avatar} from 'react-native-elements';

const Zone = ({zoneId, zoneName}) => {
  const navigation = useNavigation();
  const [imageUrl, setImageUrl] = useState(null);
  const [lastMessage, setLastMessage] = useState(null);

  useEffect(() => {
    let mounted = true;
    firestore()
      .collection('zones')
      .doc(zoneId)
      .onSnapshot(snapshot => {
        const data = snapshot.data();
        data.imageUrl && setImageUrl(data.imageUrl);
        data.lastMessage && setLastMessage(data.lastMessage);
      });
    return () => {
      mounted = false;
    };
  }, [zoneId]);

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('ChatScreen', {
          zoneId,
          zoneName,
          imageUrl,
        })
      }>
      <View style={styles.button}>
        <View style={{marginRight: 10}}>
          <Avatar
            size="medium"
            rounded
            source={
              imageUrl
                ? {uri: imageUrl}
                : {
                    uri: 'https://firebasestorage.googleapis.com/v0/b/thezone-5badc.appspot.com/o/pexels-ali-pazani-2878373.jpg?alt=media&token=bfe7fe36-1921-4444-8c4d-7834d9b2e11a',
                  }
            }
          />
        </View>
        <View>
          <Text style={styles.zoneName}>{zoneName}</Text>
          <View style={styles.zoneText}>
            <Text style={styles.text}>{lastMessage}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  image: {
    marginRight: 10,
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  zoneName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#353645',
  },
  zoneText: {
    flexDirection: 'row',
  },
  text: {
    color: '#353645',
  },
});

export default Zone;
