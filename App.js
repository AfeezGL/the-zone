import React, {useState, useEffect} from 'react';
import {StatusBar, StyleSheet, View, PermissionsAndroid} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from './components/LoginScreen';
import ChatScreen from './components/ChatScreen';
import HomeScreen from './components/HomeScreen';
import CreateZone from './components/CreateZone';
import ZoneDetails from './components/chat/ZoneDetails';
import AddParticipant from './components/chat/AddParticipant';
import Contacts from 'react-native-contacts';
import ProfileScreen from './components/ProfileScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  const [loaded, setLoaded] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    let mounted = true;

    const getAuthCredentials = () => {
      auth().onAuthStateChanged(user => {
        if (mounted) {
          if (user) {
            setPhoneNumber(user.phoneNumber);
          }
          setLoaded(true);
        }
      });
    };

    getAuthCredentials();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const getContacts = async () => {
      try {
        const andoidContactPermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          {
            title: 'Contacts Permission',
            message: 'This app would like to view your contacts.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (andoidContactPermission === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Contacts Permission granted');
          Contacts.getAll().then(async results => {
            const sortedContacts = [];

            results.forEach(contact => {
              if (contact.phoneNumbers !== undefined) {
                contact.phoneNumbers.forEach(phoneNumber => {
                  let rawNumber = String(phoneNumber.number);
                  let normalizedNumber = rawNumber
                    .replace(/ /g, '')
                    .replace(/-/g, '');
                  sortedContacts.push({
                    name: contact.displayName,
                    number: normalizedNumber,
                    id: phoneNumber.id,
                  });
                });
              }
            });

            AsyncStorage.setItem('contacts', JSON.stringify(sortedContacts));
            let fetchContacts = await AsyncStorage.getItem('contacts');
            setContacts(JSON.parse(fetchContacts));
          });
        }
      } catch (err) {
        console.log(err);
      }
    };

    const initializeContacts = async () => {
      let fetchContacts = await AsyncStorage.getItem('contacts');
      if (fetchContacts !== null) {
        setContacts(JSON.parse(fetchContacts));
      } else {
        getContacts();
      }
    };

    initializeContacts();
  }, []);

  return loaded ? (
    <NavigationContainer>
      <View style={styles.container}>
        <StatusBar />
        <Stack.Navigator
          initialRouteName={phoneNumber ? 'HomeScreen' : 'LoginScreen'}
          screenOptions={{headerShown: false, cardOverlayEnabled: false}}>
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            initialParams={{phoneNumber}}
          />
          <Stack.Screen
            name="ChatScreen"
            component={ChatScreen}
            initialParams={{phoneNumber, contacts}}
          />
          <Stack.Screen
            name="CreateZoneScreen"
            component={CreateZone}
            initialParams={{phoneNumber}}
          />
          <Stack.Screen
            name="ZoneDetailsScreen"
            component={ZoneDetails}
            initialParams={{phoneNumber}}
          />
          <Stack.Screen
            name="AddParticipantScreen"
            component={AddParticipant}
            initialParams={{contacts}}
          />
          <Stack.Screen
            name="ProfileScreen"
            component={ProfileScreen}
            initialParams={{phoneNumber}}
          />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
        </Stack.Navigator>
      </View>
    </NavigationContainer>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
