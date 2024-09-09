import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ALERT_TYPE, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import { Colors } from '../../constants/colors';
import { handleChooseImage, getLocation, handleSave, getUserData } from '../../firebase/userData';

const EditProfile = () => {
    const [Name, setName] = useState('');
    const [Address, setAddress] = useState('');
    const [Phone, setPhone] = useState('');
    const [userData, setUserData] = useState(null);
    const [loading2, setLoading2] = useState(false);
    const [image, setImage] = useState(null);

    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        getUserData(setUserData, setName, setAddress, setPhone, setImage);
    }, []);

    return (
        <AlertNotificationRoot>
            <ScrollView style={styles.container}>
                <View style={styles.imageContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate('ImageScreen',{imageUri: image} )}>
                        <Image source={{ uri: image }} style={styles.image} />
                </TouchableOpacity>
                {image === 'https://th.bing.com/th/id/R.222d79e7bde6db5bb2a2ce526504ddac?rik=mBNCmkbm1VHRfg&pid=ImgRaw&r=0' && (
                    <Text style={styles.noImageText}>No profile image</Text>
                )}
                <TouchableOpacity style={styles.chooseImageButton} onPress={() => handleChooseImage(setImage)}>
                    <Text style={styles.chooseImageButtonText}>Choose image</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.form}>
                <Text style={styles.label}>Name:</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => setName(text)}
                    value={Name}
                    maxLength={16}
                />
                <Text style={styles.label}>Phone number:</Text>
                <TextInput
                    style={styles.input}
                    maxLength={11}
                    onChangeText={(text) => setPhone(text)}
                    value={Phone === 'none' ? "" : Phone}
                    placeholder='enter your phone'
                    keyboardType="phone-pad"
                />
                <Text style={styles.label}>Address:</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => setAddress(text)}
                    value={Address === 'none' ? "" : Address}
                    placeholder='enter your address'
                    keyboardType="default"
                />
                {loading2 ? (
                    <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 10 }} />
                ) : (
                    <TouchableOpacity style={styles.saveButton2} onPress={() => getLocation(setAddress)}>
                        <Text style={styles.saveButtonText}>Get Location</Text>
                    </TouchableOpacity>
                )}
                {isLoading && <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 10 }} />}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.saveButton} onPress={() => handleSave(Name, Address, Phone, image, setIsLoading, setUserData, navigation)}>
                        <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
        </AlertNotificationRoot >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        paddingHorizontal: 20,
        paddingTop: 30,
        paddingBottom: 160,
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    noImageText: {
        fontSize: 16,
        color: Colors.textSecondary,
    },
    chooseImageButton: {
        marginTop: 10,
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: Colors.secondary,
    },
    chooseImageButtonText: {
        color: Colors.background,
        fontSize: 16,
    },
    form: {
        backgroundColor: Colors.cardBackground,
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    label: {
        fontSize: 18,
        color: Colors.textSecondary,
        marginBottom: 5,
    },
    input: {
        backgroundColor: Colors.background,
        color: Colors.textPrimary,
        height: 49,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginBottom: 10,
    },
    saveButton: {
        backgroundColor: Colors.secondary,
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
        alignSelf: 'center',
    },
    saveButton2: {
        backgroundColor: Colors.secondary,
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
        alignSelf: 'center',
        marginTop: 10,
    },
    saveButtonText: {
        color: Colors.background,
        fontSize: 16,
    },
    cancelButton: {
        backgroundColor: Colors.cardBackground,
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
        alignSelf: 'center',
        marginTop: 20,
    },
    cancelButtonText: {
        color: Colors.textPrimary,
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 20,
        padding: 10,
        borderTopWidth: 1,
        borderColor: Colors.border,
    },
});

export default EditProfile;

