import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';

const MyText = ({message}) => {
  return (
    <View style={styles.container}>
      <Text style={{color: 'black'}}>{message.data.text}</Text>
    </View>
  );
};

const windowWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  container: {
    maxWidth: windowWidth * 0.8,
    padding: 10,
    marginBottom: 18,
    marginLeft: 'auto',
    backgroundColor: '#938DF3',
    borderRadius: 18,
  },
});
export default MyText;
