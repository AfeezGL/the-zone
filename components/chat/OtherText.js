import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';

const OtherText = ({message, contacts}) => {
  const [sender, setSender] = useState(null);

  const findContact = contacts.filter(item => {
    return item.number === message.data.sender;
  });

  useEffect(() => {
    let mounted = true;

    if (findContact[0]) {
      mounted && setSender(findContact[0].name);
    } else if (message.data.displayName) {
      mounted && setSender(message.data.displayName);
    } else {
      mounted && setSender(message.data.sender);
    }

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.sender}>{sender}</Text>
      <Text style={styles.text}>{message.data.text}</Text>
    </View>
  );
};
const windowWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  container: {
    minWidth: 100,
    maxWidth: windowWidth * 0.8,
    marginBottom: 10,
    marginRight: 'auto',
    backgroundColor: '#FEFEDF',
    borderRadius: 15,
  },
  sender: {
    paddingTop: 5,
    color: '#938DF3',
    paddingHorizontal: 10,
  },
  text: {
    paddingTop: 5,
    paddingHorizontal: 15,
    paddingBottom: 10,
    color: 'black',
  },
});
export default OtherText;
