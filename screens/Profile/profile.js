import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { fetchUserData } from '../../firebase/userData'; // Ensure this is the correct path
import { Colors } from '../../constants/colors'; // Ensure this is the correct path
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { handleLogout } from '../../firebase/auth'; // Ensure this is the correct path
import { FIREBASE_AUTH } from '../../firebase/config'; // Ensure this is the correct path

const UserProfile = () => {
    const [image, setImage] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState(null);

    const isFocused = useIsFocused();
    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribe = fetchUserData(setUserData, setIsLoading);

        const user = FIREBASE_AUTH.currentUser;

        if (user) {
            if (user.displayName) {
                setName(user.displayName);
            }
            if (user.email) {
                setEmail(user.email);
            }
            if (user.photoURL) {
                setImage(user.photoURL);
            }
        }

        return () => unsubscribe();
    }, [isFocused]);

    if (isLoading || !userData) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.profile}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('ImageScreen', { imageUri: image })}
                        >
                            <Image source={{ uri: image }} style={styles.profileImage} />
                            {image === 'https://th.bing.com/th/id/R.222d79e7bde6db5bb2a2ce526504ddac?rik=mBNCmkbm1VHRfg&pid=ImgRaw&r=0' ? (
                                <Text style={styles.noImageText}>No profile image</Text>
                            ) : null}
                        </TouchableOpacity>
                        <View style={styles.profileInfo}>
                            <Text style={styles.name}>{name}</Text>
                            <Text style={styles.username}>@{userData.name}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.userInfo}>
                    <View style={styles.userInfoRow}>
                        <Text style={styles.label}>Email:</Text>
                        <Text style={styles.info}>{email}</Text>
                    </View>
                    <View style={styles.userInfoRow}>
                        <Text style={styles.label}>Phone:</Text>
                        <Text style={styles.info}>{userData.Phone}</Text>
                    </View>
                    <View style={styles.userInfoRow}>
                        <Text style={styles.label}>Address:</Text>
                        <Text style={styles.info}>{userData.Address}</Text>
                    </View>
                </View>
            </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: Colors.background,
        paddingHorizontal: 20,
        paddingTop: 50,
    },
    header: {
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    profile: {
        alignItems: 'center',
        alignSelf: 'center',
    },
    profileImage: {
        width: 85,
        height: 85,
        borderRadius: 40,
    },
    noImageText: {
        fontSize: 16,
        color: Colors.textSecondary,
    },
    loadingContainer: {
        backgroundColor: Colors.background,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileInfo: {
        paddingTop: 15,
        paddingBottom: 20,
    },
    name: {
        fontSize: 20,
        color: Colors.textPrimary,
        marginBottom: 5,
    },
    username: {
        alignSelf: 'center',
        fontSize: 15,
        color: Colors.textSecondary,
    },
    userInfo: {
        marginTop: 0,
    },
    userInfoRow: {
        borderBottomWidth: 3,
        borderBottomColor: Colors.cardBackground,
        height: 60,
        padding: 5,
        margin: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        flex: 1,
        fontSize: 18,
        color: Colors.textSecondary,
    },
    info: {
        flex: 2,
        fontSize: 14,
        color: Colors.textPrimary,
    },
    logButton: {
        backgroundColor: Colors.textPrimary,
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
        alignSelf: 'center',
        marginTop: 50,
        width: 160,
    },
    logButtonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default UserProfile;
