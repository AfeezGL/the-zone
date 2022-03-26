import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import storage from "@react-native-firebase/storage";

// Initialize Firebase
const db = firestore();
const fireAuth = auth();
const provider = auth.PhoneAuthProvider();
const cloudStorage = storage();
const timestamp = firestore.FieldValue.serverTimestamp;

export { fireAuth, provider, cloudStorage, timestamp };
export default db;
