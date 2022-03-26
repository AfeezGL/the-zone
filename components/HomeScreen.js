import React, {useState, useEffect} from 'react';
import {ScrollView, StyleSheet, View, Text} from 'react-native';
import Zone from './Zone';
import Nav from './Nav';
import firestore from '@react-native-firebase/firestore';

const HomeScreen = ({route}) => {
  const [zoneChats, setZoneChats] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const {phoneNumber} = route.params; //capturing uid and phone number from params

  useEffect(() => {
    //fetch user's chat when component mounts
    firestore()
      .collection('users')
      .doc(phoneNumber)
      .collection('zones')
      .get()
      .then(snapshot => {
        const res = snapshot.docs.map(doc => ({
          data: doc.data(),
        }));
        setZoneChats(res);
        setLoaded(true);
      });
  }, [phoneNumber]);

  return (
    //display chats
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>TheZone</Text>
      </View>
      {loaded && (
        <ScrollView>
          {zoneChats.length >= 1 ? (
            zoneChats.map(zone => (
              <Zone
                key={zone.data.zoneId}
                zoneId={zone.data.zoneId}
                zoneName={zone.data.zoneName}
              />
            ))
          ) : (
            <Text>
              You have no active zones, click the plus button to create one
            </Text>
          )}
        </ScrollView>
      )}
      <Nav />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
    backgroundColor: '#FAF7FF',
  },
  header: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#353645',
  },
});

export default HomeScreen;
