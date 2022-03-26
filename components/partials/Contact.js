import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

const Contact = ({contact, selectContact}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => selectContact(contact)}>
      <Text style={styles.name}>{contact.name}</Text>
      <Text>{contact.number}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    borderColor: '#938DF3',
    borderBottomWidth: 1,
    padding: 5,
  },
  name: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Contact;
