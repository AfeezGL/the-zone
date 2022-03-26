import React from 'react';
import {View, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import {Avatar} from 'react-native-elements/dist/avatar/Avatar';

const BottomNav = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.links}>
      <TouchableOpacity onPress={() => navigation.navigate('CreateZoneScreen')}>
        <Icon
          name="plus-circle-outline"
          type="material-community"
          color="black"
          size={40}
        />
      </TouchableOpacity>
      <TouchableOpacity>
        <Avatar
          rounded
          source={{
            uri: 'https://simi-redesign.netlify.app/assets/img4.jpg',
          }}
          onPress={() => navigation.navigate('ProfileScreen')}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  links: {
    flex: 0.1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
});

export default BottomNav;
