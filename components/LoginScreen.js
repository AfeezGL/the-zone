import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import CustomAlert from './partials/CustomAlert';

const LoginScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [code, setCode] = useState('');
  const [alert, setAlert] = useState(null);
  const navigation = useNavigation();
  const [loginSuccess, setLoginSuccess] = useState(false);

  const requestVerificationCode = async () => {
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirm(confirmation);
      setAlert('Verification code has been sent to your phone..');
    } catch (err) {
      setAlert(`${err.message}`);
    }
  };

  const confirmVerificationCode = async () => {
    try {
      await confirm.confirm(code);
      firestore().collection('users').doc(phoneNumber).set({
        phoneNumber: phoneNumber,
      });
      setAlert('Login successful');
      setLoginSuccess(true);
    } catch (err) {
      setAlert(`${err.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.text}>Phone number</Text>
        <View style={styles.form}>
          <TextInput
            value={phoneNumber}
            placeholder="+1 999 999 9999"
            autoCompleteType="tel"
            keyboardType="phone-pad"
            onChangeText={input => setPhoneNumber(input)}
            style={styles.inputField}
            editable={!confirm}
          />
          <TouchableOpacity
            onPress={requestVerificationCode}
            style={styles.submitBtn}>
            <Text style={styles.text}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/** Display the verification code field when verification code is sent */}
      {confirm ? (
        <View>
          <Text style={styles.text}>Verification code</Text>
          <View style={styles.form}>
            <TextInput
              value={code}
              keyboardType="phone-pad"
              placeholder="123456"
              onChangeText={input => setCode(input)}
              style={styles.inputField}
            />
            <TouchableOpacity
              onPress={confirmVerificationCode}
              style={styles.submitBtn}>
              <Text style={styles.text}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
      {loginSuccess ? (
        <CustomAlert
          message={alert}
          clearMessage={() => {
            setAlert(null);
            setTimeout(
              () => navigation.navigate('HomeScreen', {phoneNumber}),
              100,
            );
          }}
        />
      ) : null}
      {alert ? (
        <CustomAlert message={alert} clearMessage={() => setAlert(null)} />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  text: {
    fontSize: 20,
  },
  form: {
    width: 270,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  inputField: {
    backgroundColor: '#F2F3FA',
    fontSize: 18,
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 20,
  },
  submitBtn: {
    backgroundColor: '#938DF3',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 20,
  },
});

export default LoginScreen;
