import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import {Icon} from 'react-native-elements';

const CustomAlert = ({message, clearMessage}) => {
  return (
    <View style={styles.container}>
      <Pressable style={styles.pressable} onPress={clearMessage} />
      <View style={styles.message}>
        <Text style={{marginBottom: 20}}>{message}</Text>
        <TouchableOpacity onPress={clearMessage} style={styles.button}>
          <Text>Ok</Text>
          <Icon name="arrowright" type="antdesign" color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const windowHieght = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flex: 1,
    height: windowHieght,
    width: windowWidth,
    justifyContent: 'flex-end',
  },
  pressable: {
    flex: 0.75,
    backgroundColor: '#808080',
    opacity: 0.3,
  },
  message: {
    flex: 0.25,
    backgroundColor: 'white',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    alignItems: 'center',
    padding: 20,
    marginTop: -15,
  },
  button: {
    padding: 10,
    backgroundColor: '#938DF3',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 100,
    borderRadius: 10,
  },
});

export default CustomAlert;
