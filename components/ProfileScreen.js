import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/core';
import React, {useEffect, useState} from 'react';
import {StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import {View} from 'react-native';
import {Avatar, Icon} from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import CustomAlert from './partials/CustomAlert';

const ProfileScreen = ({route}) => {
  const {phoneNumber} = route.params;
  const [displayName, setDisplayName] = useState('Update your display name');
  const [status, setStatus] = useState('Available');
  const [alert, setAlert] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    let mounted = true;
    firestore()
      .collection('users')
      .doc(phoneNumber)
      .onSnapshot(snapshot => {
        if (mounted) {
          snapshot.data().displayName &&
            setDisplayName(snapshot.data().displayName);
          snapshot.data().status && setStatus(snapshot.data().status);
        }
      });
    return () => {
      mounted = false;
    };
  }, [phoneNumber]);

  const submit = () => {
    AsyncStorage.setItem('displayName', JSON.stringify(displayName));
    firestore()
      .collection('users')
      .doc(phoneNumber)
      .update({
        status,
        displayName,
      })
      .then(setAlert('Done'));
  };

  return (
    <View>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            name="chevron-left"
            type="material-community"
            size={40}
            color="#938DF3"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={submit}>
          <Icon
            name="check"
            type="material-community"
            size={40}
            color="#938DF3"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <Avatar
          rounded
          source={{
            uri: 'https://simi-redesign.netlify.app/assets/img4.jpg',
          }}
          size="xlarge"
        />
        <TextInput
          placeholder={displayName}
          value={displayName}
          onChangeText={e => setDisplayName(e)}
          style={styles.inputField}
        />
        <TextInput
          placeholder={status}
          value={status}
          onChangeText={e => setStatus(e)}
          style={styles.inputField}
        />
      </View>
      {alert && (
        <CustomAlert message={alert} clearMessage={() => setAlert(null)} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  header: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputField: {
    backgroundColor: 'gray',
    fontSize: 18,
    padding: 9,
    borderRadius: 20,
    width: 300,
    marginBottom: 10,
    textAlign: 'center',
  },
});
export default ProfileScreen;
