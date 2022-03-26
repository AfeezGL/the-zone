import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {Icon} from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import MyText from './chat/MyText';
import OtherText from './chat/OtherText';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatScreen = ({route}) => {
  const [text, setText] = useState('');
  const {zoneId, zoneName, imageUrl, phoneNumber, contacts} = route.params;
  const [messages, setMessages] = useState([]);
  const [messageStore, setMessageStore] = useState([]);
  const [incomingMessages, setIncomingMessages] = useState([]);
  const [displayName, setDisplayName] = useState(null);
  const [lastText, setLastText] = useState(null);
  const [monitorFrom, setMonitorFrom] = useState(null);

  const navigation = useNavigation();

  const loadPreviousMessages = true;

  //get displayName from local storage, this is gonna be part of the message body when user sends a text in the zone
  useEffect(() => {
    let mounted = true;

    const fetchDisplayName = async () => {
      let savedDisplayName = await AsyncStorage.getItem('displayName');
      let parsedDisplayName = JSON.parse(savedDisplayName);
      if (mounted && parsedDisplayName) {
        setDisplayName(parsedDisplayName);
      }
    };

    fetchDisplayName();

    return () => {
      mounted = false;
    };
  }, []);

  // load last 75 texts in the zone
  useEffect(() => {
    let mounted = true;

    const loadmessages = async () => {
      const ref = firestore()
        .collection('zones')
        .doc(zoneId)
        .collection('messages')
        .orderBy('timestamp', 'desc')
        .limit(75);

      const data = await ref.get();

      if (mounted) {
        setMonitorFrom(data.docs[0]);

        let texts = data.docs.map(message => ({
          id: message.id,
          data: message.data(),
        }));

        setMessages(texts);

        setLastText(data.docs[data.docs.length - 1]);
      }
    };

    loadmessages();

    return () => {
      mounted = false;
    };
  }, [zoneId]);

  // monitor the database for new messages
  useEffect(() => {
    let mounted = true;

    const getNewMessages = async () => {
      firestore()
        .collection('zones')
        .doc(zoneId)
        .collection('messages')
        .orderBy('timestamp', 'desc')
        .endBefore(monitorFrom)
        .onSnapshot(snapshot => {
          const newTexts = snapshot.docs.map(doc => ({
            id: doc.id,
            data: doc.data(),
          }));

          if (mounted) {
            setIncomingMessages(newTexts);
          }
        });
    };

    getNewMessages();

    return () => {
      mounted = false;
    };
  }, [monitorFrom]);

  // combine new messages with the normal loaded messages on screen
  useEffect(() => {
    let mounted = true;

    if (mounted) {
      setMessageStore([...incomingMessages, ...messages]);
    }

    return () => {
      mounted = false;
    };
  }, [incomingMessages, messages]);

  // input change handler
  const changeText = e => {
    setText(e);
  };

  /**   Send message function */
  const sendMessage = () => {
    if (text) {
      if (displayName !== null && displayName !== undefined) {
        firestore().collection('zones').doc(zoneId).collection('messages').add({
          sender: phoneNumber,
          displayName: displayName,
          text: text,
          timestamp: firestore.FieldValue.serverTimestamp(),
        });
      } else {
        firestore().collection('zones').doc(zoneId).collection('messages').add({
          sender: phoneNumber,
          text: text,
          timestamp: firestore.FieldValue.serverTimestamp(),
        });
      }

      firestore().collection('zones').doc(zoneId).update({lastMessage: text});
      setText('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {/** back button */}
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon
              name="chevron-left"
              type="material-community"
              size={50}
              color="#938DF3"
            />
          </TouchableOpacity>
          {/** zone image */}
          <View>
            <Image
              source={
                imageUrl !== null
                  ? {uri: imageUrl}
                  : {
                      uri: 'https://firebasestorage.googleapis.com/v0/b/thezone-5badc.appspot.com/o/pexels-ali-pazani-2878373.jpg?alt=media&token=bfe7fe36-1921-4444-8c4d-7834d9b2e11a',
                    }
              }
              style={styles.avatar}
            />
          </View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ZoneDetailsScreen', {
                zoneId,
                zoneName,
              })
            }>
            <Text style={styles.headerText}>{zoneName}</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/** Messages */}
      <FlatList
        inverted
        data={messageStore}
        style={styles.conversations}
        renderItem={({item}) => {
          if (item.data.sender === phoneNumber) {
            return <MyText message={item} />;
          }
          return <OtherText message={item} contacts={contacts} />;
        }}
        keyExtractor={item => item.id}
      />
      {/* message form */}
      <View style={styles.form}>
        <TextInput
          value={text}
          onChangeText={changeText}
          placeholder="Type a message..."
          style={styles.inputField}
        />

        {/** send button */}

        <TouchableOpacity style={styles.submitBtn} onPress={sendMessage}>
          <Icon
            name="menu-right"
            type="material-community"
            size={40}
            color="#fff"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7FF',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerText: {
    fontSize: 30,
    fontWeight: '500',
    color: '#353645',
  },
  conversations: {
    flex: 0.8,
    paddingHorizontal: 5,
  },
  form: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 9,
    marginTop: 9,
    paddingHorizontal: 5,
  },
  inputField: {
    flex: 0.9,
    backgroundColor: '#F2F3FA',
    fontSize: 18,
    padding: 9,
    borderRadius: 20,
  },
  submitBtn: {
    width: 52,
    height: 45,
    backgroundColor: '#938DF3',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
});

export default ChatScreen;
