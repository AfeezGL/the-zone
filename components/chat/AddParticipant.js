import {Icon} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Button,
  Dimensions,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Contact from '../partials/Contact';
import {isValidPhoneNumber} from 'libphonenumber-js';

const AddParticipant = ({route}) => {
  const {zoneId, zoneName, contacts} = route.params;
  const navigation = useNavigation();
  const [numberInput, setNumberInput] = useState('');

  const changeText = e => {
    setNumberInput(e);
  };

  const selectContact = contact => {
    setNumberInput(contact.number);
  };

  const addUser = () => {
    if (isValidPhoneNumber(numberInput)) {
      firestore()
        .collection('zones')
        .doc(zoneId)
        .collection('participants')
        .add({
          phoneNumber: numberInput,
        });
      firestore().collection('users').doc(numberInput).collection('zones').add({
        zoneId: zoneId,
        zoneName: zoneName,
      });
    }
  };

  const renderContact = ({item}) => {
    return <Contact contact={item} selectContact={selectContact} />;
  };

  return (
    <View>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" type="material-community" color="#938DF3" />
        </TouchableOpacity>
        <Text style={styles.bold}>Add Participant</Text>
      </View>
      <TextInput
        placeholder="enter phone number"
        value={numberInput}
        onChange={changeText}
        style={styles.input}
      />
      <Button title="add" color="#938DF3" onPress={addUser} />
      <FlatList
        data={contacts}
        renderItem={renderContact}
        keyExtractor={contact => contact.id}
        style={styles.list}
      />
    </View>
  );
};

const windowHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  bold: {
    fontWeight: 'bold',
    fontSize: 25,
  },
  input: {
    fontSize: 20,
    padding: 5,
    borderColor: '#938DF3',
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  list: {
    height: windowHeight - 120,
  },
});

export default AddParticipant;
