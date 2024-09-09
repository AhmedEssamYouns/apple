import { FIREBASE_AUTH, db, storage } from './config';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateProfile } from 'firebase/auth';
import { updateDoc, doc, getDoc,onSnapshot } from "firebase/firestore";
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { ToastAndroid } from 'react-native';

export const fetchUserData = (setUserData, setIsLoading) => {
    const userDocRef = doc(db, "users", FIREBASE_AUTH.currentUser.email);
    const unsub = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
            setUserData(docSnap.data());
            setIsLoading(false);
        }
    });
    return unsub;
};


export const getUserData = async (setUserData, setName, setAddress, setPhone, setImage) => {
    const user = FIREBASE_AUTH.currentUser;
    const userDocRef = doc(db, "users", user.email);

    setName(user.displayName);
    setImage(user.photoURL);

    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
        setUserData(docSnap.data());
        setAddress(docSnap.data().Address);
        setPhone(docSnap.data().Phone);
    }
};

export const handleChooseImage = async (setImage) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
        Alert.alert('Permission denied', 'Sorry, we need camera roll permissions to make this work!');
        return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
    });
    if (!result.canceled) {
        setImage(result.assets[0].uri);
    }
};

export const getLocation = async (setAddress) => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
    }

    let location = await Location.getCurrentPositionAsync({});
    let latitude = location.coords.latitude;
    let longitude = location.coords.longitude;

    let geocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude
    });

    setAddress(geocode[0].city + ', ' + geocode[0].region);
};

export const handleSave = async (Name, Address, Phone, image, setIsLoading, setUserData, router) => {
    setIsLoading(true);
    const user = FIREBASE_AUTH.currentUser;
    const userDocRef = doc(db, 'users', user.email);

    const tasks = [];

    if (image && image !== user.photoURL) {
        const response = await fetch(image);
        const blob = await response.blob();
        const filename = `${user.uid}.jpg`;
        const storageRef = ref(storage, `profile-photos/${filename}`);

        tasks.push(uploadBytes(storageRef, blob).then(() => {
            return getDownloadURL(storageRef); // this generates the download URL for the uploaded photo
        }).then((url) => {
            return url; // we need to return the URL to use it below
        }));
    }

    const updates = {};

    if (Name !== user.displayName) {
        updates.displayName = Name;
    }

    if ((image && image !== user.photoURL) || Object.keys(updates).length > 0) {
        const profileUpdates = {};
        if (Name !== user.displayName) {
            profileUpdates.displayName = Name;
        }
        if (image && image !== user.photoURL) {
            const newImage = await tasks[tasks.length - 1]; // get the URL value from the promise
            profileUpdates.photoURL = newImage;
        }
        tasks.push(updateProfile(user, profileUpdates));
    }

    if (Address !== user.Address || Phone !== user.Phone) {
        updates.Address = Address;
        updates.Phone = Phone;
    }

    if (Object.keys(updates).length > 0) {
        tasks.push(updateDoc(userDocRef, updates));
    }

    await Promise.all(tasks);

    setIsLoading(false);
    router.goBack();

    ToastAndroid.show('Profile updated successfully', ToastAndroid.SHORT);

};
