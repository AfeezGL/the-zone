import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {Icon} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

const CreateZone = ({route}) => {
  const [name, setName] = useState('');
  const {phoneNumber} = route.params;
  const [linkRef, setLinkRef] = useState('');
  const [created, setCreated] = useState(false);
  const [zoneId, setZoneId] = useState('');

  const navigation = useNavigation();

  const changeText = e => {
    setName(e);
  };

  const submit = () => {
    let mounted = true;
    firestore()
      .collection('zones')
      .add({
        name: name,
        admin: phoneNumber,
      })
      .then(docRef => {
        firestore()
          .collection('users')
          .doc(phoneNumber)
          .collection('zones')
          .add({
            zoneId: docRef.id,
            zoneName: name,
          });
        setZoneId(docRef.id);
        setLinkRef(name);
        setCreated(true);
        setName('');
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}>
          <Icon
            name="chevron-left"
            type="material-community"
            size={40}
            color="#938DF3"
          />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerText}>Create zone</Text>
        </View>
      </View>
      {created && (
        <TouchableOpacity
          style={styles.goToZoneBtn}
          onPress={() =>
            navigation.navigate('ChatScreen', {
              zoneId,
              zoneName: linkRef,
            })
          }>
          <Text style={styles.text}>{linkRef} was created successfully</Text>
          <Icon
            name="arrowright"
            type="antdesign"
            size={24}
            color="black"
            style={styles.greenArrow}
          />
        </TouchableOpacity>
      )}
      <TextInput
        style={styles.inputField}
        value={name}
        onChangeText={changeText}
        placeholder="zone name"
      />
      <TouchableOpacity style={styles.submitBtn} onPress={submit}>
        <Text style={styles.btnText}>Create</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingBottom: 10,
  },
  header: {
    height: 55,
    alignItems: 'center',
    flexDirection: 'row',
  },
  backBtn: {
    padding: 10,
  },
  headerText: {
    fontSize: 30,
    fontWeight: '500',
    color: '#353645',
  },
  inputField: {
    backgroundColor: '#F2F3FA',
    fontSize: 20,
    padding: 9,
    borderRadius: 20,
  },
  submitBtn: {
    backgroundColor: '#938DF3',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  btnText: {
    fontSize: 20,
    padding: 10,
    color: '#F2F3FA',
  },
  goToZoneBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greenArrow: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 10,
  },
  text: {
    fontSize: 17,
  },
});

export default CreateZone;
