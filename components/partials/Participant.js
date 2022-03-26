import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const Participant = ({phoneNumber}) => {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    let mounted = true;
    firestore()
      .collection('users')
      .doc(phoneNumber)
      .get()
      .then(snapshot => {
        if (mounted) {
          setUserData(snapshot.data());
        }
      });

    return () => {
      mounted = false;
    };
  }, [phoneNumber]);

  return (
    <View style={styles.container}>
      <Text style={styles.bold}>{userData.displayName}</Text>
      <Text style={{color: '#928CB7'}}>{userData.phoneNumber}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 5,
  },
  bold: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Participant;
