import {Icon} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  ImageBackground,
  FlatList,
  Text,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import CustomAlert from '../partials/CustomAlert';
import Participant from '../partials/Participant';

const ZoneDetails = ({route}) => {
  const {zoneId, zoneName, phoneNumber} = route.params;
  const [file, setFile] = useState(false);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const [percentage, setPercentage] = useState(1);
  const [zone, setZone] = useState(null);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    let mounted = true;
    firestore()
      .collection('zones')
      .doc(zoneId)
      .onSnapshot(snapshot => {
        if (mounted) {
          setZone(snapshot.data());
        }
      });
    return () => {
      mounted = false;
    };
  }, [zoneId]);

  useEffect(() => {
    let mounted = true;

    firestore()
      .collection('zones')
      .doc(zoneId)
      .collection('participants')
      .onSnapshot(snapshot => {
        if (mounted) {
          setParticipants(
            snapshot.docs.map(user => ({
              id: user.id,
              data: user.data(),
            })),
          );
        }
      });

    return () => {
      mounted = false;
    };
  }, [zoneId]);

  const pickFile = () => {
    // // launch image picker to pick file to be uploaded
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
      },
      async res => {
        if (!res.didCancel) {
          setFile(true);
          // Implement a new Blob promise with XMLHTTPRequest
          const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
              resolve(xhr.response);
            };
            xhr.onerror = function () {
              reject(new TypeError('Network request failed'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', res.assets[0].uri, true);
            xhr.send(null);
          });
          upload(blob, res.assets[0].uri);
        }
      },
    );
  };

  const upload = async (blob, uri) => {
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const storageRef = storage().ref(filename);
    storageRef.put(blob).on(
      'state_changed',
      snapshot => {
        let percentage =
          (snapshot.bytesTransferred / snapshot.totalBytes) * windowWidth;
        setPercentage(percentage);
      },
      error => {
        setError(error);
      },
      async () => {
        let url = await storageRef.getDownloadURL();
        firestore().collection('zones').doc(zoneId).update({imageUrl: url});
        setFile(false);
      },
    );
  };

  return (
    <View style={styles.container}>
      {zone && (
        <ImageBackground
          style={styles.image}
          source={
            zone.imageUrl
              ? {uri: zone.imageUrl}
              : {
                  uri: 'https://firebasestorage.googleapis.com/v0/b/thezone-5badc.appspot.com/o/pexels-ali-pazani-2878373.jpg?alt=media&token=bfe7fe36-1921-4444-8c4d-7834d9b2e11a',
                }
          }>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon
                name="chevron-left"
                type="material-community"
                size={40}
                color="#938DF3"
              />
            </TouchableOpacity>
            {zone.admin === phoneNumber && (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('AddParticipantScreen', {
                    zoneId,
                    zoneName,
                  })
                }>
                <Icon
                  name="account-plus"
                  type="material-community"
                  size={40}
                  color="#928CB7"
                />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity onPress={pickFile} style={styles.editBtn}>
            <Icon
              name="pencil"
              type="material-community"
              size={40}
              color="#928CB7"
            />
          </TouchableOpacity>
        </ImageBackground>
      )}
      {file && (
        <View
          style={{
            width: percentage,
            backgroundColor: 'black',
            height: 10,
          }}></View>
      )}
      <View style={{paddingHorizontal: 5}}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 18,
            color: '#353645',
          }}>
          Participants
        </Text>
        <FlatList
          data={participants}
          renderItem={({item}) => (
            <Participant phoneNumber={item.data.phoneNumber} />
          )}
        />
      </View>
      {error && (
        <CustomAlert message={error} clearMessage={() => setError(null)} />
      )}
    </View>
  );
};

const windowWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7FF',
  },
  header: {
    justifyContent: 'space-between',
    position: 'absolute',
    width: windowWidth,
    flexDirection: 'row',
    zIndex: 10,
    top: 0,
  },
  image: {
    height: 400,
    width: windowWidth,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  editBtn: {
    width: 40,
  },
});

export default ZoneDetails;
